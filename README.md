# Dad Jokes App

## Overview

This project is a web application that allows users to search for and save their favorite dad jokes. It utilizes the [icanhazdadjoke API](https://icanhazdadjoke.com/api#fetch-a-dad-joke-as-an-image) to fetch jokes and stores favorites in a PostgreSQL database. The application is built using **React** for the frontend and **Node.js** with **Express** for the backend, leveraging **Neon PostgreSQL** for data storage.

## Features

- **Search Page**: Users can search for dad jokes using a search term.
- **Joke Cards**: Each joke is displayed in a card layout with the option to save it as a favorite.
- **Favorites Page**: Users can view their saved favorite jokes without making additional API calls.
- **Responsive Design**: The UI is built with **Bootstrap 5** for a responsive layout.

## Technologies Used

- **Frontend**: React, Bootstrap 5, Axios
- **Backend**: Node.js, Express
- **Database**: Neon PostgreSQL
- **API**: [icanhazdadjoke API](https://icanhazdadjoke.com/api#fetch-a-dad-joke-as-an-image)

## Setup Instructions

### Backend Setup

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd <repository-name>

   ```

2. **Install Dependencies**:

Navigate to the backend folder and install the required packages:

````bash
cd backend
npm install

3. **Create Database**:

Set up your PostgreSQL database in Neon and create a table for favorites:

```sql
CREATE TABLE favourites (
  joke_id SERIAL PRIMARY KEY,
  joke_text TEXT NOT NULL UNIQUE
);

4. **Environment Variables**:

Create a `.env` file in the backend directory and set your database connection string:

```env
DATABASE_URL=your_neon_database_connection_string

5. **Run the Server**:

Start the backend server with the following command:

```bash
node index.js

### Frontend Setup

1. **Navigate to Frontend**: In a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend

2. **Install Dependencies:
   ```bash
   npm install

3. **Start the Application:
   ```bash
   npm start

````
