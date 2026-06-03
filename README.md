## ⚙️ Frontend Setup

*1. Navigate to frontend*
bash
cd frontend


*2. Install dependencies*
bash
npm install


*3. Start development server*
bash
npm run dev


👉 App will run on: http://localhost:5173

---

## ⚙️ Backend Setup

*1. Navigate to backend*

cd backend


*2. Create virtual environment*

python -m venv venv


*3. Activate virtual environment*

- Windows : venv\Scripts\activate

- Mac/Linux : source venv/bin/activate


*4. Install dependencies*
  pip install -r requirements.txt
  
  playwright install chromium


*5. Run FastAPI server*
bash
uvicorn app.main:app --reload --port 8000


👉 Backend will run on: http://127.0.0.1:8000

---

## 🔐 Environment Variables

Create a .env file inside the backend folder and add:

env
MONGODB_URL=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
GEMINI_API_KEY=your_gemini_api_key


---

## ⚠️ Notes

- Do not commit the venv/ folder or .env file to version control.
- Make sure MongoDB is running before starting the backend.
- Python 3.12 is recommended. Python 3.14 is not yet supported by all dependencies.
