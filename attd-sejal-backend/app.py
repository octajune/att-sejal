import base64
import hashlib
import os
import random
import re
import datetime
import flask
import numpy as np
from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
import face_recognition

from flask_cors import CORS, cross_origin

app = Flask(__name__)
app.config[
    'SQLALCHEMY_DATABASE_URI'] = 'postgresql://sejal:6U0KN8UIMMEFWE7E$@sejal-database-server.postgres.database.azure.com/postgres?sslmode=require'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_POOL_SIZE'] = 20
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 300
db = SQLAlchemy(app)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
email_regex = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
PATH = "/tmp/profiles/"
TEMP_PATH = "/tmp/temp/"
BASE_ROUTE = '/api/v1/'


class Attendance(db.Model):
    id = db.Column(db.Integer, unique=True, nullable=False, primary_key=True, autoincrement=True)
    class_name = db.Column(db.String(100), unique=False, nullable=False)
    student_email_id = db.Column(db.String(30), unique=False, nullable=False)
    teacher_email_id = db.Column(db.String(30), unique=False, nullable=False)
    attendance_marked = db.Column(db.Integer, unique=False, nullable=False)
    start_time = db.Column(db.DateTime, unique=False, nullable=False)
    end_time = db.Column(db.DateTime, unique=False, nullable=False)
    marked_time = db.Column(db.DateTime, unique=False, nullable=True)
    create_datetime = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    class_date = db.Column(db.Date)

    def __init__(self, class_name, student_email_id, teacher_email_id, attendance_marked, start_time, end_time,
                 class_date):
        self.class_name = class_name
        self.student_email_id = student_email_id
        self.teacher_email_id = teacher_email_id
        self.attendance_marked = attendance_marked
        self.start_time = start_time
        self.end_time = end_time
        self.class_date = class_date

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Student(db.Model):
    email_id = db.Column(db.String(30), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    image_path = db.Column(db.String(256), unique=True, nullable=False)
    passwd_hash = db.Column(db.String(100), unique=False, nullable=False)

    def __init__(self, name, image_path, email_id, passwd_hash):
        self.email_id = email_id
        self.name = name
        self.image_path = image_path
        self.passwd_hash = passwd_hash

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Review(db.Model):
    id = db.Column(db.Integer, unique=True, nullable=False, primary_key=True, autoincrement=True)
    review = db.Column(db.String(10000), unique=False, nullable=False)

    def __init__(self, review):
        self.review = review

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Teacher(db.Model):
    email_id = db.Column(db.String(30), unique=True, nullable=False, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    image_path = db.Column(db.String(256), unique=True, nullable=False)
    passwd_hash = db.Column(db.String(100), unique=False, nullable=False)

    def __init__(self, name, image_path, email_id, passwd_hash):
        self.name = name
        self.email_id = email_id
        self.image_path = image_path
        self.passwd_hash = passwd_hash

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class Token(db.Model):
    email_id = db.Column(db.String(30), unique=False, nullable=False, primary_key=True)
    token = db.Column(db.String(256), unique=False, nullable=False, primary_key=True)
    user_type = db.Column(db.Integer, unique=False, nullable=False, primary_key=True)

    def __init__(self, email_id, token, user_type):
        self.email_id = email_id
        self.token = token
        self.user_type = user_type


db.create_all()


@app.route('/')
def hello_world():  # put application's code here
    return {"SUCCESS": "Hi! I am Sejal. This is the backend of my Microsoft Engage Submission! :)"}


@app.route(BASE_ROUTE + 'test_insertion', methods=['GET'])
def test_insert():
    Token('test', 'test', 0)
    Student('sdf', 'sdf', 'sdf', 'sadfsdf')
    Teacher('sdf', 'sdf', 'sdf', 'sfdsadfa')
    Attendance(class_name="COP 4600", student_email_id="test@test.com",
               teacher_email_id="teacher@test.com",
               attendance_marked=0,
               start_time=datetime.datetime(2022, 5, 14, 10, 30, 0),
               end_time=datetime.datetime(2022, 5, 14, 11, 30, 0),
               class_date=datetime.date(2022, 5, 14))
    return {}


@app.route(BASE_ROUTE + 'submit_review', methods=['POST'])
def submit_review():
    body = flask.request.values
    review = body.getlist('msg')[0]
    new_review = Review(review)
    db.session.add(new_review)
    db.session.commit()
    return {"SUCCESS": "Message Added Successfully"}


@app.route(BASE_ROUTE + 'register_teacher', methods=['POST'])
@cross_origin()
def register_teacher():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    name = body.getlist('name')[0]
    passwd_hash = body.getlist('passwd_hash')[0]
    image_file = body.getlist('image')[0]

    if len(name.strip()) == 0 or len(email_id.strip()) == 0:
        return {"ERROR": "Empty email or name received"}

    # Check if the email is of valid type or not
    if not re.search(email_regex, email_id):
        return {"ERROR": "Invalid email ID provided"}

    # Check if the teacher's email Id exists in database already
    exis_teacher = Teacher.query.get(email_id)
    if exis_teacher is not None:
        return {"ERROR": "User already exists with the same email ID"}

    # Registration Begins
    #  Adding the token for the teacher
    x = ''.join(random.choice('0123456789ABCDEF') for i in range(16))
    token = hashlib.sha256(x.encode()).hexdigest()
    new_token = Token(email_id, token, 1)
    db.session.add(new_token)

    # Saving the profile
    x = ''.join(random.choice('0123456789ABCDEF') for i in range(16))
    image_path = hashlib.sha256(x.encode()).hexdigest()
    new_teacher = Teacher(name=name, email_id=email_id, image_path=image_path, passwd_hash=passwd_hash)
    db.session.add(new_teacher)
    image_file = image_file.replace('data:image/png;base64,', '')
    image_file = image_file.replace(' ', '+')
    image_file = base64.b64decode(image_file)
    g = open(PATH + image_path + ".png", "wb")
    g.write(image_file)
    g.close()
    # image_file.save(PATH + "{}.png".format(image_path))
    profile_pic = face_recognition.load_image_file(PATH + "{}.png".format(image_path))
    face_location = face_recognition.face_locations(profile_pic)
    if face_location is None or len(face_location) == 0:
        return {"ERROR": "No Face Detected"}
    db.session.commit()
    x = new_teacher.as_dict()
    x['token'] = new_token.token
    x['user_type'] = 1
    return x


# get marked attendance
@app.route(BASE_ROUTE + "get_marked_attendance", methods=['POST'])
def get_marked_attendance():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    name = body.getlist('name')[0]
    token = body.getlist('token')[0]
    if get_valid_token(email_id, 0) != token:
        return {"ERROR": "Incorrect token provided"}
    # Token.query.filter_by(email_id=email_id, user_type=1).first()
    cur_datetime = datetime.datetime.now()

    list = Attendance.query.filter_by(student_email_id=email_id, attendance_marked=1).order_by(
        Attendance.start_time.desc()).all()
    final_items = []
    for item in list:
        final_items.append(item.as_dict())
    return jsonify(final_items)


@app.route(BASE_ROUTE + "get_profile", methods=['POST'])
def get_profile():
    body = flask.request.values
    token = body.getlist('token')[0]
    email_id = body.getlist('email_id')[0]
    if get_valid_token(email_id, 0) != token:
        return {"ERROR": "Incorrect token provided"}
    user_type = body.getlist('user_type')[0]
    if user_type == 1:
        exis_teacher = Teacher.query.get(email_id)
        exis_teacher.passwd_hash = ''
        return exis_teacher.as_dict()
    else:
        exis_student = Student.query.get(email_id)
        exis_student.passwd_hash = ''
        return exis_student.as_dict()


@app.route(BASE_ROUTE + "mark_attendance", methods=['POST'])
def mark_attendance():
    body = flask.request.values
    token = body.getlist('token')[0]
    email_id = body.getlist('email_id')[0]
    if get_valid_token(email_id, 0) != token:
        return {"ERROR": "Incorrect token provided"}

    image_file = flask.request.files.get('image', '')
    x = ''.join(random.choice('0123456789ABCDEF') for i in range(16))
    temp_file_name = hashlib.sha256(x.encode()).hexdigest()
    image_file = body.getlist('image')[0]
    image_file = image_file.replace('data:image/png;base64,', '')
    image_file = image_file.replace(' ', '+')
    image_file = base64.b64decode(image_file)
    g = open(TEMP_PATH + temp_file_name + ".png", "wb")
    g.write(image_file)
    g.close()

    class_name = body.getlist('class_name')[0]
    start_time = body.getlist('start_time')[0].split(':')
    end_time = body.getlist('end_time')[0].split(':')
    class_date = body.getlist('class_date')[0].split('-')
    class_datetime = datetime.date(int(class_date[0]), int(class_date[1]), int(class_date[2]))
    start_datetime = datetime.datetime(int(class_date[0]), int(class_date[1]), int(class_date[2]), int(start_time[0]),
                                       int(start_time[1]))
    end_datetime = datetime.datetime(int(class_date[0]), int(class_date[1]), int(class_date[2]), int(end_time[0]),
                                     int(end_time[1]))

    exis_student = Student.query.get(email_id)
    attend_student = db.session.query(Attendance).filter_by(
        student_email_id=email_id,
        class_name=class_name,
        start_time=start_datetime,
        end_time=end_datetime,
        class_date=class_datetime,
        attendance_marked=0,
    ).first()
    if attend_student is None:
        return {"ERROR": "No pending attendance record found for the values provided."}

    image_pic = face_recognition.load_image_file(TEMP_PATH + temp_file_name + ".png")
    face_location = face_recognition.face_locations(image_pic)
    if face_location is None or len(face_location) == 0:
        return {"ERROR": "No Image Detected"}

    profile_pic = face_recognition.load_image_file(PATH + exis_student.image_path + ".png")
    profile_pic_encoding = face_recognition.face_encodings(profile_pic)[0]

    image_encoding = face_recognition.face_encodings(image_pic)[0]
    is_target_face = face_recognition.compare_faces(np.array([profile_pic_encoding]), image_encoding, tolerance=0.5)
    if is_target_face[0]:
        attend_student.attendance_marked = 1
        attend_student.marked_time = datetime.datetime.now()
        db.session.commit()
        return {"SUCCESS": "Attendance marked Successfully"}
    else:
        return {"ERROR": "Image not matching"}


@app.route(BASE_ROUTE + 'login_teacher', methods=['POST'])
@cross_origin()
def login_teacher():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    passwd_hash = body.getlist('passwd_hash')[0]
    if not re.search(email_regex, email_id):
        return {"ERROR": "Invalid email ID provided"}
    exis_token = Token.query.filter_by(email_id=email_id, user_type=1).first()
    exis_teacher = Teacher.query.filter_by(email_id=email_id).first()
    if exis_token is None:
        return {"ERROR": "User doesn't exist"}
    elif exis_teacher.passwd_hash != passwd_hash:
        return {"ERROR": "Incorrect password provided"}
    x = exis_teacher.as_dict()
    x['token'] = exis_token.token
    x['user_type'] = 1
    return x


def get_valid_token(email_id, user_type):
    tokens_list = Token.query.filter_by(email_id=email_id, user_type=user_type).first()
    if tokens_list is None:
        return ''
    return tokens_list.token


@app.route(BASE_ROUTE + 'register_student', methods=['POST'])
@cross_origin()
def register_student():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    name = body.getlist('name')[0]
    passwd_hash = body.getlist('passwd_hash')[0]
    image_file = body.getlist('image')[0]

    if len(name.strip()) == 0 or len(email_id.strip()) == 0:
        return {"ERROR": "Empty email or name received"}

    # Check if the email is of valid type or not
    if not re.search(email_regex, email_id):
        return {"ERROR": "Invalid email ID provided"}

    # Check if the teacher's email Id exists in database already
    exis_student = Student.query.get(email_id)
    if exis_student is not None:
        return {"ERROR": "User already exists with the same email ID"}

    # Registration Begins
    #  Adding the token for the teacher
    x = ''.join(random.choice('0123456789ABCDEF') for i in range(16))
    token = hashlib.sha256(x.encode()).hexdigest()
    new_token = Token(email_id, token, 0)
    db.session.add(new_token)

    # Saving the profile
    x = ''.join(random.choice('0123456789ABCDEF') for i in range(16))
    image_path = hashlib.sha256(x.encode()).hexdigest()
    new_student = Student(name=name, email_id=email_id, image_path=image_path, passwd_hash=passwd_hash)
    db.session.add(new_student)
    image_file = image_file.replace('data:image/png;base64,', '')
    image_file = image_file.replace(' ', '+')
    image_file = base64.b64decode(image_file)
    g = open(PATH + image_path + ".png", "wb")
    g.write(image_file)
    g.close()
    # image_file.save(PATH + "{}.png".format(image_path))
    profile_pic = face_recognition.load_image_file(PATH + "{}.png".format(image_path))
    face_location = face_recognition.face_locations(profile_pic)
    if face_location is None or len(face_location) == 0:
        return {"ERROR": "No Face Detected"}
    db.session.commit()
    x = new_student.as_dict()
    x['token'] = new_token.token
    x['user_type'] = 1
    return x


@app.route(BASE_ROUTE + 'login_student', methods=['POST'])
def login_student():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    passwd_hash = body.getlist('passwd_hash')[0]
    if not re.search(email_regex, email_id):
        return {"ERROR": "Invalid email ID provided"}
    exis_token = Token.query.filter_by(email_id=email_id, user_type=0).first()
    exis_student = Student.query.filter_by(email_id=email_id).first()
    if exis_token is None:
        return {"ERROR": "User doesn't exist"}
    elif exis_student.passwd_hash != passwd_hash:
        return {"ERROR": "Incorrect password provided"}
    x = exis_student.as_dict()
    x['token'] = exis_token.token
    x['user_type'] = 0
    return x


@app.route(BASE_ROUTE + 'get_missed_attendance', methods=['POST'])
def get_missed_attendance():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    name = body.getlist('name')[0]
    token = body.getlist('token')[0]
    if get_valid_token(email_id, 0) != token:
        return {"ERROR": "Incorrect token provided"}
    # Token.query.filter_by(email_id=email_id, user_type=1).first()
    cur_datetime = datetime.datetime.now()

    list = Attendance.query.filter(Attendance.end_time < cur_datetime).order_by(Attendance.start_time.desc()).all()
    final_items = []
    for item in list:
        if item.student_email_id == email_id and item.attendance_marked == 0:
            final_items.append(item.as_dict())
    return jsonify(final_items)


@app.route(BASE_ROUTE + 'get_pending_attendance', methods=['POST'])
def get_pending_attendance():
    body = flask.request.values
    email_id = body.getlist('email_id')[0]
    name = body.getlist('name')[0]
    token = body.getlist('token')[0]
    if get_valid_token(email_id, 0) != token:
        return {"ERROR": "Incorrect token provided"}
    # Token.query.filter_by(email_id=email_id, user_type=1).first()
    cur_datetime = datetime.datetime.now()

    list = Attendance.query.filter(Attendance.start_time <= cur_datetime).order_by(Attendance.start_time.desc()).all()
    final_items = []
    for item in list:
        if item.student_email_id == email_id and item.attendance_marked == 0 and item.end_time >= cur_datetime:
            final_items.append(item.as_dict())
    return jsonify(final_items)


@app.route(BASE_ROUTE + 'get_class_attendance', methods=['POST'])
@cross_origin()
def get_class_attendance():
    body = flask.request.values
    teacher_email_id = body.getlist('email_id')[0]
    teacher_name = body.getlist('name')[0]
    token = body.getlist('token')[0]
    if get_valid_token(teacher_email_id, 1) != token:
        return {"ERROR": "Incorrect token provided"}
    class_name = body.getlist('class_name')[0]
    start_time = body.getlist('start_time')[0].split(':')
    end_time = body.getlist('end_time')[0].split(':')
    class_date = body.getlist('class_date')[0].split('/')
    class_datetime = datetime.date(int(class_date[0]), int(class_date[1]), int(class_date[2]))
    start_datetime = datetime.datetime(int(class_date[0]), int(class_date[1]), int(class_date[2]), int(start_time[0]),
                                       int(start_time[1]))
    end_datetime = datetime.datetime(int(class_date[0]), int(class_date[1]), int(class_date[2]), int(end_time[0]),
                                     int(end_time[1]))
    list = Attendance.query.filter_by(teacher_email_id=teacher_email_id, class_name=class_name,
                                      start_time=start_datetime, end_time=end_datetime, class_date=class_datetime)

    final_items = []
    for item in list:
        final_items.append(item.as_dict())

    return jsonify(final_items)


@app.route(BASE_ROUTE + 'get_classes_by_teacher', methods=['POST'])
@cross_origin()
def get_classes_by_teacher():
    body = flask.request.values
    teacher_email_id = body.getlist('email_id')[0]
    token = body.getlist('token')[0]
    if get_valid_token(teacher_email_id, 1) != token:
        return {"ERROR": "Incorrect token provided"}
    list = Attendance.query.filter_by(teacher_email_id=teacher_email_id).order_by(
        Attendance.start_time.desc())
    final_items = []
    for item in list:
        final_items.append(item.as_dict())

    return jsonify(final_items)

@app.route(BASE_ROUTE + 'get_present_absent_classes_by_teacher', methods=['POST'])
@cross_origin()
def get_present_absent_classes_by_teacher():
    body = flask.request.values
    teacher_email_id = body.getlist('email_id')[0]
    token = body.getlist('token')[0]
    if get_valid_token(teacher_email_id, 1) != token:
        return {"ERROR": "Incorrect token provided"}
    list = Attendance.query.filter_by(teacher_email_id=teacher_email_id).order_by(
        Attendance.start_time.desc())
    final_items = {}
    for item in list:
        if item.class_name not in final_items:
            final_items[item.class_name] = {"total":0, "present":0, "absent":0}

        final_items[item.class_name]['total'] = 1 + final_items[item.class_name]['total']
        if item.attendance_marked == 1:
            final_items[item.class_name]['present'] = 1 + final_items[item.class_name]['present']
        else:
            final_items[item.class_name]['absent'] = 1 + final_items[item.class_name]['absent']
    return jsonify(final_items)

@app.route(BASE_ROUTE + 'get_latest_class_by_teacher', methods=['POST'])
@cross_origin()
def get_latest_class_by_teacher():
    body = flask.request.values
    teacher_email_id = body.getlist('email_id')[0]
    token = body.getlist('token')[0]
    if get_valid_token(teacher_email_id, 1) != token:
        return {"ERROR": "Incorrect token provided"}
    list = Attendance.query.filter_by(teacher_email_id=teacher_email_id).order_by(
        Attendance.start_time.desc())
    if list is None:
        return {"ERROR":"You have no pending attendance requests"}
    final_items = []
    first = list[0].class_name
    for item in list:
        if item.class_name is first:
            final_items.append(item.as_dict())

    return jsonify(final_items)

@app.route(BASE_ROUTE + 'get_attendance_time_records', methods=['POST'])
@cross_origin()
def get_attendance_time_records():
    body = flask.request.values
    teacher_email_id = body.getlist('email_id')[0]
    token = body.getlist('token')[0]
    if get_valid_token(teacher_email_id, 1) != token:
        return {"ERROR": "Incorrect token provided"}
    list = Attendance.query.filter_by(teacher_email_id=teacher_email_id).order_by(
        Attendance.marked_time.desc()).limit(100)
    final_items = []
    for item in list:
        if item.marked_time is not None:
            final_items.append({"email_id":item.student_email_id, "time":item.marked_time})

    return jsonify(final_items)

@app.route(BASE_ROUTE + 'get_student_class_record', methods=['POST'])
@cross_origin()
def get_student_class_record():
    body = flask.request.values
    teacher_email_id = body.getlist('email_id')[0]
    token = body.getlist('token')[0]
    if get_valid_token(teacher_email_id, 1) != token:
        return {"ERROR": "Incorrect token provided"}
    list = Attendance.query.filter_by(teacher_email_id=teacher_email_id).order_by(
        Attendance.start_time.desc()).limit(100)
    final_items = {}
    for item in list:
        key = item.student_email_id + "|" + item.class_name
        if key not in final_items:
            final_items[key] = {"total": 0, "present": 0, "absent": 0}
        final_items[key]['total'] = 1 + final_items[key]['total']
        if item.attendance_marked == 1:
            final_items[key]['present'] = 1 + final_items[key]['present']
        else:
            final_items[key]['absent'] = 1 + final_items[key]['absent']

    return jsonify(final_items)

@app.route(BASE_ROUTE + "create_class", methods=['POST'])
@cross_origin()
def create_class():
    body = flask.request.values
    token = body.getlist('token')[0]
    teacher_email_id = body.getlist('email_id')[0]
    token_in_storage = get_valid_token(teacher_email_id, 1)
    if token_in_storage != token:
        return {"ERROR": "Incorrect token provided"}

    if not re.search(email_regex, teacher_email_id):
        return {"ERROR": "Invalid teacher email ID provided"}
    class_name = body.getlist('class_name')[0]
    start_time = body.getlist('start_time')[0].split(':')
    end_time = body.getlist('end_time')[0].split(':')
    class_date = body.getlist('class_date')[0].split('-')
    class_date_datetime = datetime.date(int(class_date[0]), int(class_date[1]), int(class_date[2]))
    start_date_time = datetime.datetime(int(class_date[0]), int(class_date[1]), int(class_date[2]), int(start_time[0]),
                                        int(start_time[1]))
    end_date_time = datetime.datetime(int(class_date[0]), int(class_date[1]), int(class_date[2]), int(end_time[0]),
                                      int(end_time[1]))
    student_email_ids = body.getlist('student_email_ids')[0].split(',')
    for student_email_id in student_email_ids:
        student_email_id = student_email_id.strip()
        db.session.add(Attendance(class_name=class_name, student_email_id=student_email_id,
                                  teacher_email_id=teacher_email_id, attendance_marked=0,
                                  start_time=start_date_time, end_time=end_date_time, class_date=class_date_datetime))

    db.session.commit()
    return {"SUCCESS": "Class created Successfully"}


if __name__ == '__main__':
    app.run()
