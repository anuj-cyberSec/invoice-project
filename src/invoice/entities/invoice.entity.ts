export class LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;

  constructor(description: string, quantity: number, unitPrice: number) {
    this.id = this.generateId();
    this.description = description;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
    this.total = quantity * unitPrice;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

export class CustomerDetails {
  name: string;
  email: string;
  address: string;
  phone?: string;
  company?: string;

  constructor(name: string, email: string, address: string, phone?: string, company?: string) {
    this.name = name;
    this.email = email;
    this.address = address;
    this.phone = phone;
    this.company = company;
  }
}

export class Invoice {
  id: string;
  invoiceNumber: string;
  customer: CustomerDetails;
  lineItems: LineItem[];
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number;
  createdAt: Date;
  dueDate: Date;

  constructor(customer: CustomerDetails, lineItems: LineItem[], taxRate: number = 0.1) {
    this.id = this.generateId();
    this.invoiceNumber = this.generateInvoiceNumber();
    this.customer = customer;
    this.lineItems = lineItems;
    this.taxRate = taxRate;
    this.subtotal = this.calculateSubtotal();
    this.taxAmount = this.calculateTax();
    this.total = this.calculateTotal();
    this.createdAt = new Date();
    this.dueDate = this.calculateDueDate();
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private generateInvoiceNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `INV-${timestamp}-${random}`;
  }

  private calculateSubtotal(): number {
    return this.lineItems.reduce((sum, item) => sum + item.total, 0);
  }

  private calculateTax(): number {
    return this.subtotal * this.taxRate;
  }

  private calculateTotal(): number {
    return this.subtotal + this.taxAmount;
  }

  private calculateDueDate(): Date {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from creation
    return dueDate;
  }
} 