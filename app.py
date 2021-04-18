import os
from flask import Flask, json,send_from_directory
from flask_socketio import SocketIO

APP = Flask(__name__, static_folder='./build/static')

SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)


@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)

@SOCKETIO.on("login")
def login(data):
    '''Enters user info to database if not already logged in'''
    print("user logged in",data)
@SOCKETIO.on("logout")
def logout():
    '''Logs user out'''
    print("User logged out")


if __name__ == "__main__":
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )