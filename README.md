# webapp
> ✅ Active status <br>


## Index
  - [Introduction](#objective)
  - [User Requirements 📝](#user-requirements)
  - [Prerequisites](#prerequisites)
  - [Dependencies to be Installed](#dependencies-to-be-installed)
  - [Scripts](#scripts)
  - [Endpoints](#endpoints)
  - [Response HTTP messages](#responds-with-following-HTTP-messages)
  - [Testing](#test-the-service)


## Introduction
Node.js is a server-side JavaScript runtime environment. It allows developers to build fast and scalable network applications.


## User Requirement
1. As a user, I should be able to create new user by providing email address, password, first name, last name.
2. account_created field for the user should be set to a current time when user creation is successful.
3. Users should not be able to set values for account_created and account_updated. Any value provided for these fields must be ignored.Password should never be returned in the response payload.
4. As a user, I expect to use my email address as my username.
Application must return 400 Bad Request HTTP response code when a user account with the email address already exists.
5. As a user, I expect my password to be stored securely using the BCrypt password hashing scheme with salt.
6. As a user, I want to update my account information. I should only be allowed to update the following fields:First Name, Last Name, Password.
7. Attempt to update any other field should return 400 Bad Request HTTP response code.
8. account_updated field for the user should be updated when the user update is successful.
9. A user can only update their own account information.
10. Get user information.
11. As a user, I want to get my account information. Response payload should return all fields for the user except for password.


## Prerequisites:
- VSCode (IDE)
- POSTMAN
- Database - MySQL
- Node.js
- Digital Ocean


## Dependencies to be Installed
- npm install express mysql2 bcrypt body-parser nodemon dotenv jest supertest


## Scripts
- `npm start`: starts the development server
- `npx jest`: runs test suite


## Endpoints
The following endpoints are available for operations:

GET - http://localhost:3000/healthz/

GET - http://localhost:3000/v1/assignments/

POST - http://localhost:3000/v1/assignments/

GET - http://localhost:3000/v1/assignments/{id}

DELETE - http://localhost:3000/v1/assignments/{id}

PUT - http://localhost:3000/v1/assignments/{id}


## Responds with following HTTP messages
"200 OK - The request succeeded."

"201 Created - The request succeeded, and a new resource was created as a result. This is typically the response sent after POST requests, or some PUT requests."

"204 No Content - The HTTP 204 No Content success status response code indicates that a request has succeeded, but that the client doesn't need to navigate away from its current page."

"400 Bad Request - The server could not understand the request due to invalid syntax."

"401 Unauthorized - Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response."

"403 Forbidden - The request contained valid data and was understood by the server, but the server is refusing action. This may be due to the user not having the necessary permissions for a resource or needing an account of some sort, or attempting a prohibited action (e.g. creating a duplicate record where only one is allowed)."

"500 Internal Server Error - The server has encountered a situation it does not know how to handle."

"503 Service Unavailable - The server is not ready to handle the request."


<h4>Instructions:</h4>
Step 1: Clone the repository or download and unzip the source repository.
Step 2: Create appropriate files in the IDE and write the code.
Step 3: Download the node modules and install dependencies. Start Server through command npm start. Open Postman to Test the API's.
Step 4: Check the Database after each and every API is called to see the status in Database.
Step 5: Verify the status codes returned by API as per requirements.


## Test the Service:
To check the service is up and running check the following:

http://localhost:3000/healthz/, where you should see: "200 OK".

http://localhost:3000/v1/assignments/self where you should see: "204 No Content".

http://localhost:3000/v1/assignments/self where you should use: "204 No Content".
