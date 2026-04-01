# Assessment Project

This repository contains:
- `Frontend`: Vite + React application
- `Backend`: Node/Nest-style backend service

## Project Structure

- `Frontend/` - client application source code
- `Backend/` - server application source code

## Getting Started

### 1) Install dependencies

Frontend:
```bash
cd Frontend
npm install
```

Backend:
```bash
cd Backend
npm install
```

### 2) Configure backend env

Create `Backend/.env` and copy values from `Backend/ENV_EXAMPLE.txt`.

MongoDB Atlas URI format used in this project:
`mongodb+srv://t94531856_db_user:<db_password>@cluster0.ntqpp3b.mongodb.net/assessment_db?retryWrites=true&w=majority&appName=Cluster0`

### 3) Run the apps

Frontend dev server:
```bash
cd Frontend
npm run dev
```

Backend (use the script available in `Backend/package.json`):
```bash
cd Backend
npm run start:dev
```

If your backend uses a different start script, run:
```bash
npm run
```
inside `Backend` to list available scripts.

## Environment Variables

Create environment files as needed:
- `Backend/.env`
- `Frontend/.env`

Do not commit secrets. `.env` files are ignored by `.gitignore`.

## Git Setup

This project includes a root `.gitignore` that ignores:
- dependency folders (`node_modules`)
- build artifacts (`dist`, `build`, `coverage`)
- environment files (`.env*`)
- common editor and OS metadata files
