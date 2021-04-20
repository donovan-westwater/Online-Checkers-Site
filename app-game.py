import os
from flask import Flask, send_from_directory, json
from flask_socketio import SocketIO
APP = Flask(__name__, static_folder='./build/static')
PLAYER = 1
SOCKETIO = SocketIO(APP,
                    cors_allowed_origins="*",
                    json=json,
                    manage_session=False)

@APP.route('/', defaults={"filename": "index.html"})
@APP.route('/<path:filename>')
def index(filename):
    return send_from_directory('./build', filename)
#Sockets go here. These are only for the game side of things

@SOCKETIO.on('board')
def on_board(data):  # data is whatever arg you pass in your emit call on client
    """Used for debug purposes."""
    print(str(data))
    # This emits the 'chat' event from the server to all clients except for
    # the client that emmitted the event that triggered this function
    SOCKETIO.emit('board', data, broadcast=True, include_self=False)


@SOCKETIO.on('change-turn')
def on_change_turn(data):
    """Called when player ends turn"""
    print(data)
    SOCKETIO.emit('change-turn', data, broadcast=True, include_self=False)

#When a client joins / starts a game from the home menu
#@SOCKETIO.on('join-game')
#def on_join_game(data):  # data is whatever arg you pass in your emit call on client
#    """Used for debug purposes."""
#    #print(str(data))
#    # This emits the 'chat' event from the server to all clients except for
#    # the client that emmitted the event that triggered this function
#    SOCKETIO.emit('join-game', data, broadcast=True, include_self=False)


# When a client disconnects from this Socket connection, this function is run
@SOCKETIO.on('disconnect')
def on_disconnect():
    """Called on disconnect"""
    print('User disconnected and left the game!')
#This branch only
@SOCKETIO.on('connect')
def on_connect():
    """Called on connect"""
    print('User connected and joined the game!')
    global PLAYER
    PLAYER += 1
    name = "Username"+str(PLAYER)
    SOCKETIO.emit('join-game',name, broadcast=True, include_self=True)
    
if __name__ == "__main__":
    # Note that we don't call app.run anymore. We call SOCKETIO.run with app arg
    SOCKETIO.run(
        APP,
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', 8081)),
    )
