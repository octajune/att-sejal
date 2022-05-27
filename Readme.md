# Smart Attendance
![version](https://img.shields.io/badge/version-1.1.0-blue.svg) 
![license](https://img.shields.io/badge/license-MIT-blue.svg) 
<a href="https://github.com/octajune/att-sejal/issues?q=is%3Aopen+is%3Aissue" target="_blank"> ![GitHub issues open](https://img.shields.io/github/issues/creativetimofficial/notus-angular.svg)</a> 
<a href="[https://github.com/octajune/att-sejal](https://github.com/octajune/att-sejal/issues?q=is%3Aissue+is%3Aclosed" target="_blank">![GitHub issues closed](https://img.shields.io/github/issues-closed-raw/creativetimofficial/notus-angular.svg)</a>

## Introduction
 
The system works on facial recognition where each student in the class is photographed, and their details are stored on a server. The
teacher can record the attendance automatically in the classroom. The system will recognise the faces and verify the presence or
absence of each student. 

The website is currently hosted on: https://sejal-web.azurewebsites.net/ 

![alt text](images/landing.png "Attendance Manager")


## System Architecture


## Angular Frontend

## Flask Backend

## Facial Recignition

## 

## Local Environment Setup

### Just want to run it locally?
- Go to `attd-sejal/backend/app.py`
- Change the db url to use `app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')`
- run `sudo docker-compose up` from the root directory of the application
- The website must be running on `localhost:80`
- The Flask APIs must be running on `localhost:4200`

## My Development Setup

I love VSCode, and I can't recommend it enough. I have used the docker as well as Azure plugin to test my containers, build them, and deploy them. Once, I was confident then I configured CI-CD from GitHub Actions.
