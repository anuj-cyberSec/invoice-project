# System Architecture

## High-Level Architecture

```
┌─────────────────┐    HTTP Request    ┌─────────────────┐
│   Client        │ ──────────────────► │   NestJS API    │
│   (Frontend/    │                     │   (Port 3000)   │
│   Postman/      │                     │                 │
│   cURL)         │                     │                 │
└─────────────────┘                     └─────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Validation  │  │   Routing   │  │   CORS      │        │
│  │   (DTOs)    │  │ (Controller)│  │  Middleware │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                     │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Invoice     │  │   PDF       │  │   Data      │        │
│  │ Service     │  │ Generation  │  │ Persistence │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Domain Layer                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Invoice   │  │ Line Items  │  │  Customer   │        │
│  │   Entity    │  │   Entity    │  │   Entity    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
                                                │
                                                ▼
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   JSON      │  │   In-Memory │  │   File      │        │
│  │   Storage   │  │   Cache     │  │   System    │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────┘
```

## Request flow of the process

### 1. Invoice Creation Flow

```
1. Client sends POST /api/v1/invoices
   ↓
2. Validation Pipe validates DTO
   ↓
3. InvoiceController.createInvoice()
   ↓
4. InvoiceService.createInvoice()
   ↓
5. Convert DTOs to Domain Entities
   ↓
6. Calculate totals automatically
   ↓
7. Store in memory and JSON file
   ↓
8. Return complete invoice object
```

### 2. PDF Generation Flow

```
1. Client sends GET /api/v1/invoices/:id/pdf
   ↓
2. InvoiceController.generatePDF()
   ↓
3. InvoiceService.generatePDF()
   ↓
4. Retrieve invoice by ID
   ↓
5. Generate PDF using PDFKit
   ↓
6. Set response headers for download
   ↓
7. Stream PDF buffer to client
```

## Component Details

### 1. Controllers
- **InvoiceController**: Handles HTTP requests and responses
- **Endpoints**: POST /invoices, GET /invoices, GET /invoices/:id, GET /invoices/:id/pdf
- **Responsibilities**: Request validation, response formatting, error handling

### 2. Services
- **InvoiceService**: Core business logic
- **Responsibilities**: 
  - Invoice creation and management
  - Automatic calculations (subtotal, tax, total)
  - PDF generation
  - Data persistence

### 3. DTOs (Data Transfer Objects)
- **CreateInvoiceDto**: Input validation for invoice creation
- **LineItemDto**: Validation for line items
- **CustomerDetailsDto**: Validation for customer information
- **Features**: Class-validator decorators for automatic validation

### 4. Entities
- **Invoice**: Main domain entity with business logic
- **LineItem**: Individual invoice items
- **CustomerDetails**: Customer information
- **Features**: Automatic ID generation, calculations, date handling

### 5. Modules
- **AppModule**: Root module with global configuration
- **InvoiceModule**: Feature module for invoice functionality
- **Features**: Dependency injection, module organization

## Technical Stack

### Core Technologies
- **Node.js**: Runtime environment
- **NestJS**: Framework for building scalable applications
- **TypeScript**: Type-safe JavaScript
- **Express**: HTTP server (via NestJS)

### Validation & Transformation
- **class-validator**: Input validation
- **class-transformer**: Object transformation
- **ValidationPipe**: Global validation middleware

### PDF Generation
- **PDFKit**: PDF document generation
- **Features**: Professional invoice layout, automatic formatting

### Data Storage
- **In-Memory**: Fast access for active data
- **JSON File**: Persistent storage backup
- **Features**: Automatic loading/saving, error handling

## Performance Considerations

### 1. Memory Management
- In-memory storage for fast access
- JSON file backup for persistence
- Automatic cleanup and error handling

### 2. PDF Generation
- Streaming PDF generation
- Buffer-based response
- Proper content headers for downloads

### 3. Validation
- Early validation using DTOs
- Whitelist validation to prevent injection
- Transform option for automatic type conversion

## Security Features

### 1. Input Validation
- Comprehensive DTO validation
- Type checking and sanitization
- Whitelist approach for request data

### 2. Error Handling
- Proper HTTP status codes
- Structured error responses
- No sensitive data exposure

### 3. CORS Configuration
- Enabled for cross-origin requests
- Configurable for production environments

## Data Flow Diagram

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Client    │───►│  Controller │───►│   Service   │
│  Request    │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                   │
                           ▼                   ▼
                   ┌─────────────┐    ┌─────────────┐
                   │ Validation  │    │   Entity    │
                   │    (DTO)    │    │  Creation   │
                   └─────────────┘    └─────────────┘
                                              │
                                              ▼
                                     ┌─────────────┐
                                     │   Storage   │
                                     │  (JSON)     │
                                     └─────────────┘
                                              │
                                              ▼
                                     ┌─────────────┐
                                     │  Response   │
                                     │   (JSON)    │
                                     └─────────────┘
```

## Key Design Patterns

### 1. Dependency Injection
- NestJS built-in DI container
- Service injection in controllers
- Modular architecture

### 2. Repository Pattern
- Service layer abstracts data access
- Easy to switch storage implementations
- Clean separation of concerns

### 3. DTO Pattern
- Input validation and transformation
- Type safety and documentation
- API contract definition

### 4. Entity Pattern
- Domain-driven design
- Business logic encapsulation
- Rich domain models

## Scalability Considerations

### 1. Horizontal Scaling
- Stateless application design
- External storage ready
- Load balancer compatible

### 2. Database Migration
- Easy to replace JSON storage
- Entity structure supports ORM
- Migration scripts ready

### 3. Caching Strategy
- In-memory caching implemented
- Redis integration ready
- Cache invalidation patterns

## Monitoring & Logging

### 1. Application Logs
- Console logging for development
- Structured logging ready
- Error tracking integration

### 2. Performance Metrics
- Request/response timing
- Memory usage monitoring
- PDF generation metrics

### 3. Health Checks
- Application health endpoints
- Database connectivity checks
- Service status monitoring 