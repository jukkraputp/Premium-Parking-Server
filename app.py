from flask import Flask
from db import db

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/api/v1/users', methods=['GET'])
def get_users():
    col_ref = db.collection(u'Users')
    datas = col_ref.stream()
    if datas.exists:
        return datas
    else:
        return 'Users not found', 404