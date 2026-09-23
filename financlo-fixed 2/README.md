# Financlo (finance tracker) - MERN

React frontend + Express/MongoDB backend. Users can register, log in (JWT),
see their profile, and add/list expenses.

## Run it

You need Node 18+ and a MongoDB instance (local install or a free MongoDB Atlas URI).

### 1. Backend (port 5000)
```bash
cd backend
npm install
cp .env.example .env      # then edit .env: set MONGO_URI and JWT_SECRET
npm run dev               # or: npm start
```

### 2. Frontend (port 3000)
```bash
cd frontend
npm install
npm start
```

Open http://localhost:3000, click Register, create an account, then Login.

## Folder guide
```
backend/
  server.js              entry point: loads .env, connects MongoDB, mounts routes
  Auth/JwtBearer.js      middleware that checks the Bearer token on protected routes
  Controllers/           route handlers: Login.js, User.js, Transaction.js
  Models/                Mongoose schemas: User.js, Transaction.js
frontend/src/
  App.jsx                top-level state: which page + who is logged in
  api.js                 API base URL + JWT decoding helper
  Header / LoggedHeader  nav bars (logged out / logged in)
  LoginForm, UserCreationForm, Profile, Transactions   the pages
```

## API
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /user/ | no | register |
| POST | /login | no | returns a JWT (valid 1 hour) |
| GET | /myInfo/:id/ | yes (own id) | profile |
| POST | /transaction/ | yes | add an expense |
| GET | /myTransactions/:id/ | yes (own id) | list your expenses |
| GET | /getUserBytransaction/:id | yes (own) | owner of a transaction |
| GET | /protected/ | yes | token check |
