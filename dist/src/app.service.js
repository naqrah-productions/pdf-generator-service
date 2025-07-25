"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const puppeteer_1 = require("puppeteer");
const constans_1 = require("../constants/constans");
let AppService = class AppService {
    async generatePdf(data) {
        const browser = await puppeteer_1.default.launch({
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
            const pageHeight = (document.getElementById('pdfContent')?.scrollHeight ?? 842) + 109;
            if (sign) {
                sign.style.position = 'fixed';
                const totalPages = Math.ceil(pageHeight / 842);
                sign.style.top = `${((totalPages) * 842) - 110}px`;
                sign.style.left = '10px';
            }
        });
        const pdf = await page.pdf({
            format: 'A4',
            displayHeaderFooter: true,
            printBackground: true,
            headerTemplate: constans_1.header,
            footerTemplate: constans_1.footer,
        });
        await browser.close();
        return Buffer.from(pdf);
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map