# Digital Warranty & Product Service Tracker

A MERN stack application for users to track their product warranties and manage service/repair requests.

## Features
- **User Authentication:** Register and Login securely with JWT.
- **Dashboard:** At-a-glance view of total products, active warranties, and items expiring soon.
- **Product Management:** Add, edit, and delete products along with warranty periods. Auto-calculates days remaining.
- **Service Requests:** Raise repair/service requests for products, update their statuses, and track repair costs.

## Tech Stack
- **Frontend:** React, React Router, Vite, Axios, Plain CSS.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JSON Web Tokens (JWT), bcryptjs.

## Prerequisites
- Node.js installed
- MongoDB Community Server installed and running locally on default port (`mongodb://127.0.0.1:27017`)

## Setup Instructions

### 1. Install Dependencies
Open a terminal in the root directory and install dependencies for both server and client:
```bash
cd server
npm install

cd ../client
npm install
```

### 2. Start MongoDB
Ensure your local MongoDB instance is running. You can view the data using **MongoDB Compass**.
- Connection String: `mongodb://127.0.0.1:27017/warranty_tracker`

### 3. Seed Database (Optional but recommended)
We have a seed script that populates the database with a test user, sample products (active, expiring soon, expired), and service requests.
```bash
cd server
npm run seed
```
Demo User Credentials:
- Email: `demo@test.com`
- Password: `123456`

### 4. Run the Application
Open two separate terminals to run the backend and frontend.

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### 5. Open the App
The frontend runs at `http://localhost:5173`. Open this URL in your browser.

## Database Information
- Database Name: `warranty_tracker`
- Collections:
  - `users`
  - `products`
  - `servicerequests`
