from flask import Flask, request
import firebase_admin
from firebase_admin import credentials, firestore
import datetime 

cred = credentials.Certificate("embeddedfinalproject-firebase-adminsdk-d7rzl-1a47276dbc.json")
firebase_admin.initialize_app(cred)
Months = {
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

db = firestore.client()

app = Flask(__name__)

# @app.route('/')
# def hello():
#     doc_ref = db.collection(u'llll').document(u'olol')
# # doc_ref = db.collection(u'RFID').document(u'16 Mar 2022 16')
#     doc_ref.set({
#         u'first': u'test',
#         u'last': u'Lovelace',
#         u'born': 1815
#     })

#     return 'Hello, World!'

@app.route('/rfid', methods=['POST', 'GET'])
def check_in():
    can_check_in = 0
    current_time = datetime.datetime.now() 
    str_time = format(current_time)
    year, mon, day = str_time.split()[0].split("-")
    current_hour = str_time.split()[1].split(":")[0]
    search_time = day + " " + Months[mon] + " " + year + " " + current_hour
    doc_ref = db.collection(u'RFID').document(search_time)
    
    user_rfid = request.args.get('RFID')
    doc = doc_ref.get()
    if doc.exists:
        table = doc.to_dict()
        for column in table:
            if table[column] == user_rfid:
                can_check_in = 1

    return format(can_check_in)