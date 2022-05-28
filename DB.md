# PostgreSQL Server

PostgreSQL is an advanced, enterprise-class, and open-source relational database system. 
PostgreSQL supports both SQL (relational) and JSON (non-relational) querying. 

I chose PostgreSQL database because it automates the maintenance, 
patching, updates. It provides provision in minutes and independently
scale compute or storage in seconds.

## Tables
Here are the tables that I am using and their schema.

### Attendance Table

| Columns | Type     | unique | nullable | Extra |
| :-------- | :------- | :------------------------- |:------------------------- |:------------------------- |
| `PK` id | `Integer` | `True` | `False` | `autoincrement=True`|
| class_name | `String` | `False` | `False` | `Null`|
| student_email_id| `String` | `False` | `False` | `Null`|
| teacher_email_id| `String` |`False` | `False` | `Null`|
| attendance_marked| `Integer` | `False` | `False` | `Null`|
| start_time| `DateTime` | `False` | `False` | `Null`|
| end_time | `DateTime` | `False` | `False` |`Null`|
| marked_time | `DateTime` | `False` | `True` | `Null`|
| create_datetime | `DateTime` |`Null` | `Null` | `Null`|
| class_date  | `Date` | `Null` | `Null` | `default`|

`PK` stands for primary key

<hr />

### Student Table

| Columns | Type     | unique | nullable
| :-------- | :------- | :------------------------- |:------------------------- 
| `PK` email_id | `String` | `True` | `False` |
|  name | `String` | `False` | `False` |
|  image_path | `String` | `True` | `False` |
|  passwd_hash | `String` | `False` | `False` |

`PK` stands for primary key

<hr />

### Teacher Table

| Columns | Type     | unique | nullable
| :-------- | :------- | :------------------------- |:------------------------- 
| `PK` email_id | `String` | `True` | `False` |
|  name | `String` | `False` | `False` |
|  image_path | `String` | `True` | `False` |
|  passwd_hash | `String` | `False` | `False` |

`PK` stands for primary key

<hr />

### Token Table

| Columns | Type     | unique | nullable
| :-------- | :------- | :------------------------- |:------------------------- 
| `PK` email_id | `String` | `False` | `False` |
| `PK` token| `String` | `False` | `False` |
| `PK` user_type | `Integer` | `False` | `False` |

`PK` stands for primary key

<hr />

### Token Table

| Columns | Type     | unique | nullable
| :-------- | :------- | :------------------------- |:------------------------- 
| `PK` id | `Integer` | `True` | `False` |
| `PK` review| `String` | `False` | `False` |

`PK` stands for primary key

<hr />

## How I implemented the tables in Python
For creating tables, and performing CRUD operations on the database, I am using a python library `flask_sqlalchemy`

### Attendance 

This table tracks the status of each student's attendance. If a student marks their attendance successfully then attendance_marked is changed from `0` to `1` and the `marked_time` is captured.

```
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
```

### Student
This table tracks the student email, name, image_path, and the hash of the password. We are storing the image in a different location and store the name of the file, a randomly generated hash in this db. This stored image will be further used for marking student's attendance

```
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

```

### Review
This table tracks the review which you guys will submit, so that I can read them :)

```
class Review(db.Model):
    id = db.Column(db.Integer, unique=True, nullable=False, primary_key=True, autoincrement=True)
    review = db.Column(db.String(10000), unique=False, nullable=False)

    def __init__(self, review):
        self.review = review

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}

```

### Teacher
This table tracks the teacher email, name, image_path, and the hash of the password. We are storing the image in a different location and store the name of the file, a randomly generated hash in this db.

```
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
```

### Token
This table tracks the tokens. Each user is alloted a token. And API end point except `test_insertion` and `submit_review` requires a token. I took inspiration from `GitHub` and `OpenWeatherAPI` implementation as they require us to send their tokens with each call.

```
class Token(db.Model):
    email_id = db.Column(db.String(30), unique=False, nullable=False, primary_key=True)
    token = db.Column(db.String(256), unique=False, nullable=False, primary_key=True)
    user_type = db.Column(db.Integer, unique=False, nullable=False, primary_key=True)

    def __init__(self, email_id, token, user_type):
        self.email_id = email_id
        self.token = token
        self.user_type = user_type

```

<hr />

## License
- Licensed under [MIT](https://github.com/octajune/att-sejal/blob/main/LICENSE)

## Thank you Microsoft
I can't be more thankful to Microsoft for offering me this opportunity. I learnt a lot from the past 4 weeks.

<hr /><br />
<center>Made with ❤️ by Sejal</center>