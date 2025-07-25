import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
import { header, footer } from '../constants/constans';
@Injectable()
export class AppService {
  async generatePdf(data: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true
    });
    const page = await browser.newPage();
    let finalContent = data.content.replace('max-width:468pt;padding:72pt 72pt 72pt 72pt', 'max-width:800pt;padding:0pt 60pt 0pt 60pt');
    
    await page.setContent(`
      <style>
        @page{
          padding-top: 130px;
          padding-bottom: 140px;
        }
        table{
          margin: auto !important;
          page-break-inside: avoid;
          break-inside: avoid;
        }
        thead {
          display: table-header-group;
        }
        tfoot {
          display: table-footer-group;
        }
        tr {
          page-break-inside: avoid;
        }
      </style>
      ${finalContent}`);
    
    await page.evaluate(() => {
      const sign = document.getElementById('pdfsign');
      const pageHeight = (document.getElementById('pdfContent')?.scrollHeight ?? 842) + 109; // 109 is the height of the header in pt (not px)
      if (sign) {
        sign.style.position = 'fixed';
        const totalPages = Math.ceil(pageHeight / 842); // 842 is the standard A4 height in pt
        sign.style.top = `${((totalPages) * 842) - 110}px`;
        sign.style.left = '10px';
      }
    });

    const pdf = await page.pdf({
      format: 'A4',
      displayHeaderFooter: true,
      printBackground: true,
      headerTemplate: header,
      footerTemplate: footer,
    });
    await browser.close();
    return Buffer.from(pdf);
  }
}
