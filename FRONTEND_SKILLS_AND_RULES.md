# Frontend Skills and Rules

## Core skills
- Build reusable React components with clear prop contracts.
- Keep state ownership predictable (`App` for app-level state, leaf components for UI-only state).
- Keep API/network logic in `Frontend/src/services`, not inside UI components.
- Preserve existing UI/UX behaviors while adding features.
- Provide user-friendly loading/error fallback states for async flows.

## Engineering rules
- Use a shared API client for all backend calls.
- Do not duplicate backend base URL constants in multiple service files.
- Keep auth/session flow explicit (token read/write/clear in one place).
- Reuse existing global style system before creating ad-hoc inline-heavy styles.
- Keep changes backward-compatible with existing interactions and navigation.

## Compliance checks performed
- `Frontend/src/services/auth.js` and `Frontend/src/services/models.js` had duplicated API base logic.
- A shared API client has been introduced and both services now reuse it.
- Existing ChatHub behavior and visual flow are preserved.
