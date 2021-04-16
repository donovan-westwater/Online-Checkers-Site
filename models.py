"""
Layout for the Player table
"""
from app import DB

class Player(DB.Model):
    """
    A player table
    """
    id = DB.Column(DB.Integer, primary_key=True)
    username = DB.Column(DB.String(80), unique=True, nullable=False)
    wins = DB.Column(DB.Integer, nullable=False)
    losses = DB.Column(DB.Integer, nullable=False)

    def __repr__(self):
        """
        DOCSTRING
        """
        return '<Player %r>' % self.username
