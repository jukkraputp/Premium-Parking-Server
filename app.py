from flask import Flask
from db import db

app = Flask(__name__)

@app.route('/')
def hello():
    return 'Hello, World!'

@app.route('/api/v1/users', methods=['GET'])
def get_users():
    col_ref = db.collection(u'Users')
    docs = col_ref.stream()
    data = []
    for doc in docs:
        data.append(doc.to_dict())
    return data