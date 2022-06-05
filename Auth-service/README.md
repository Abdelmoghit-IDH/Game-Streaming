# User management-game-streaming

A user management and authentication for Express apps.

The available API endpoints to an Express app:

- user registration
- user login
- user logout
- user retrieval
- users listing
- user searching
- user data update
- user account deletion

#### API endpoints object properties
As seen above, the default object has a number of properties, each corresponding to a request path:
- **list** : Specifies the path to get users listing
- **search** : Specifies the path to search for users
- **getUser** : Specifies the path to get a user by username
(a `/:username` is automatically appended to the end of this route)
- **signup** : Specifies the path for creating (i.e., registering) a new user
- **login** : Specifies the path for logging in a user (an authorization key is returned on successful login)
- **logout** : Specifies the path to log out a user
- **updateUser**: Specifies the path for updating user information
- **deleteUser** : Specifies the path for deleting user by id
(a `/:userId` is automatically appended to the end of this route)

## Requests and responses
Every route below is assumed to begin (i.e., prefixed) with the base API route (or mount point).

- **Sign Up**
    - route: `POST /signup`
    - protected: `false`
    - request headers: none
    - request parameters: none
    - request body: `{ firstname, lastname, username, email, password, confirmPassword }`
    - response:
      ```javascript
      {
        "data": {
          "user": { id, firstname, lastname, fullname, email, username, signupDate, isAdmin }
        }
      }
      ```
- **Get user details by username**
    - route: `GET /user/USERNAME`
    - protected: false
    - request headers: none
    - request parameters: none
    - request body: none
    - response:
      ```javascript
      {
        "data": {
          "user": { id, firstname, lastname, fullname, email, username, signupDate, isAdmin }
        }
      }
      ```
- **Retrieve list of users**
    - route: `GET /list`
    - protected: `false`
    - request headers: none
    - request parameters:
        - `firstname` (string, optional): get users matching {firstname}
        - `lastname` (string, optional): get users matching {lastname}
        - `sort` (string, optional)
        - `page` (number, optional, default = 1)
        - `limit` (number, optional, default = 20)
    - request body: none
    - response:
      ```javascript
      {
        "data": {
          "total": TOTAL_COUNT_OF_MATCHING_RESULTS,
          "length": COUNT_OF_CURRENT_RESULTS_RETURNED, // determined by "page" and "limit"
          "users": [
            { id, firstname, lastname, fullname, email, username, signupDate },
            { id, firstname, lastname, fullname, email, username, signupDate },
            ...
          ]
        }
      }
      ```
- **Search for users**
    - route: `GET /search?query=SEARCH_TERM`
    - protected: `false`
    - request headers: none
    - request parameters:
        - `query` (string, required)
        - `sort` (string, optional)
        - `by` (string, optional)
        - `page` (number, optional, default = 1)
        - `limit` (number, optional, default = 20)
    - request body: none
    - response:
      ```javascript
      {
        "data": {
          "total": TOTAL_COUNT_OF_MATCHING_RESULTS,
          "length": COUNT_OF_CURRENT_RESULTS_RETURNED, // determined by "page" and "limit"
          "users": [
            { id, firstname, lastname, fullname, email, username, signupDate },
            { id, firstname, lastname, fullname, email, username, signupDate },
            ...
          ]
        }
      }
      ```
    - examples:  
        - Search for users with **james** in their firstname, lastname, username, or email:

          `GET HOST:PORT/api/auth/search?query=james`
        - Search for users with **james** in their username or email:

          `GET HOST:PORT/api/auth/search?query=james&by=username:email`
        - Sort by firstname (asc), lastname (asc), email (desc), creationDate (asc):

          `GET HOST:PORT/api/auth/search?query=james&sort=firstname:asc=lastname=email:desc=creationDate`
        - Return the 3rd page of results and limit returned results to a maximum of 15 users:

          `GET HOST:PORT/api/auth/search?query=james&page=3&limit=15`
- **Sign In**
    - route: `POST /signin`
    - protected: `false`
    - request headers: none
    - request parameters: none
    - request body:
      ```javascript
      {
        "login": EMAIL | USERNAME,
        "password": USER_PASSWORD,
      }
      ```
    - response:
      ```
      {
        "data": {
          "user": { id, firstname, lastname, fullname, email, username, signupDate },
          "authorization": {
            "token": "Bearer TOKEN_STRING",
            "expiresIn": "86400s"
          }
        }
      }
      ```
- **Logout**
    - route: `GET /logout`
    - protected: `false`
    - request headers: none
    - request body: none
    - request parameters: none
    - response: `{}`
- **Update user data**
    - route: `PUT /update`
    - protected: `true`
    - request headers:
      ```javascript
      {
        "Authorization": "Bearer TOKEN_STRING"
      }
      ```
    - request parameters: none
    - request body: `{ id, firstname, lastname, username, email }`
    - response:
      ```javascript
      {
        "data": {
          "user": { id, firstname, lastname, fullname, email, username, signupDate }
        }
      }
      ```
- **Delete user by ID**
    - route: `DELETE /user/USER_ID`
    - protected: `true`
    - request headers:
      ```javascript
      {
        "Authorization": "Bearer TOKEN_STRING"
      }
      ```
    - request body:
      ```javascript
      {
        "userId": USER_ID
      }
      ```
    - response `{}`

## Contributing
- <a name="report-a-bug">[Report a bug][bug]</a>
- <a name="request-a-new-feature">[Request a new feature][fr]</a>
- <a name="submit-a-pull-request">[Submit a pull request][pr]</a>
- <a name="contributing-guide">Checkout the [Contributing guide][contribute]</a>

## CHANGELOG
See [CHANGELOG][changelog]

## License
[MIT License][license]

## Author
[Abdelmoghit-IDH](https://github.com/abdelmoghit-idh) ([abdelmoghit.idhsaine@gmail.com](abdelmoghit.idhsaine@gmail.com))
