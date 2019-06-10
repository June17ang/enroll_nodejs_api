This Repo is about enroll system api - Practice

- Clone this repo
- cd to the target location path
- copy .env.example to .env
- change .env variable to your env variable
- run "npm install"
- run "npm run start" or "npm run devstart"
- import sql from sql folder to your database

Register
----------
Endpoint: **POST /api/register**
Headers: Content-Type: application/json 
Request:
field | desc
--- | ---
teacher | this field is required, insert teacher's email
students | this field is required, insert students' email in object

Sample Request:
```
{ 
  "teacher": "teacherjoe@gmail.com",
  "students": 
    [ 
      "studentjon@example.com", 
      "commonstudent2@gmail.com",
      "studenthon@example.com"
    ] 
}
```

get Commons Students
----------
Endpoint: **GET /api/commonstudents**
Success response status: **HTTP 200**
Request:
field | desc
--- | ---
teacher | this field is required

Sample: GET /api/commonstudents?teacher=teacherken%40gmail.com

Suspend Student
----------
Endpoint: **POST /api/suspend**
Headers: Content-Type: application/json
Request:
field | desc
--- | ---
student | this field is required

Request body example:
```
{ "student" : "studentmary@gmail.com" }
```

Receive Notification
Endpoint: **POST /api/retrievefornotifications **
Headers: Content-Type: application/json 
Request:
field | desc
teacher | required
notification | required and must be string

Request body example 1: 
```
{ 
  "teacher":  "teacherken@example.com", 
  "notification": "Hello students! @studentagnes@example.com @studentmiche@example.com" 
}
```