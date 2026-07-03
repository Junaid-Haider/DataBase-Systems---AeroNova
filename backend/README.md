# Axiom Airlines Management System - Backend API

This is the backend REST API of the **Axiom Airlines Management System**, built using Express.js, MySQL, Sequelize ORM, and Redis.

For full project setup instructions, environment variables, database structure, and core features description, please refer to the **[Main README in the root directory](../README.md)**.

## 🛠️ Technology Stack
*   **Server Framework:** Express.js (Node.js runtime)
*   **Database (RDBMS):** MySQL 8.0
*   **ORM:** Sequelize
*   **Caching & Queueing:** Redis (for high-speed seat locking and mailer queues)
*   **Validation:** Zod schemas
*   **Security:** JSON Web Tokens (JWT), `bcryptjs`, and Helmet

## 🚀 Running Locally

1.  Make sure dependencies are installed:
    ```bash
    npm install
    ```
2.  Set up your environment variables:
    Create a `.env` file from `.env.example`:
    ```bash
    cp .env.example .env
    ```
    Then configure the file with your local MySQL and Redis credentials.
3.  Seed the database with sample records:
    ```bash
    npm run seed
    ```
4.  Start the dev server:
    ```bash
    npm run dev
    ```
