import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice, LineItem, CustomerDetails } from './entities/invoice.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class InvoiceService {
  private readonly storageFile = 'invoices.json';
  private invoices: Invoice[] = [];

  constructor() {
    this.loadInvoices();
  }

  async createInvoice(createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    
    const customer = new CustomerDetails(
      createInvoiceDto.customer.name,
      createInvoiceDto.customer.email,
      createInvoiceDto.customer.address,
      createInvoiceDto.customer.phone,
      createInvoiceDto.customer.company
    );

    const lineItems = createInvoiceDto.lineItems.map(item => 
      new LineItem(item.description, item.quantity, item.unitPrice)
    );

    const invoice = new Invoice(customer, lineItems, createInvoiceDto.taxRate || 0.1);
    
    this.invoices.push(invoice);
    this.saveInvoices();
    
    return invoice;
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoices;
  }

  async getInvoiceById(id: string): Promise<Invoice> {
    const invoice = this.invoices.find(inv => inv.id === id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  async generatePDF(invoiceId: string): Promise<Buffer> {
    const invoice = await this.getInvoiceById(invoiceId);
    
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      try {
        doc.fontSize(24).text('INVOICE', { align: 'center' });
        doc.moveDown();
        
        doc.fontSize(12);
        doc.text(`Invoice Number: ${invoice.invoiceNumber}`);
        doc.text(`Date: ${invoice.createdAt.toLocaleDateString()}`);
        doc.text(`Due Date: ${invoice.dueDate.toLocaleDateString()}`);
        doc.moveDown();

        
        doc.fontSize(14).text('Bill To:', { underline: true });
        doc.fontSize(12);
        doc.text(invoice.customer.name);
        if (invoice.customer.company) {
          doc.text(invoice.customer.company);
        }
        doc.text(invoice.customer.address);
        doc.text(`Email: ${invoice.customer.email}`);
        if (invoice.customer.phone) {
          doc.text(`Phone: ${invoice.customer.phone}`);
        }
        doc.moveDown();

        
        doc.fontSize(14).text('Items:', { underline: true });
        doc.moveDown();
        
        
        doc.fontSize(10);
        doc.text('Description', 50, doc.y, { width: 200 });
        doc.text('Qty', 250, doc.y - 15, { width: 50 });
        doc.text('Unit Price', 300, doc.y - 15, { width: 80 });
        doc.text('Total', 380, doc.y - 15, { width: 80 });
        doc.moveDown();

        
        invoice.lineItems.forEach(item => {
          doc.text(item.description, 50, doc.y, { width: 200 });
          doc.text(item.quantity.toString(), 250, doc.y - 15, { width: 50 });
          doc.text(`$${item.unitPrice.toFixed(2)}`, 300, doc.y - 15, { width: 80 });
          doc.text(`$${item.total.toFixed(2)}`, 380, doc.y - 15, { width: 80 });
          doc.moveDown();
        });

        
        doc.moveDown();
        doc.text('', 300, doc.y, { width: 80 });
        doc.text('Subtotal:', 300, doc.y, { width: 80 });
        doc.text(`$${invoice.subtotal.toFixed(2)}`, 380, doc.y, { width: 80 });
        doc.moveDown();

        doc.text('', 300, doc.y, { width: 80 });
        doc.text(`Tax (${(invoice.taxRate * 100).toFixed(1)}%):`, 300, doc.y, { width: 80 });
        doc.text(`$${invoice.taxAmount.toFixed(2)}`, 380, doc.y, { width: 80 });
        doc.moveDown();

        doc.fontSize(14);
        doc.text('', 300, doc.y, { width: 80 });
        doc.text('Total:', 300, doc.y, { width: 80 });
        doc.text(`$${invoice.total.toFixed(2)}`, 380, doc.y, { width: 80 });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private loadInvoices(): void {
    try {
      if (fs.existsSync(this.storageFile)) {
        const data = fs.readFileSync(this.storageFile, 'utf8');
        const rawInvoices = JSON.parse(data);
        
        this.invoices = rawInvoices.map(rawInvoice => {
          const invoice = new Invoice(
            new CustomerDetails(
              rawInvoice.customer.name,
              rawInvoice.customer.email,
              rawInvoice.customer.address,
              rawInvoice.customer.phone,
              rawInvoice.customer.company
            ),
            rawInvoice.lineItems.map(item => 
              new LineItem(item.description, item.quantity, item.unitPrice)
            ),
            rawInvoice.taxRate
          );
          
          invoice.id = rawInvoice.id;
          invoice.invoiceNumber = rawInvoice.invoiceNumber;
          invoice.subtotal = rawInvoice.subtotal;
          invoice.taxAmount = rawInvoice.taxAmount;
          invoice.total = rawInvoice.total;
          invoice.createdAt = new Date(rawInvoice.createdAt);
          invoice.dueDate = new Date(rawInvoice.dueDate);
          
          return invoice;
        });
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
      this.invoices = [];
    }
  }

  private saveInvoices(): void {
    try {
      fs.writeFileSync(this.storageFile, JSON.stringify(this.invoices, null, 2));
    } catch (error) {
      console.error('Error saving invoices:', error);
    }
  }
}