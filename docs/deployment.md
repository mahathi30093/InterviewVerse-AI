# InterviewVerseAI Deployment Guide

## 1. Prerequisites
- **Docker** & **Docker Compose** installed (Recommended)
- OR Local Development Runtimes:
  - **Java 21** + **Maven**
  - **Python 3.10+** + `pip`
  - **Node.js 20+** + `npm`
  - **PostgreSQL 15+**

---

## 2. Docker Compose Deployment (Recommended 1-Click)

1. Clone or navigate to the project directory:
   ```bash
   cd InterviewVerseAI
   ```

2. Configure environment variables (optional for live OpenAI GPT API):
   ```bash
   cp .env.example .env
   # Edit .env and supply your OPENAI_API_KEY if desired
   ```

3. Launch all services:
   ```bash
   docker compose up --build
   ```

4. Service Endpoints:
   - **React Web App**: [http://localhost:3000](http://localhost:3000)
   - **Spring Boot Backend**: [http://localhost:8080](http://localhost:8080)
   - **FastAPI AI Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **PostgreSQL Database**: `localhost:5432`

---

## 3. Local Development Deployment (Without Docker)

### Step 1: Start PostgreSQL
Create the database and run initialization scripts:
```bash
psql -U postgres -c "CREATE DATABASE interviewverseai;"
psql -U postgres -d interviewverseai -f database/init.sql
psql -U postgres -d interviewverseai -f database/seed.sql
```

### Step 2: Start FastAPI AI Service
```bash
cd ai-service
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Step 3: Start Spring Boot Backend
```bash
cd spring-backend
mvn spring-boot:run
```

### Step 4: Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.
