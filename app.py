import datetime
import json 
from flask import Flask, request
from httplib2 import Response
from db import db

month_table = {
        '01':"Jan",
        '02':"Feb",
        '03':"Mar",
        '04':"Apr",
        '05':"May",
        '06':"Jun",
        '07':"Jul",
        '08':"Aug",
        '09':"Sep",
        '10':"Oct",
        '11':"Nov",
        '12':"Dec",
            }

app = Flask(__name__)

@app.route('/check_in', methods=['GET'])
def check_in():
    can_check_in = 0
    current_time = datetime.datetime.now() 
    str_time = format(current_time)
    year, month_index, day = str_time.split()[0].split("-")
    current_hour = str_time.split()[1].split(":")[0]
    search_time = day + " " + month_table[month_index] + " " + year + " " + current_hour
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

@app.route('/api/v1/users', methods=['GET'])
def get_users():
    col_ref = db.collection(u'Users')
    docs = col_ref.stream()
    data = []
    for doc in docs:
        data.append(doc.to_dict())
    return json.dumps(data)

@app.route('/api/v1/user/<username>', methods=['GET'])
def get_user(username):
    doc_ref = db.collection(u'Users').document(username)
    doc = doc_ref.get()
    if doc.exists:
        return doc.to_dict()
    else:
        return 'User not found!', 404

@app.route('/api/v1/free-park', methods=['POST'])
def adjust_free_park_slots():
    data = request.get_json()
    doc_ref = db.collection(u'FreePark').document('Slot' + str(data['slot']))
    doc_ref.set({
        'available': data['value']
    })
    print(data)
    return 'Success', 200
        
if __name__ == '__main__':
    app.run(debug=True)