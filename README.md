# Project Setup Guide

## Prerequisites

Before starting, make sure you have:

* Node.js (Latest LTS version recommended)
* Python 3.12 (Recommended)
* MongoDB installed and running
* Git installed

---

# Frontend Setup

### 1. Navigate to the frontend directory

```bash
cd frontend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

✅ Frontend will be available at:

```text
http://localhost:5173
```

---

# Backend Setup

### 1. Navigate to the backend directory

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

#### Windows

```bash
venv\Scripts\activate
```

#### macOS / Linux

```bash
source venv/bin/activate
```

### 4. Install Python dependencies

```bash
pip install -r requirements.txt
```

### 5. Install Chromium for Playwright

```bash
playwright install chromium
```

### 6. Start the FastAPI server

```bash
uvicorn app.main:app --reload --port 8000
```

✅ Backend will be available at:

```text
http://127.0.0.1:8000
```

---

# Environment Variables

Create a `.env` file inside the `backend` folder and add the following variables:

```env
MONGODB_URL=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

---

# Project Structure

```text
project-root/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── venv/
│   ├── requirements.txt
│   └── .env
│
└── README.md
```

---

# Notes

* Do **not** commit the `venv/` folder to version control.
* Do **not** commit the `.env` file to version control.
* Ensure MongoDB is running before starting the backend server.
* Python **3.12** is recommended.
* Python **3.14** is not yet supported by some project dependencies.
* If Playwright installation fails, manually run:

```bash
playwright install chromium
```

---

# Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
playwright install chromium

uvicorn app.main:app --reload --port 8000
```

---

## Application URLs

| Service      | URL                        |
| ------------ | -------------------------- |
| Frontend     | http://localhost:5173      |
| Backend API  | http://127.0.0.1:8000      |
| FastAPI Docs | http://127.0.0.1:8000/docs |

Happy Coding! 🚀
