# 🎫 Support Ticketing API

A simple REST API for managing IT support tickets, built with Node.js, Express, and MongoDB.

---

## Tech Stack

- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT** for authentication
- **express-validator** for input validation
- **Swagger UI** for API docs

---

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/Kishanth12/Simple-Support-Ticketing-API.git
cd support-ticketing-api
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5001
MONGO_URI=your_URI
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

### 3. Run the server

```bash
# Development
npm run dev

# Production
npm start
```

API will be running at `http://localhost:5001`  
Swagger docs at `http://localhost:5001/api-docs`

## Postman Collection

You can import the Postman collection to test all API endpoints:

[Download Postman Collection](./postman/Simple_Support_Ticketing_API.postman_collection.json)

---
