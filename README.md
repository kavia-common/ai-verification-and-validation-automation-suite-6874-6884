# ai-verification-and-validation-automation-suite-6874-6884

Frontend workspace for the AI-enabled Verification & Validation Automation Suite.

## Quick Start

1. Backend (vv_backend_api)
   - Ensure CORS allows `http://localhost:3000`.
   - Confirm database initialization reads `DATABASE_URL` from environment; if not set, backend should fall back to a local SQLite file for development.
   - Start backend on port `3001`.

2. Frontend (vv_ui)
   - Copy `.env.example` to `.env` and set the backend base URL if needed:
     ```
     REACT_APP_API_BASE_URL=http://localhost:3001
     ```
   - Install and start:
     ```
     cd vv_ui
     npm install
     npm start
     ```

## Notes

- The UI reads API base URL from `process.env.REACT_APP_API_BASE_URL` with a default fallback of `http://localhost:3001`.
- Expected local dev URLs:
  - UI: http://localhost:3000
  - API: http://localhost:3001