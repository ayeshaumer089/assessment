# Backend Skills and Rules

## Core skills
- Structure features using NestJS modules/controllers/services.
- Keep controllers thin and place domain/business logic in services.
- Validate request bodies with DTOs and `class-validator`.
- Keep API responses consistent and easy for frontend integration.
- Use static data sources efficiently when database is not required.

## Engineering rules
- Route definitions belong in controllers only.
- Business logic and data loading belong in services only.
- Avoid duplicated config/constants; centralize and reuse.
- For static JSON data, avoid re-reading file on each request when possible.
- Register each feature module in `AppModule`.

## Compliance checks performed
- `Backend/src/models/models.service.ts` read the models JSON file on every request.
- Implemented fix: added in-memory cache (`modelsCache`) and lazy-loading in `getAll()`.
- Verified: `models` module remains properly registered in `Backend/src/app.module.ts`.
- Hardened auth logout flow: reject empty tokens in `Backend/src/auth/auth.service.ts`.
