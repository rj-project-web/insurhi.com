# Insurhi CMS (Payload)

Payload CMS backend for `insurhi.com` with PostgreSQL.

This folder provides the content schema, migrations, and seed flow. The frontend
integration route (admin/UI hosting) can be wired in the Next.js app in the next step.

## Setup

1. Copy `.env.example` to `.env`
2. Fill required values
3. Install dependencies:

```bash
npm install
```

## Start local PostgreSQL

```bash
npm run db:up
```

## Validate setup

```bash
npm run info
npm run generate:types
```

## Database migrations

```bash
npm run migrate:create
npm run migrate
npm run migrate:status
```

## Seed sample data

```bash
npm run seed
```

Default admin credentials (change in `.env`):
- Email: `admin@insurhi.com`
- Password: `ChangeMe123!`

## One-command bootstrap

```bash
npm run db:up
npm run setup
```

## Collections

- `users` (admin auth)
- `categories`
- `providers`
- `products`
- `articles`
- `faq-items`
- `claims-guides`
- `claim-cases`
- `pages`
