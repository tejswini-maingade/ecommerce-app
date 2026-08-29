# [Ecommerce Application](https://ecommerce-application-jyip.onrender.com/)

A full-stack Ecommerce application featuring a React client, Express.js backend, and PostgreSQL database. The application has been containerized using Docker and deployed on an AWS EC2 Ubuntu server using Docker Compose.

## Table of Contents

- [Ecommerce Application](#ecommerce-application)
  - [Table of Contents](#table-of-contents)
  - [Project Structure](#project-structure)
  - [Technologies Used](#technologies-used)
  - [Features](#features)
  - [Installation](#installation)
  - [Setup and Configuration](#setup-and-configuration)
  - [Running the Application](#running-the-application)
  - [Health Checks](#health-checks)
  - [AWS Deployment](#aws-deployment)
  - [Project Structure Details](#project-structure-details)
  - [License](#license)

## Project Structure

<img width="6168" height="3644" alt="image" src="https://github.com/user-attachments/assets/bd1b1342-7ce6-4550-8a2b-2261871c8d8d" />

---

## Technologies Used

* **Frontend**: React (JavaScript)
* **Backend**: Express.js (Node.js)
* **Database**: PostgreSQL 16
* **Web Server**: Nginx
* **Containerization**: Docker
* **Container Orchestration**: Docker Compose
* **Cloud Platform**: AWS EC2
* **Operating System**: Ubuntu
* **Authentication**: Passport.js + GitHub OAuth
* **Payment Processing**: Stripe

## Features

* **Filter Products by Category**: Users can browse products and filter them by category.
* **User Authentication**: Includes user login and registration.
* **GitHub Sign-Up**: Users can sign up using their GitHub account.
* **Order Placement**: Users can add products to the cart and place orders.
* **Cart Checkout and Payment Processing**: Integrated Stripe payment gateway for checkout.
* **Persistent Database**: PostgreSQL data is stored using a Docker named volume.

---

### Container Communication

* Frontend container exposes **port 80 internally** and is mapped to **EC2 port 3000**.
* Backend container runs on **port 5000** and is mapped to **EC2 port 5000**.
* PostgreSQL runs on **port 5432** internally.
* Backend connects to PostgreSQL using the Docker Compose service name `db`.
* PostgreSQL data is persisted using the `postgres_data` Docker volume.
* PostgreSQL port **5432 is not exposed publicly**.

---

## Installation

Follow these steps to clone and deploy the application.

### 1. Clone the Repository

```bash
git clone https://github.com/Medo-ID/Ecommerce_application.git
cd Ecommerce_application
```

### 2. Install Dependencies

For local development, dependencies can be installed from the root directory:

```bash
npm install
```

This installs dependencies for the client and server workspaces.

## Setup and Configuration

### 1. Backend Environment Variables

Create the environment file:

```bash
cd server
vi .env
```

Configure the required variables:

```env
PORT=5000

DB_URL=postgresql://ecommerce_user:<password>@db:5432/ecommerce_db

SESSION_SECRET=<strong-session-secret>

FRONT_DOMAIN=http://<EC2-PUBLIC-IP>:3000

SERVER_URL=http://<EC2-PUBLIC-IP>:5000

NODE_ENV=development

GITHUB_CLIENT=<github-client-id>
GITHUB_SECRET=<github-client-secret>

STRIPE_PUBLIC=<stripe-public-key>
STRIPE_SECRET=<stripe-secret-key>
```

**Important:** Never commit `.env` files or API keys to GitHub.

The repository contains `.gitignore` configuration to exclude `.env`.

---

### 2. Database

PostgreSQL is deployed using Docker Compose.

Database configuration:

```text
Database: ecommerce_db
User:     ecommerce_user
Port:     5432
```

The database uses a persistent Docker volume:

```text
postgres_data
```

The application database contains tables including:

```text
addresses
cart
categories
checkouts
orderitems
orders
products
users
```

The database was verified with 15 products.

---

## Running the Application

### Start the Docker Containers

From the project root:

```bash
docker compose up -d --build
```

Check the running containers:

```bash
docker compose ps
```

Expected services:

```text
ecommerce-frontend
ecommerce-backend
ecommerce-db
```

---

### Stop the Application

```bash
docker compose down
```
---

### Rebuild the Application

```bash
docker compose up -d --build
```
---

## Health Checks

### Backend

Test the backend API:

```bash
curl http://localhost:5000/
```

Expected response:

```json
{
  "authentication": "Hello, you are Not Authenticated"
}
```

### Frontend

Test the frontend:

```bash
curl http://localhost:3000/
```

The command should return the React application's HTML.

### PostgreSQL

Check PostgreSQL:

```bash
docker exec ecommerce-db pg_isready \
-U ecommerce_user -d ecommerce_db
```

Expected:

```text
accepting connections
```

---

### Verify Database Tables

```bash
docker exec ecommerce-db psql \
-U ecommerce_user \
-d ecommerce_db \
-c "\dt"
```
---

### Verify Products

```bash
docker exec ecommerce-db psql \
-U ecommerce_user \
-d ecommerce_db \
-c "SELECT COUNT(*) FROM products;"
```
---

## AWS Deployment

The application is deployed on an **AWS EC2 Ubuntu server**.

### EC2 Public Access

Frontend:

```text
http://<EC2-PUBLIC-IP>:3000
```

Backend:

```text
http://<EC2-PUBLIC-IP>:5000
```

---

### AWS Security Group

The following inbound ports are required:

```text
Port 3000  → Frontend
Port 5000  → Backend
```

PostgreSQL port `5432` is used for internal Docker communication and should not be publicly exposed.

---

### Docker Network

Docker Compose creates an internal network:

```text
ecommerce-app_default
```

The backend communicates with PostgreSQL using:

```text
db:5432
```

rather than:

```text
localhost:5432
```

This allows the containers to communicate through the Docker network.

---

## DevOps Implementation

The project was enhanced with the following DevOps practices:

* Dockerized React frontend.
* Dockerized Node.js/Express backend.
* PostgreSQL containerized using Docker Compose.
* Nginx used to serve the React production build.
* Multi-container application managed using Docker Compose.
* Persistent PostgreSQL storage using Docker volumes.
* Internal Docker networking between backend and database.
* Environment variables used for application configuration and secrets.
* Application deployed on AWS EC2 Ubuntu.
* Docker health and application connectivity verified using `curl`, `pg_isready`, and PostgreSQL queries.
* Docker images built separately for frontend and backend.


---

## Project Structure Details

* **client/src**: Contains all React frontend code.
* **client/Dockerfile**: Builds the React application and creates the Nginx production image.
* **client/nginx.conf**: Nginx configuration for serving the React application.
* **server/controllers**: Holds controller functions that manage application logic.
* **server/models/tables.sql**: SQL script containing the PostgreSQL database schema and product data.
* **server/routes**: Contains backend API routes.
* **server/index.js**: Entry point for the Express.js server.
* **server/Dockerfile**: Docker image definition for the Node.js backend.
* **docker-compose.yml**: Defines and manages frontend, backend, and PostgreSQL services.
* **.dockerignore**: Prevents unnecessary files from being copied into Docker build contexts.
* **.gitignore**: Prevents sensitive and unnecessary files such as `.env` and `node_modules` from being committed.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

