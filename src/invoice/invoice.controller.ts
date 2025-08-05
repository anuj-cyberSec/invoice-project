import { Controller, Post, Get, Param, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Controller('invoices')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async createInvoice(@Body() createInvoiceDto: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceService.createInvoice(createInvoiceDto);
  }

  @Get()
  async getAllInvoices(): Promise<Invoice[]> {
    return this.invoiceService.getAllInvoices();
  }

  @Get(':id')
  async getInvoiceById(@Param('id') id: string): Promise<Invoice> {
    return this.invoiceService.getInvoiceById(id);
  }

  @Get(':id/pdf')
  async generatePDF(@Param('id') id: string, @Res() res: Response): Promise<void> {
    try {
      const pdfBuffer = await this.invoiceService.generatePDF(id);
      const invoice = await this.invoiceService.getInvoiceById(id);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`,
        'Content-Length': pdfBuffer.length,
      });
      
      res.status(HttpStatus.OK).send(pdfBuffer);
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND).json({
        message: error.message,
        statusCode: HttpStatus.NOT_FOUND,
      });
    }
  }
}