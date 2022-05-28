# Backend

A Face Recognition system to keep every student on check!


## Introduction

The system works on face recognition where each student
in the class is photographed, and their details are stored
on a server. The teacher can record the attendance automatically
in the classroom. The system will recognise the faces and
verify the presence or absence of each student.

The FlaskAPI is hosted on:
 
 https://sejal-backend.azurewebsites.net/
    

## Table of contents

- Get Started
- API References

## Get Started

- Install VSCode
- Open a terminal in VSCode cd into `attd-sejal-backend`
- Run `pip install -r requirements.txt`
- Run `python app.py`
- Navigate to http://localhost:5000/

## API Reference
```
/api/v1/test_insertion
```

| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | GET | Creates the tables. If the tables already exist then does nothing. Only for testing |

<br />

```
/api/v1/submit_review
```

| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST | Creates the tables. If the tables already exist then does nothing. Only for testing |

| Parameter    |
| :--------    |
| `review`   |

<br />

```
/api/v1/register_teacher
```

| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |Creates an account for the teacher


| Parameter    |
| :--------    |
| `email_id`   |
| `name`       |
| `passwd_hash`|
| `image_file` |

<br />

```
/api/v1/get_marked_attendance
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST | |


| Parameter    |
| :--------    |
| `email_id`   |
| `name`       |
| `token`|

<br />

```
/api/v1/get_profile
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `token`   |
| `email_id`       |
| `user_type`|

<br />


```
/api/v1/mark_attendance
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `token`   |
| `email_id`       |
| `class_name`|
| `start_time`|
| `end_time`|
| `class_date`|
| `image_file`|

<br />


```
/api/v1/login_teacher
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `passwd_hash`|
| `email_id`   |

<br />


```
/api/v1/register_student
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `email_id`   |
| `name`       |
| `passwd_hash`|
| `image_file` |

<br />

```
/api/v1/login_student
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `email_id`   |
| `passwd_hash`|

<br />

```
/api/v1/get_missed_attendance
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `email_id`   |
| `name`       |
| `token`      |

<br />

```
/api/v1/get_pending_attendance
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `email_id`   |
| `name`       |
| `token`      |

<br />

```
/api/v1/get_class_attendance
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `teacher_email_id`   |
| `teacher_name`       |
| `token`      |
| `class_name`|
| `start_time`|
|`end_time`|
|`class_date`|

<br />

```
/api/v1/get_classes_by_teacher
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `teacher_email_id`   |
| `token`      |

<br />

```
/api/v1/get_present_absent_classes_by_teacher
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `teacher_email_id`|
| `token`   |

<br />

```
/api/v1/get_latest_class_by_teacher
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `teacher_email_id`|
| `token`|

<br />

```
/api/v1/get_student_stats
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `student_email_id`|
| `token`|

<br />

```
/api/v1/get_attendance_time_records
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `teacher_email_id`|
| `token`|

<br />

```
/api/v1/get_student_attendance_time_records
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `student_email_id`|
| `token`|

<br />

```
/api/v1/get_student_class_attd_stat
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `student_email_id`|
| `token`|

<br />

```
/api/v1/get_student_class_record
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `teacher_email_id`|
| `token`|

<br />

```
/api/v1/get_create_class
```
| Type     | Methods               | Description               |
| :------- | :------------------------- |:------------------------- |
| `string` | POST |  | 


| Parameter    |
| :--------    |
| `token`   |
| `teacher_email_id`|
|`class_name`|
|`start_time`|
|`end_time`|
|`class_date`|

<br />


## Requirement

Requirements for this app can be installed with `pip install -r requirements.txt`

The following libraries have been used:
- `flask` - Flask is used to create the REST APIs
- `Flask-SQLAlchemy` - This is used to perform CRUD on Postgres Server without actually writing the queries
- `face_recognition` - Used for facial recoginition
- `numpy` - used by `face_recognition`, also used for performing encoding on image.
- `flask_cors` - Allows cors traffic for local debugging
- `psycopg2-binary` - Python postgres driver. Used by `Flask-SQLAlchemy`



<hr />

## License
- Licensed under [MIT](https://github.com/octajune/att-sejal/blob/main/LICENSE)

## Thank you Microsoft
I can't be more thankful to Microsoft for offering me this opportunity. I learnt a lot from the past 4 weeks.

<hr /><br />
<center>Made with ❤️ by Sejal</center>