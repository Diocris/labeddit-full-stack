# Project Labook - Backend

## About
The Project Labook API is a comprehensive backend service designed for educational purposes to recreate the functionality of a social media platform. This API empowers users to interact with the backend of the Labook application, demonstrating a range of key technologies, concepts, and best practices in web development.
### **[API Documentation](https://documenter.getpostman.com/view/27681104/2s9Y5csfMP)**
## Tecnologies and Concepts

* User Authentication and Authorization: The API provides robust user signup and login functionalities, employing secure JSON Web Tokens (JWT) for authentication. User roles are utilized to control access to specific endpoints, showcasing authorization principles.

* CRUD Operations: Embracing the fundamental Create, Read, Update, and Delete (CRUD) principles, the API facilitates the creation of user accounts, posts, and the ability to edit, delete, and retrieve posts.

* Layered Architecture: The API adheres to a layered architecture, promoting clean code organization and modularity. This ensures scalability and maintainability of the application.

* Secure Data Handling: Sensible data, such as user passwords, are hashed before storage, ensuring the privacy of user information.

* Endpoint Documentation: The API documentation, available through Postman, provides a detailed guide to the available endpoints, request formats, response structures, and authentication requirements.

* SQLite Database: The backend employs an SQLite database, and users can set up the database using provided instructions, including SQL schema creation and query execution.

* UUID Generation: Universally unique identifiers (UUIDs) are used to distinguish posts and users, improving data integrity and avoiding collisions.

* Express and TypeScript: The API is built on the Node.js framework Express, enhanced by TypeScript for a type-safe development experience.
</br>
## Features
#### Following the CRUD concepts, in this project we have:
 
 #### Create
 * SignUp
 * Login
 * Create a new post
 * Like or dislike a post
 * Comment in a post
 * Like a comment
 
 #### Read
 * Get users
 * Get posts
 * Get full post
 * Get likes in a post
 * Get likes in a comment
 
 #### Update
 * Edit post content
 
 #### Delete
 * Delete post
</br>

</br>




</br>

## To run this project on your computer, follow the steps in your terminal:

### Clone this repository:
```
$ git clone https://github.com/Diocris/project-labook
```

### Then enter the project folder (project-labook) through your terminal bash (make sure of your are on the folder where project-labook is located.):
```
$ cd project-labook
```

### Once you are inside de project folder, run this line to install the dependencies:
```
$ npm install
```

### When it's installed, run this line to open your code editor on this folder.
```
$ code .
```
#### Note: Always keep your .env file containing sensitive database information secure and do not commit it to version control.


### Database Setup
The project uses an SQLite database. Follow these steps to set up the database and run the required queries.

### Running Queries
You can use the Database plugin in Visual Studio Code to execute the SQL queries. Make sure you've installed the "Database" extension in Visual Studio Code. If you haven't, you can install it from the Extensions Marketplace.

1. Open the SQL file containing the database schema.

2. Connect to the SQLite database using the Database plugin. Ensure that the connection details (database path, etc.) are correctly configured in the plugin.

3. Select the queries in the SQL file (create tables for users, posts, etc.).

4. Execute the selected queries to create the necessary tables in the SQLite database.

5. Verify that the tables were created successfully by inspecting the database using the Database plugin.

### Ensuring Database Plugin Connection
After running the queries, make sure that the Database plugin is connected to the SQLite database.

1. Check the status of the Database plugin. It should show that it's connected to the database.

2. You can query the database using the plugin to inspect the data and ensure that the tables are present.

### Also remember to create a new file named ".env".:
```
$ touch .env
```
### Open the .env file in a text editor, and add the following configuration variables, you can also see an example named as .env.example:

* SQLite Database Path (example: replace with your desired SQLite database file path)
DB_FILE_PATH=/path/to/your/database.db
* Secret key for JWT (JSON Web Token) (replace with a strong secret key)
JWT_SECRET=mysecretkey


#### <p style="color:#BE6429"> Note: The environment variables in the .env file are used to configure various aspects of the application. It's essential to set them correctly to ensure the proper functioning of the project. Make sure not to share your .env file or commit it to version control, as it may contain sensitive information.</p>

### To start the server you must run this command line:
```
$ npm run start
```

### Once is everything OK just have fun and feel free to try, edit or improve code as you like.
### See you.
### <em>Diocris Valentim.</em>
 




