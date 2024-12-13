# Task Management app

***Routes***
| Request | Method | Request URL |
|---|---|---|
| Welcome Page | GET | http://localhost:3000 |
| Registration | POST | http://localhost:3000/user/registration |
| Login | POST | http://localhost:3000/user/login |
| My Profile | GET | http://localhost:3000/users/me |
| Update Profile | PUT | http://localhost:3000/user/updateProfile/me |
| Delete Profile | DELETE | http://localhost:3000/user/deleteProfile/me |
| Logout | POST | http://localhost:3000/user/logout |
| Logout All | POST | http://localhost:3000/user/logoutAll |
| Add Task | POST | http://localhost:3000/task/add |
| Show Task | GET | http://localhost:3000/task/show |
| Update Task | PATCH | http://localhost:3000/task/update/{task_id} |
| Delete Task | DELETE | http://localhost:3000/task/delete/{task_id} |
| SortByTaskStatus| GET | http://localhost:3000/tasks?completed=true |
| SortByTaskOrder | GET | http://localhost:3000/tasks?createdAt:asc |
| Pagination | GET | http://localhost:3000/tasks?limit=3&skip=0 |


## User - Section
### Welcome page
**Method:** GET 

**Request URI:** `http://localhost:3000`

**Request Body:**
Response - Success: 200 OK
```TEXT
Welcome to my app..
``````
***Registration***

**Method:** POST 

**Request URI:** `http://localhost:3000/user/registration`


`
***Method: POST***

**Request URI:** http://localhost:3000/user/registration


#

Login - user
Method: POST

Request URI: http://localhost:3000/user/login


````````
# 

***Login***

http://localhost:3000/user/login

**Authorization**
Type : Brear Token - @#Token#@


#
***After login : Copy Current Token***

TO Check OWN Profile

Method: GET

Request URI: http://localhost:3000/users/me

Authorization 
Type - Bearer:Bearer -- Token(expired:1 day): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU0YzViYjQwMjM5NTFjZDgzM2U5M2YiLCJpYXQiOjE3MDk0OTE5MDAsImV4cCI6MTcwOTc1MTEwMH0.SoWXIvKvvEiT5v7hR_oCj6yrVrE9Ny7gti_f9Nbb5u4 


#
Update 

Method: PUT 
 
Request URI: http://localhost:3000/user/updateProfile/me

Body - raw  - json


#

DELETE 

DELETE : http://localhost:3000/user/deleteProfile/me
Set Auth token - 

Response
``````
{
    "message": "User deleted successfully",
    "deletedUser": {
        "_id": "65e74577b55d0c4cea205070",
        "name": "Jhon43",
        "email": "jhon43@gmail.com",
        "age": 23,
        "type": "user",
        "__v": 1
    }
}
``````
After Delete -- 
DELETE : http://localhost:3000/user/deleteProfile/me
Set Auth token - 

Response -- 500 Internal Server Error
``````
{
    "messsage": "Please authenticate first"
}
``````

#
LOGOUT (It will logout from current devices)
POST : http://localhost:3000/user/logout

Response - 200 OK
Token deleted.

#
LOGOUT ALL  
> [!NOTE]
> It will Logout from all devices - token empty

POST : http://localhost:3000/user/logoutAll

Response - 200 OK
``````
Logout from all devices
``````
# 
## Task - Section
Add Task By Admin
Method: POST
URI - http://localhost:3000/task/add
Request body
``````json
{
    "description":"Task-1",
    "completed":false,
    "assignedUser":"65e7752d2a819cf01a438765"
}
``````
Response 201 created


Request
``````json
{
    "description":"Task-3",
    "completed":true,
    "assignedUser":"65e7752d2a819cf01a438765"    
}
``````
Response - Body

Status code: 400 Bad Request

``````json
{
    "error": "User can have only two tasks."
}
``````

**When User [Not Admin] want to add Task.**

Status : 401 Unauthorized

``````json
{
    "msg": "Unauthorized User Type"
}
``````
#

Show Task

Method : GET

Request URI : http://localhost:3000/task/show

Request Body

Set Bearer token - Auth Token

#

Method GET

http://localhost:3000/task/show

Status 200 Ok

Request - Body
``````json
{
    "Msg": "No Task Has been Assigned to this User"
}
``````

#

Update Task

Method - PATCH

Request URI - http://localhost:3000/task/update/65e89fac572e81b694a1c881

Request Body

``````json
{
    "description": "NestJs",
    "completed":true
}
``````
Status : 400 Bad Request
``````json
{
    "msg": "Not Allowed - UnAutherised User"
}
``````
URI - http://localhost:3000/task/update/65e89fac572e81b694a1c881

``````json
{
    "description": "Nodejs-NestJs",
    "completed":true
}
``````
Request Body
Status 200 Ok


#
**Delete**

Request URI - http://localhost:3000/task/delete/65e89fac572e81b694a1c881

Status:  200 - Ok

``````json
{
    "msg": "Task Deleted"
}
``````

***Wrong Task Id***

http://localhost:3000/task/delete/65e89fac572e81b694a1c8811

status: 500 - Internal Server Error

``````json
{
    "stringValue": "\"{ _id: '65e89fac572e81b694a1c8811' }\"",
    "valueType": "Object",
    "kind": "ObjectId",
    "value": {
        "_id": "65e89fac572e81b694a1c8811"
    },
    "path": "_id",
    "reason": {},
    "name": "CastError",
    "message": "Cast to ObjectId failed for value \"{ _id: '65e89fac572e81b694a1c8811' }\" (type Object) at path \"_id\" for model \"Task\""
}
``````

#

***Correct TaskId But UnAutherised User***

Method: DELETE

Response URI: http://localhost:3000/task/delete/65e77bc0c1416166ccc985a0

Status: 401 Unauthorized

``````json
{
    "msg": "Not Allowed - UnAutherised User"
}
``````
# 
***SortByTaskStatus***

Sort Task By Status - Completed = true | false

Method: GET

Request URI: http://localhost:3000/tasks?completed=true



#
***SortByTaskOrder***

Sort By Asc | Sort By Desc

Method: GET

Request URI: http://localhost:3000/tasks?createdAt:asc
- OR - 
Request URI: http://localhost:3000/tasks?createdAt:desc


#

Pagination

Method: GET

Request URI: http://localhost:3000/tasks?limit=3&skip=0


#




