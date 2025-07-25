import { Controller, Get, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  async getGeneratedPdf(@Body() data: any, @Res() res: Response): Promise<void> {
    const pdfBuffer = await this.appService.generatePdf(data);
    
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="generated-report.pdf"',
      'Content-Length': pdfBuffer.length,
    });
    
    res.send(pdfBuffer);
  }
}
