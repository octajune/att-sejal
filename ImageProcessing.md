# Image Processing

## How I made the Facial Recognition to work?<hr/>

### Sending Image from the frontend to backend
The image is converted to a base64 format by the frontend and is converted back to png from base64 at the backend. The code which does this is:
```
image_file = image_file.replace('data:image/png;base64,', '')
image_file = image_file.replace(' ', '+')
image_file = base64.b64decode(image_file)
g = open(PATH + image_path + ".png", "wb")
g.write(image_file)
g.close()
```
<hr/>

### Detecting if a human face exists or not
For this project, I am using `face_recognition` library which can be installed using `pip install face_recognition`
```
profile_pic = face_recognition.load_image_file(PATH + "{}.png".format(image_path))
face_location = face_recognition.face_locations(profile_pic)
if face_location is None or len(face_location) == 0:
    return {"ERROR": "No Face Detected"}
```
<hr/>

### Comparing Two face if they are similar or not
First, we need to convert the image into an encoded image. Then, I am using `face_recognition.compare_faces` to compare the picture provided with the profile picture of the user.
```
image_encoding = face_recognition.face_encodings(image_pic)[0]
is_target_face = face_recognition.compare_faces(np.array([profile_pic_encoding]), image_encoding, tolerance=0.5)
if is_target_face[0]:
    attend_student.attendance_marked = 1
    attend_student.marked_time = datetime.datetime.now()
    db.session.commit()
    return {"SUCCESS": "Attendance marked Successfully"}
else:
    return {"ERROR": "Image not matching"}
```
<hr/>

## License
- Licensed under [MIT](https://github.com/octajune/att-sejal/blob/main/LICENSE)

## Thank you Microsoft
I can't be more thankful to Microsoft for offering me this opportunity. I learnt a lot from the past 4 weeks.

<hr /><br />
<center>Made with ❤️ by Sejal</center>