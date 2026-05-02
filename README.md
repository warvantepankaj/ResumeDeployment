🚀 ResumeAI

ResumeAI is a full-stack web application that helps users build, manage, and score resumes with an interactive UI and smart backend processing.

🛠 Tech Stack

Frontend
React.js
React Router DOM
Tailwind CSS
Clerk Authentication

Backend
FastAPI
Python
Uvicorn

Database
MongoDB

---

📁 Project Structure

```
ResumeAI/
│
├── backend/
│   ├── app/
│   ├── venv/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│
└── README.md
```

---

⚙️ Frontend Setup

1. Navigate to frontend

```bash
cd frontend
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

👉 App will run on: `http://localhost:5173`

---

⚙️ Backend Setup

1. Navigate to backend

```bash
cd backend
```

2. Create virtual environment

```bash
python -m venv venv
```

3. Activate virtual environment

```bash
venv\Scripts\activate
```

4. Install dependencies

```bash
pip install -r requirements.txt
```

5. Run FastAPI server

```bash
uvicorn app.main:app --reload --port 8000
```

👉 Backend will run on: `http://127.0.0.1:8000`

---

🔐 Environment Variables

Create a `.env` file inside the `backend` folder and add:

```
MONGODB_URL=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
```

