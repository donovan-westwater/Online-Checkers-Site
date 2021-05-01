"""
Server for online checkers
"""
import os
from flask import Flask, send_from_directory, json
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from flask_socketio import SocketIO

import math

APP = Flask(__name__, static_folder='./build/static')

load_dotenv(find_dotenv())

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL').replace('postgres', 'postgresql')
# Gets rid of a warning
APP.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

DB = SQLAlchemy(APP)
import models

DB.create_all()
DB.session.commit()

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

P1 = None
P2 = None
TURN = None
BOARDSTATE = [
    ['', 'X', '', 'X', '', 'X', '', 'X'],
    ['X', '', 'X', '', 'X', '', 'X', ''],
    ['', 'X', '', 'X', '', 'X', '', 'X'], 
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['O', '', 'O', '', 'O', '', 'O', ''],
    ['', 'O', '', 'O', '', 'O', '', 'O'],
    ['O', '', 'O', '', 'O', '', 'O', '']
]

def change_turn():
    """Called when player ends turn"""
    global P1, P2, TURN
    if TURN == P1:
        TURN = P2
    else:
        TURN = P1
    print("Turn: ", TURN)
    SOCKETIO.emit('change-turn', TURN, broadcast=True, include_self=True)

@SOCKETIO.on('get-board')
def on_get_board():
    """Used for giving the board state to a player who just joined"""
    global BOARDSTATE
    SOCKETIO.emit('give-board', { "board": BOARDSTATE }, broadcast=True, include_self=True)
    
@SOCKETIO.on('make-move')
def on_move(data):  # data is whatever arg you pass in your emit call on client
    """Used for making moves"""
    global BOARDSTATE
    #BOARDSTATE[data["row"]][data["col"]] = BOARDSTATE[data["srow"]][data["scol"]]
    #BOARDSTATE[data["srow"]][data["scol"]] = ""
    
    moves = data["moves"]
    print(data)
    
    print(moves)
    
    if (TURN == P1 and BOARDSTATE[moves[0][0]][moves[0][1]] == "O") or (TURN == P2 and BOARDSTATE[moves[0][0]][moves[0][1]] == "X"):
        prev = moves[0]
        for m in moves[1:]:
            BOARDSTATE[m[0]][m[1]] = BOARDSTATE[prev[0]][prev[1]]
            BOARDSTATE[prev[0]][prev[1]] = ""
            rj = (prev[0]+m[0])/2
            cj = (prev[1]+m[1])/2
            print(rj, cj)
            if(int(rj)== rj and int(cj) == cj):
                BOARDSTATE[int(rj)][int(cj)] = ""
            prev = m
    
        SOCKETIO.emit('give-board', { "board": BOARDSTATE }, broadcast=True, include_self=True)
        print("moved")
        change_turn()

@SOCKETIO.on('connect-game')
def on_connect(data):
    """Called on connect"""
    print('User connected and joined the game!')
    global P1, P2, TURN
    print("ID: ", data['id'])

    if TURN is None:
        TURN = data["user"]
        print("Initial turn", TURN)
    if P1 is None:
        P1 = data["user"]
        piece = "O"
        print("Name: ", P1)
    else:
        P2 = data["user"]
        piece = "X"
        print("Name: ", P2)

    SOCKETIO.emit('add-user', { "user": data["user"], "piece": piece}, to=data['id'], broadcast=False, include_self=True)
    SOCKETIO.emit('change-turn', TURN, broadcast=True, include_self=True)
    on_get_board()

@SOCKETIO.on("requestAllStats")
def request_all_user_stats(data):
    """
    Gets all the user stats
    """
    all_players = models.Player.query.all()
    DB.session.close()
    return_data = []
    for players in all_players:
        return_data.append({
            "username": players.username,
            "wins": players.wins,
            "losses": players.losses})
    SOCKETIO.emit(
        'requestAllStatsCallback',
        return_data,
        to=data["id"],
        broadcast=False,
        include_self=True
    )

@SOCKETIO.on("requestStats")
def request_user_stats(data):
    """
    Queries the database for a user id and returns their stats
    """
    #from models import Player
    player = models.Player.query.filter_by(id=data["usr"]).first()
    DB.session.close()
    return_data = {"username": player.username, "wins": player.wins, "losses": player.losses}
    SOCKETIO.emit(
        'requestStatsCallback',
        return_data,
        to=data["id"],
        broadcast=False,
        include_self=True
    )

@SOCKETIO.on("login")
def login(data):
    '''Enters user info to database if not already logged in'''
    email = data['email']
    if (DB.session.query(
            models.Player).filter_by(email=email).first()
            is not None):
        print(f"{email} logged in")
        DB.session.close()
    else:
        username = email[:email.index('@')]
        add_user(username, email)
    print("user logged in", data)

@SOCKETIO.on("logout")
def logout(data):
    """
    Logs user out
    """
    global P1, P2
    if data["user"] == P1:
        P1 = None
    elif data["user"] == P2:
        P2 = None
    else:
        print("Invalid logout call")
    print("User logged out")

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    """
    Serve the index?
    """
    return send_from_directory('./build', filename)

def add_user(username, email):
    '''Adds new user to database'''
    new_user = models.Player(username=username, email=email, wins=0, losses=0)
    DB.session.add(new_user)
    DB.session.commit()
    DB.session.close()


if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call SOCKETIO.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
