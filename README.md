# File Manager

This repository contains two directories for the project:

1. **Frontend**: Built with ReactJS
2. **Backend**: Built with Python (using FastAPI)

## Steps to Run the Project

### Frontend

1. Navigate to the `frontend` directory after downloading the code.
2. Run the following commands:

   ```bash
   npm install
   ```
   This will install all the required dependencies.

3. Start the frontend development server:

   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`.

---

### Backend

1. Navigate to the `backend` directory after downloading the backend code.
2. Create a virtual environment for the backend:

   ```bash
   python -m venv env
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     .\env\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source env/bin/activate
     ```

4. Install the required dependencies:

   ```bash
   pip install -r requirements.txt
   ```

5. Provide MongoDB URL in .env:

   ```bash
   MONGODB_URL=mongodb://localhost:27017/
   ```

6. Start the backend server:

   ```bash
   uvicorn app.main:app --reload
   ```
   The backend server will start on `http://127.0.0.1:8000`.

7. Navigate to `http://127.0.0.1:8000/docs` in your browser to test the API using the automatically generated Swagger documentation.

---


