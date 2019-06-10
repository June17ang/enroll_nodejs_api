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
Endpoint: POST /api/register 
Headers: Content-Type: application/json 
Request:
-----------------
|teacher | this field is required, insert teacher's email|
|students| this field is required, insert students' email in object|
-----------------
