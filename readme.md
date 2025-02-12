# A Next.js app with authentication NextAuth + Strapi v5

## Technology stack:
1. Next.js 15
2. Strapi v5
3. authetication using Google and credentials provider (email + password)

## commands history to create the project
backend (strapi):
```bash
pnpm dlx create-strapi@latest backend

? Please log in or sign up. Skip
? Do you want to use the default database (sqlite) ? No
? Choose your default database client postgres
? Database name: idealz-boilerplate
? Host: 192.168.100.205
? Port: 5432
? Username: db_user
? Password: *******
? Enable SSL connection: No
? Start with an example structure & data? No
? Start with Typescript? Yes
? Install dependencies with pnpm? Yes
? Initialize a git repository? No
```

front (next app)
```bash
pnpm dlx create-next-app@latest frontend

Progress: resolved 1, reused 1, downloaded 0, added 1, done
✔ What is your project named? … frontend
✔ Would you like to use TypeScript? … No / Yes
✔ Would you like to use ESLint? … No / Yes
✔ Would you like to use Tailwind CSS? … No / Yes
✔ Would you like your code inside a `src/` directory? … No / Yes
✔ Would you like to use App Router? (recommended) … No / Yes
✔ Would you like to use Turbopack for `next dev`? … No / Yes
✔ Would you like to customize the import alias (`@/*` by default)? … No / Yes
```


## Setup the Email provider with nodemailer and Brevo
### Register an account with Brevo
```
# email provider
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
# SMTP login/SMTP key
SMTP_USER=
SMTP_PASS=
SMTP_DEFAULT_FROM=
SMTP_DEFAULT_REPLYTO=
```
### Add nodemailer plugin
```bash
pnpm add @strapi/provider-email-nodemailer
```
Goto strapi admin panel, `settings > email plugin > configuration`, and click `Send test email`.

### setup the Google oAuth
Steps:
  1. Go to https://console.cloud.google.com/
  2. Create credentials OAuth client ID for a web application
  3. Fill in a name (f.e. test project), origins (http://localhost:3000) and callback url (http://localhost:3000/api/auth/callback/google).
  4. Take the client ID and secret and put them into a .env.local/.env in the root of out frontend folder:
```bash
# .env.local for frontend
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
Goto strapi admin panel, `settings > providers > google`, and make sure it is enabled.

## Setup NextAuth
```bash
pnpm add next-auth
```

## Setup shadcn ui
```bash
pnpm dlx shadcn@latest init
```

## Add needed package
```bash
pnpm add qs zod
```

## Enable google auth in strapi
Open strapi admin panel, `settings > users-permissions > providers > google`, and enable it.