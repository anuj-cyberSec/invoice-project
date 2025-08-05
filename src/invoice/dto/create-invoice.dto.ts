import { IsString, IsEmail, IsArray, IsNumber, IsPositive, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class LineItemDto {
  @IsString()
  description: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class CustomerDetailsDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  company?: string;
}

export class CreateInvoiceDto {
  @ValidateNested()
  @Type(() => CustomerDetailsDto)
  customer: CustomerDetailsDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems: LineItemDto[];

  @IsNumber()
  @IsPositive()
  @IsOptional()
  taxRate?: number = 0.1; // Default 10% tax rate
} 