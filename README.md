# Activity Log Application

This project is an Activity Log web application developed with Node.js, Express, and PostgreSQL. It allows users to manage activities, participants, and activity types. The project uses Digital Ocean for the managed database and Digital Ocean App Platform for deployment.

## Code Notes

- Ensure the database connects before running any JavaScript code to avoid server errors, not found routes, and networking errors.

## Features

- Add, edit, delete, and view participants
- Add, edit, delete, and view activities
- Add, edit, delete, and view activity types
- Invoicing Billable Hours
- Reports

## Getting Started

### Prerequisites

- Node.js
- npm (Node Package Manager)
- PostgreSQL database
- Digital Ocean account
  - App Platform
  - Managed database
    - Set allowed IPs: your app IP and your local computer IP

### Installation

1. **Clone the repository**:
    ```bash
    git clone https://github.com/errinjohnson/activityLog-DebV.git
    cd activityLog-DebV
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Environment Variables**: Create a `.env` file in the root directory and add the following environment variables:
    ```
    DB_HOST=your-database-url
    DB_PORT=database port
    DB_PASS=database password
    DB_USER=database username
    DB_NAME=database name
    ```

4. **Database Setup**: Ensure your PostgreSQL database is set up and accessible. Use the provided schema and seed data if necessary.

### Running the Application

1. **Start the server on your local machine**:
    ```bash
    npm start
    ```

2. **Access the application on your local machine**: Open your web browser and go to `http://localhost:3000`.

### Deployment

1. **Digital Ocean App Platform**:
    - Push your code to a GitHub repository.
    - Create a new app in the Digital Ocean App Platform.
    - Connect your GitHub repository and deploy the application.
    - Configure environment variables in the App Platform settings.

### Routes

- **Participants**:
    - `GET /participants`: Fetch all participants
    - `POST /participants`: Add a new participant
    - `PUT /participants/:id`: Edit a participant
    - `DELETE /participants/:id`: Delete a participant

- **Activities**:
    - `GET /activities`: Fetch all activities
    - `POST /activities`: Add a new activity
    - `PUT /activities/:id`: Edit an activity
    - `DELETE /activities/:id`: Delete an activity

- **Activity Types**:
    - `GET /activity-types`: Fetch all activity types
    - `POST /activity-types`: Add a new activity type
    - `PUT /activity-types/:id`: Edit an activity type
    - `DELETE /activity-types/:id`: Delete an activity type

### Database

The project uses PostgreSQL as the database. Ensure your database connection details are correctly set in the `.env` file.

### Code Overview

- **server.js**: Main entry point for the server.
- **database.js**: Handles database connections and operations.
- **routes/**: Contains route definitions for participants, activities, and activity types.
- **public/**: Static files (HTML, CSS, JS).

### Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

### License

This project is licensed under the MIT License.

### Contact

For questions or support, please open an issue or contact the project maintainer.
