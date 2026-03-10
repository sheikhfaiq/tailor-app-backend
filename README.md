# Tailor Management System - Backend

Digitized manual book-keeping for a tailor shop. Track customers, measurements, orders, and payments.

## Tech Stack
- **Runtime**: Node.js (Express)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Auth**: JWT & Bcrypt
- **Logging**: Pino (with pino-pretty)
- **Security**: Helmet, CORS, Rate Limiting

## Project Structure
```text
src/
├── config/         # Environment and service configurations
├── controllers/    # Request handling (HTTP layer)
├── services/       # Business logic (Service layer)
├── repositories/   # Database interactions (Data layer)
├── routes/         # API Route definitions
├── middlewares/    # Custom middlewares (Auth, Error, Validation)
├── utils/          # Utility functions (Logger, Order Number Gen)
└── lib/            # Shared libraries (Prisma Client)
```

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   - Copy `.env` template and fill in your `DATABASE_URL` and `JWT_SECRET`.

3. **Database Migration**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Start the Server**
   - Development mode:
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```

## API Modules

### Authentication
- `POST /api/auth/register` - Create a new user (Tailor/Staff)
- `POST /api/auth/login` - Get JWT token

### Customer Management
- `GET /api/customers` - List/Search customers
- `POST /api/customers` - Add customer
- `GET /api/customers/:id` - Get customer details with measurements

### Measurement Management
- `GET /api/measurements/types` - List measurement fields (Chest, Sleeve, etc.)
- `POST /api/measurements/types` - Add new measurement type (Admin only)
- `POST /api/measurements/customer/:customerId` - Batch save customer measurements

### Order Management
- `POST /api/orders` - Create order (Snapshots measurements automatically)
- `GET /api/orders` - List/Filter orders
- `PATCH /api/orders/:id/status` - Update status (PENDING -> STITCHING -> etc.)

### Payment Management
- `POST /api/payments` - Record payment
- `GET /api/payments/order/:orderId` - Get payment history and balance
