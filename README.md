# Invoice Generator API

A comprehensive invoice generator API built with NestJS and TypeScript, featuring automatic calculations, PDF export, and RESTful endpoints.

## Features

- **Invoice Creation**: Create invoices with customer details and line items
- **Automatic Calculations**: Subtotal, tax, and total are calculated automatically
- **PDF Export**: Generate downloadable PDF invoices
- **Data Persistence**: In-memory storage with JSON file backup
- **Validation**: Comprehensive input validation using class-validator
- **RESTful API**: Clean, well-structured REST endpoints

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd invoice-generator-api
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Project Structure

```
src/
├── main.ts                 # Application entry point
├── app.module.ts          # Root module
└── invoice/
    ├── invoice.module.ts   # Invoice module
    ├── invoice.controller.ts # REST endpoints
    ├── invoice.service.ts  # Business logic
    ├── dto/
    │   └── create-invoice.dto.ts # Data transfer objects
    └── entities/
        └── invoice.entity.ts # Domain entities
```

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Endpoints

#### 1. Create Invoice
**POST** `/invoices`

Creates a new invoice with customer details and line items.

**Request Body:**
```json
{
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp"
  },
  "lineItems": [
    {
      "description": "Web Development Services",
      "quantity": 10,
      "unitPrice": 100.00
    },
    {
      "description": "UI/UX Design",
      "quantity": 5,
      "unitPrice": 75.00
    }
  ],
  "taxRate": 0.1
}
```

**Response:**
```json
{
  "id": "abc123def",
  "invoiceNumber": "INV-1703123456789-123",
  "customer": {
    "name": "John Doe",
    "email": "john@example.com",
    "address": "123 Main St, City, State 12345",
    "phone": "+1-555-123-4567",
    "company": "Acme Corp"
  },
  "lineItems": [
    {
      "id": "item1",
      "description": "Web Development Services",
      "quantity": 10,
      "unitPrice": 100.00,
      "total": 1000.00
    }
  ],
  "subtotal": 1375.00,
  "taxAmount": 137.50,
  "total": 1512.50,
  "taxRate": 0.1,
  "createdAt": "2023-12-21T10:30:00.000Z",
  "dueDate": "2024-01-20T10:30:00.000Z"
}
```

#### 2. Get All Invoices
**GET** `/invoices`

Retrieves all created invoices.

#### 3. Get Invoice by ID
**GET** `/invoices/:id`

Retrieves a specific invoice by its ID.

#### 4. Generate PDF
**GET** `/invoices/:id/pdf`

Downloads the invoice as a PDF file.

## Configuration

### Environment Variables
- `PORT`: Server port (default: 3000)

### Tax Rate
- Default tax rate: 10% (0.1)
- Can be customized per invoice in the request body


## Architecture

### System Design Flow

```
Client Request
    ↓
Validation (DTO)
    ↓
Controller (REST Endpoints)
    ↓
Service (Business Logic)
    ↓
Entity (Domain Model)
    ↓
Storage (JSON File)
```

### Key Components

1. **DTOs (Data Transfer Objects)**: Input validation and type safety
2. **Entities**: Domain models with business logic
3. **Services**: Business logic and data operations
4. **Controllers**: HTTP request handling
5. **Modules**: Dependency injection and organization

## Deployment

### Production Build
```bash
npm run build
npm start
```
