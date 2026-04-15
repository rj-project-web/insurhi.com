# CMS Decision Record

## Final decision

Use `insurhi-cms-admin` as the only official CMS backend and admin project.

## Rationale

- `insurhi-cms-admin` runs Payload with a usable `/admin` UI.
- The frontend (`insurhi.com`) is already wired to consume CMS APIs from this service.
- Keeping a single CMS project avoids schema drift and deployment confusion.

## Operational rules

- Frontend reads CMS via `PAYLOAD_PUBLIC_SERVER_URL`.
- Local default wiring:
  - CMS admin: `http://localhost:3000`
  - Frontend: `http://localhost:3002`
- Use `npm run dev:all` from `insurhi.com` to start both services.

## Deprecated path

The old in-repo `cms` folder is deprecated and renamed to `cms-deprecated` to prevent accidental use.
