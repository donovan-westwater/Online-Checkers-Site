"""
Server for online checkers
"""
import os
from flask import Flask, send_from_directory, json
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from flask_socketio import SocketIO


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
    ['', 'x', '', 'x', '', 'x', '', 'x'],
    ['x', '', 'x', '', 'x', '', 'x', ''],
    ['', 'x', '', 'x', '', 'x', '', 'x'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['o', '', 'o', '', 'o', '', 'o', ''],
    ['', 'o', '', 'o', '', 'o', '', 'o'],
    ['o', '', 'o', '', 'o', '', 'o', '']
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

@SOCKETIO.on('reset')
def on_reset():
    """Resets the game for everyone"""
    global P1, BOARDSTATE, TURN
    TURN = P1
    BOARDSTATE = [
        ['', 'x', '', 'x', '', 'x', '', 'x'],
        ['x', '', 'x', '', 'x', '', 'x', ''],
        ['', 'x', '', 'x', '', 'x', '', 'x'],
        ['', '', '', '', '', '', '', ''],
        ['', '', '', '', '', '', '', ''],
        ['o', '', 'o', '', 'o', '', 'o', ''],
        ['', 'o', '', 'o', '', 'o', '', 'o'],
        ['o', '', 'o', '', 'o', '', 'o', '']
    ]
    SOCKETIO.emit('give-board', {"board": BOARDSTATE}, broadcast=True, include_self=True)
    SOCKETIO.emit('change-turn', TURN, broadcast=True, include_self=True)

@SOCKETIO.on('get-board')
def on_get_board():
    """Used for giving the board state to a player who just joined"""
    global BOARDSTATE
    SOCKETIO.emit('give-board', {"board": BOARDSTATE}, broadcast=True, include_self=True)

@SOCKETIO.on('make-move')
def on_move(data):  # data is whatever arg you pass in your emit call on client
    """Used for making moves"""
    global BOARDSTATE
    #BOARDSTATE[data["row"]][data["col"]] = BOARDSTATE[data["srow"]][data["scol"]]
    #BOARDSTATE[data["srow"]][data["scol"]] = ""
    moves = data["moves"]
    print(data)
    print(moves)
    if (TURN == P1 and BOARDSTATE[moves[0][0]][moves[0][1]].lower() == 'o') or (
            TURN == P2 and BOARDSTATE[moves[0][0]][moves[0][1]].lower() == "x"):
        prev = moves[0]
        for move in moves[1:]:
            BOARDSTATE[move[0]][move[1]] = BOARDSTATE[prev[0]][prev[1]]
            BOARDSTATE[prev[0]][prev[1]] = ""
            row_j = (prev[0]+move[0])/2
            col_j = (prev[1]+move[1])/2
            print(row_j, col_j)
            if(int(row_j) == row_j and int(col_j) == col_j):
                BOARDSTATE[int(row_j)][int(col_j)] = ""
            prev = move
            if move[0] == 0 and BOARDSTATE[move[0]][move[1]] == 'o':
                BOARDSTATE[move[0]][move[1]] = 'O'
            elif move[0] == 7 and BOARDSTATE[move[0]][move[1]] == 'x':
                BOARDSTATE[move[0]][move[1]] = 'X'
        o_count = 0
        x_count = 0
        for row in BOARDSTATE:
            for cell in row:
                if cell.lower() == "o":
                    o_count += 1
                if cell.lower() == "x":
                    x_count += 1
        if o_count == 0 or x_count == 0:
            p1_model = DB.session.query(models.Player).filter_by(username=P1).first()
            p2_model = DB.session.query(models.Player).filter_by(username=P2).first()
            if o_count == 0:
                print(f"Scores {p2_model.wins}, {p1_model.losses}")
                p2_model.wins += 1
                p1_model.losses += 1
                print("X wins!")
                print(f"Scores {p2_model.wins}, {p1_model.losses}")
            elif x_count == 0:
                print(f"Scores {p1_model.wins}, {p2_model.losses}")
                p1_model.wins += 1
                p2_model.losses += 1
                print("O wins!")
                print(f"Scores {p1_model.wins}, {p2_model.losses}")
            DB.session.commit()
            DB.session.close()

        SOCKETIO.emit('give-board', {"board": BOARDSTATE}, broadcast=True, include_self=True)
        print("moved")
        change_turn()

@SOCKETIO.on('connect-game')
def on_connect(data):
    """Called on connect"""
    print('User connected and joined the game!')
    global P1, P2, TURN
    spectator = False
    print("ID: ", data['id'])

    if TURN is None:
        TURN = data["user"]
        print("Initial turn", TURN)
    if P1 is None:
        P1 = data["user"]
        piece = "o"
        print("Name: ", P1)
    elif P2 is None:
        P2 = data["user"]
        piece = "x"
        print("Name: ", P2)
    else:
        spectator = True
        print("Spectator")
    #Emit new spectator, if spectator, add user if spots still open
    if spectator:
        SOCKETIO.emit('add-spectator', {"user":data["user"]}, broadcast=True, include_self=True)
    else:
        SOCKETIO.emit('add-user', {
            "user": data["user"],
            "piece": piece}, to=data['id'], broadcast=False, include_self=True)
        SOCKETIO.emit('change-turn', TURN, broadcast=True, include_self=True)
        on_get_board()

def get_users():
    """
    retrieves all the users in the database
    """
    all_players = models.Player.query.all()
    DB.session.close()
    return_data = []
    for players in all_players:
        return_data.append({
            "username": players.username,
            "wins": players.wins,
            "losses": players.losses,
            "email": players.email})
    sort_key = lambda x: 0 if (
        x.get("wins")+x.get("losses") == 0) else x.get("wins")/(x.get("wins")+x.get("losses"))
    return_data.sort(key=sort_key, reverse=True)
    return return_data

@SOCKETIO.on("requestAllStats")
def request_all_user_stats(data):
    """
    Gets all the user stats
    """
    return_data = get_users()
    print(return_data)
    user_data = [
        [i+1, return_data[i]] for i in range(len(return_data)) if (
            return_data[i].get('email') == data["email"]
        )][0]
    SOCKETIO.emit(
        'requestAllStatsCallback',
        {'user':user_data,
         'all':return_data},
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
        print("Spectator logging out")
        SOCKETIO.emit('remove-spectator', {"user":data["user"]}, broadcast=True, include_self=True)
        #print("Invalid logout call")
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
