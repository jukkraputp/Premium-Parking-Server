from datetime import datetime, timedelta
import json
from flask import Flask, request
from db import db

month_table = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
]

app = Flask(__name__)


@app.route('/check_in', methods=['GET'])  # OK
def check_in():
    can_check_in = 0
    current_time = datetime.utcnow() + timedelta(hours=7)
    str_time = format(current_time)
    year = str(current_time.year)
    month = month_table[int(current_time.month) - 1]
    day = str(current_time.day)
    hour = str(current_time.hour)
    search_time = day + " " + month + " " + year + " " + hour
    doc_ref = db.collection(u'RFID').document(search_time)

    user_rfid = request.args.get('RFID')
    doc = doc_ref.get()
    if doc.exists:
        table = doc.to_dict()
        for column in table:
            if table[column] == user_rfid:
                can_check_in = 1

    return format(can_check_in)


@app.route('/')
def hello():
    return 'Hello, World!'


@app.route('/api/v1/users', methods=['GET'])  # OK
def get_users():
    col_ref = db.collection(u'Users')
    docs = col_ref.stream()
    data = []
    for doc in docs:
        data.append(doc.to_dict())
    return json.dumps(data)


@app.route('/api/v1/user/<username>', methods=['GET'])  # OK
def get_user(username):
    doc_ref = db.collection(u'Users').document(username)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return 'User not found!', 404


@app.route('/api/v1/free-park', methods=['POST', 'GET'])  # OK
def free_park():
    if request.method == 'POST':
        data = request.get_json()
        doc_ref = db.collection(u'FreePark').document(
            'Slot' + str(data['slot']))
        doc_ref.set({
            'available': data['value']
        })
        print(data)
        return 'Success', 200
    else:
        col_ref = db.collection(u'FreePark')
        docs = col_ref.stream()
        available = 0
        for doc in docs:
            data = doc.to_dict()
            if data['available']:
                available += 1
        return format(available)


if __name__ == '__main__':
    app.run(debug=True)
