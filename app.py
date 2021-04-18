import os
from flask import Flask, send_from_directory, json
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv, find_dotenv
from flask_socketio import SocketIO

APP = Flask(__name__, static_folder='./build/static')

load_dotenv(find_dotenv())

# Point SQLAlchemy to your Heroku database
APP.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL').replace('postgres','postgresql')
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

@SOCKETIO.on("requestAllStats")
def request_all_user_stats(data):
    """
    """
    all_players = models.Player.query.all()
    return_data = []
    for p in all_players:
        return_data.append({"username": p.username, "wins": p.wins, "losses": p.losses})
    SOCKETIO.emit(
        'requestAllStatsCallback',
        return_data,
        to=data["id"],
        broadcast=False,
        include_self=True
    )
    return
    
@SOCKETIO.on("requestStats")
def request_user_stats(data):
    """
    Queries the database for a user id and returns their stats
    """
    #from models import Player
    player = models.Player.query.filter_by(id=data["usr"]).first()
    return_data = {"username": player.username, "wins": player.wins, "losses": player.losses}
    SOCKETIO.emit(
        'requestStatsCallback',
        return_data,
        to=data["id"],
        broadcast=False,
        include_self=True
    )


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@SOCKETIO.on("login")
def login(data):
    '''Enters user info to database if not already logged in'''
    email = data['email']
    if (DB.session.query(
            models.Player).filter_by(email=email).first()
            is not None):
        print(f"{email} logged in")
    else:
        username = email[:email.index('@')]
        add_user(username,email)

    print("user logged in",data)

@SOCKETIO.on("logout")
def logout():
    '''Logs user out'''
    print("User logged out")

def add_user(username, email):
    '''Adds new user to database'''
    new_user = models.Player(username=username,email=email,wins=0,losses=0)
    DB.session.add(new_user)
    DB.session.commit()

if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call SOCKETIO.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )