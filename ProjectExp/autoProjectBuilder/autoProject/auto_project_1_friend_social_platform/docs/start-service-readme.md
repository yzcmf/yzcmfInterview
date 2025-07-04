# Service Startup Guide

This guide explains how to start all services for the Friend Social Platform project, including how to start them all at once, individually, and how to troubleshoot port conflicts.

---

## 🚀 Start All Services (Recommended)

From the project root directory, run:

```sh
docker compose up -d
```

This will start all remaining services (excluding Prometheus and Grafana) as defined in your `docker-compose.yml` file.

---

## 🟢 Start Individual Services

You can start any service separately by specifying its name. For example:

- **Start only the database (PostgreSQL):**
  ```sh
  docker compose up -d postgres
  ```
- **Start only Redis:**
  ```sh
  docker compose up -d redis
  ```
- **Start only the backend:**
  ```sh
  docker compose up -d backend
  ```
- **Start only the frontend:**
  ```sh
  docker compose up -d frontend
  ```
- **Start only the AI service:**
  ```sh
  docker compose up -d ai-service
  ```

You can also start multiple specific services at once:
```sh
docker compose up -d backend frontend ai-service
```

---

## 🔍 Check Service Status

```sh
docker compose ps
```

---

## 📜 View Logs

All services:
```sh
docker compose logs -f
```

Specific service (e.g., backend):
```sh
docker compose logs -f backend
```

---

## 🛑 Stop All Services

```sh
docker compose down
```

---

## 🛠️ Manual Start (Development/Debugging)

If you want to run services manually (not recommended if using Docker Compose), use these commands in separate terminals:

### Frontend
```sh
cd frontend
npm install
npm run dev
```

### Backend
```sh
cd backend
npm install
npm run dev
```

### AI Service
```sh
cd ai-service
pip install -r requirements.txt
python -m uvicorn app:app --reload --port 8001
```

---

## ⚠️ Troubleshooting Port Conflicts

If you see errors like `port is already allocated` or `address already in use`, it means another process is using the port. To resolve:

1. **Find the process using the port (e.g., 8000):**
   ```sh
   lsof -i :8000
   ```
2. **Stop the process:**
   - If it's a Docker container, run:
     ```sh
     docker compose down
     ```
   - If it's a local process, stop it or kill it by PID:
     ```sh
     kill <PID>
     ```
3. **Try starting the service again.**

---

**Note:**
- If you use Docker Compose, you do NOT need to run the manual commands above.
- Make sure Docker Desktop is running before using Docker Compose.
- For troubleshooting, check logs with `docker compose logs -f` or inspect individual service logs.