# Project Tracker - README

## Table of Contents

1. [Introduction](#introduction)
2. [Setup Instructions](#setup-instructions)
3. [Routes Overview](#routes-overview)
4. [Access Control](#access-control)

---

## Introduction

This is a Task Management application built using Node.js, Express, MongoDB, and Handlebars. It allows users to manage tasks and tags, implement authentication using Passport (including Google OAuth), and enforce access control to protect routes.

---

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- A Google Cloud project for OAuth configuration

### Installation

1. Clone the repository:

   ```bash
   git clone <repository_url>
   cd <repository_folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Create a `configs/globals.js` file with the following structure:
     ```javascript
     module.exports = {
       ConnectionStrings: {
         MongoDB: "mongodb://<your_mongo_uri>",
       },
       Authentication: {
         Google: {
           ClientId: "<your_google_client_id>",
           ClientSecret: "<your_google_client_secret>",
           CallbackUrl: "http://localhost:3000/google/callback",
         },
       },
     };
     ```

4. Start the application:

   ```bash
   npm start
   ```

5. Access the app:
   Open your browser and navigate to `http://localhost:3000`.

---

## Routes Overview

### **Authentication Routes**

- **GET `/login`**: Renders the login page.
- **POST `/login`**: Handles user login with local authentication.
- **GET `/logout`**: Logs the user out and redirects to the login page.
- **GET `/register`**: Renders the registration page.
- **POST `/register`**: Handles new user registration.
- **GET `/google`**: Initiates Google OAuth login.
- **GET `/google/callback`**: Handles the Google OAuth callback and redirects to the tasks page.

### **Task Management Routes**

- **GET `/tasks`**: Displays a list of tasks.
- **GET `/tasks/add`**: Renders the form to add a new task (protected by authentication).
- **POST `/tasks/add`**: Creates a new task.
- **GET `/tasks/edit/:_id`**: Renders the form to edit a task.
- **POST `/tasks/edit/:_id`**: Updates task details.
- **GET `/tasks/delete/:_id`**: Deletes a task.
- **PUT `/tasks/update-done/:_id`**: Updates the "done" status of a task.

### **Tag Management Routes**

- **GET `/tags`**: Displays a list of tags.
- **GET `/tags/add`**: Renders the form to add a new tag (protected by authentication).
- **POST `/tags/add`**: Creates a new tag.

### **Miscellaneous Routes**

- **GET `/`**: Renders the homepage.

---

## Access Control

1. **Authentication Middleware**:

   - Routes that require a logged-in user are protected using the `AuthenticationMiddleware`. This middleware checks if a user is authenticated before allowing access to sensitive routes.

2. **Session Management**:

   - The application uses `express-session` to manage user sessions. Upon successful login, user information is serialized into the session.

3. **Passport Integration**:

   - Passport.js is configured to support local and Google OAuth strategies.
   - Local Strategy handles user login and registration with a username and password.
   - Google Strategy allows users to log in using their Google account.

4. **Role-based Access**:
   - Although this project does not implement roles, additional layers of access control can be added by extending the `AuthenticationMiddleware` to check user roles or permissions.

---

For additional questions or support, please contact the project maintainer.
