# Finance Tracker

A simple full-stack personal finance app built with the MERN stack. Create an account, log in, record your income and expenses, and see your balance at a glance. Every user sees only their own data.

## Features

- **Secure sign-up and login:** passwords are salted and hashed with Node's built-in `crypto` (scrypt); sessions use JWT tokens that expire after 1 hour.
- **Track income and expenses:** add a transaction with a type, amount, category and optional note.
- **Live summary:** total income, total expenses and current balance update after every change.
- **Delete transactions:** remove entries you added by mistake.
- **Private data:** every transaction route requires a valid token and only returns the logged-in user's records.
- **Small dependency list:** 4 backend packages and 3 frontend packages.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (hooks), plain CSS, `fetch` API |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Auth | JSON Web Tokens (`jsonwebtoken`), Node `crypto` for password hashing |
| Languages | JavaScript, JSX, CSS, HTML |

**Packages**

- Backend: `express`, `mongoose`, `jsonwebtoken`, `cors`
- Frontend: `react`, `react-dom`, `react-scripts`

## Project Structure

```
finance-tracker/
├── backend/
│   ├── package.json
│   └── server.js          # Models, auth middleware and all API routes
├── frontend/
│   ├── package.json
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── index.js       # React entry point
│       ├── App.jsx        # Login/register form and dashboard
│       └── App.css        # Styling
└── README.md
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd finance-tracker
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
```

The API runs at `http://localhost:5000`. You should see `API running on http://localhost:5000` in the terminal.

### 3. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The app opens at `http://localhost:3000`.

### Environment variables (optional)

The backend works with defaults, but you should set your own values before deploying.

| Variable | Default | Purpose |
|---|---|---|
| `JWT_SECRET` | `change-this-secret` | Secret used to sign login tokens. Use a long random string in production. |
| `MONGO_URL` | `mongodb://127.0.0.1:27017/finance_tracker` | MongoDB connection string. |

Example (macOS/Linux):

```bash
JWT_SECRET=my-long-random-secret MONGO_URL="mongodb+srv://..." npm start
```

On Windows PowerShell:

```powershell
$env:JWT_SECRET="my-long-random-secret"; npm start
```

## API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/register` | No | Create an account. Body: `name`, `email`, `password` |
| POST | `/login` | No | Log in. Body: `email`, `password`. Returns `token` and `name` |
| GET | `/transactions` | Yes | List the logged-in user's transactions, newest first |
| POST | `/transactions` | Yes | Add a transaction. Body: `type` (`income` or `expense`), `amount`, `category`, `note` |
| DELETE | `/transactions/:id` | Yes | Delete one of your own transactions |

Protected routes expect this header:

```
Authorization: Bearer <token>
```

## How It Works

1. **Register:** the server hashes the password with a random salt and stores `salt:hash`. The plain password is never saved.
2. **Login:** the server re-hashes the submitted password with the stored salt and compares the result. If it matches, it returns a JWT signed with `JWT_SECRET`.
3. **Session:** the React app stores the token in `localStorage` and sends it in the `Authorization` header with each request.
4. **Authorization:** the `auth` middleware verifies the token and attaches the user's id to the request. Every transaction query filters by that id, so users can never read or delete each other's data.
5. **Dashboard:** the frontend loads the user's transactions and calculates income, expenses and balance in the browser.

## Data Models

**User**

| Field | Type |
|---|---|
| name | String |
| email | String (unique) |
| password | String (`salt:hash`) |

**Transaction**

| Field | Type |
|---|---|
| userId | ObjectId (ref: User) |
| type | `income` or `expense` |
| amount | Number (0 or more) |
| category | String |
| note | String (optional) |
| date | Date (defaults to now) |

## Future Improvements

- Edit existing transactions
- Filter by date range and category
- Charts for spending by category
- Monthly budgets and alerts
- Move the API URL to a frontend environment variable
- Add input validation and rate limiting on login
- Deploy the backend (Render, Railway) and frontend (Vercel, Netlify)

## License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).
