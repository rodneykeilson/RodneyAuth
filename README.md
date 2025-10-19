# RodneyAuth

**RodneyAuth** is a role-based access control portal featuring password login, optional authenticator enrollment, and an admin console for managing users. It is built on Next.js App Router with Prisma-backed persistence and modern UI components.

---

## ![Socialify Image](https://socialify.git.ci/rodneykeilson/RodneyAuth/image?custom_description=Role-based+authentication+portal+built+for+my+cybersecurity+coursework.&description=1&language=1&name=1&owner=1&pattern=Charlie+Brown&theme=Auto)

---

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![Prisma](https://img.shields.io/badge/Prisma-ORM-blue)
![License](https://img.shields.io/github/license/rodneykeilson/rodneyauth)

---

## 🎮 Project Demo

### How to Use
1. Install dependencies and run migrations (see Installation). The seed script provisions admin, manager, and member accounts.
2. Start the development server with `npm run dev` (defaults to http://localhost:9002).
3. Sign in using the seeded admin account to access the dashboard.
4. Navigate to `/admin/users` to assign roles, toggle two-factor requirement, or reset passwords for any user.
5. Registration flow supports optional authenticator setup; users can skip it and enable 2FA later.

---

## ✨ Features

- **Role Management**: Admin-only console to promote/demote users between `ADMIN`, `MANAGER`, and `MEMBER` roles.
- **Optional Two-Factor**: Users may enroll an authenticator app during or after registration; admins can require 2FA per user.
- **Password & Session Control**: Secure hashing with bcryptjs and Prisma-backed session storage via HTTP-only cookies.
- **Admin Password Reset**: Admins can issue password resets directly from the user directory.
- **Protected Routing**: Middleware and server-side checks guard dashboard and admin routes.

---

## 🛠️ Installation Steps

1. Clone the repository:
	```bash
	git clone https://github.com/rodneykeilson/rodneyauth.git
	```
2. Navigate to the project directory:
	```bash
	cd RodneyAuth
	```
3. Install dependencies:
	```bash
	npm install
	```
4. Configure environment:
	```bash
	copy .env .env.local
	```
	- Ensure `DATABASE_URL="file:./dev.db"` or your preferred SQLite path.
	- Optionally set seed overrides (`SEED_ADMIN_EMAIL`, `SEED_DEFAULT_PASSWORD`, etc.).
5. Generate Prisma client & run migrations:
	```bash
	npm run db:generate
	npm run db:migrate
	```
6. Seed default users (optional but recommended for demo):
	```bash
	npm run db:seed
	```
7. Start the development server:
	```bash
	npm run dev
	```

---

## 🧰 Technologies Used
- **Next.js 15 (App Router)**: Server Actions, middleware, and modern routing.
- **React 18 + Tailwind CSS**: Component-driven UI with reusable form and layout components.
- **Prisma ORM + SQLite**: Data modeling for users, sessions, and migrations.
- **bcryptjs**: Secure password hashing.
- **otplib & qrcode**: Authenticator secret generation and QR display for TOTP flows.
- **TypeScript & ESLint**: Strict typing and linting for consistent development standards.

---