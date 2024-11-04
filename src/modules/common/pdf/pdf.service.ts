import { Injectable } from '@nestjs/common';
import * as Handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';
import { createFolderIfNotExists, formatDate } from '@/utils/helpers';

@Injectable()
export class PdfService {
  public readonly accessPath = 'public/resumes';
  public readonly resumeTemplatePath = '../../../templates/resumes/';

  async generatePdf(templateName: string, data: any) {
    // Define the path to your Handlebars templates
    const templatePath = path.join(__dirname, this.resumeTemplatePath, `${templateName}.hbs`);
    const templateSource = fs.readFileSync(templatePath, 'utf-8');
    const htmlContent = Handlebars.compile(templateSource)(data);

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    await page.waitForSelector('body > *', { timeout: 1000000000 });

    // in case not have access path will create
    const currentTime = formatDate(new Date());
    const publicFolderPath = path.join(process.cwd(), `${this.accessPath}/${currentTime}`);
    createFolderIfNotExists(publicFolderPath);

    // create common path
    const commonPath = path.join(
      publicFolderPath,
      `${currentTime}_${templateName.replaceAll('/', '_')}`
    );

    // generate pdf
    const pdfPath = `${commonPath}.pdf`;
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true
    });

    // screenshot
    const screenshotPath = `${commonPath}.jpeg`;
    await page.setViewport({ width: 795, height: 1100 });
    await page.screenshot({ path: screenshotPath, type: 'jpeg', optimizeForSpeed: true });

    await browser.close();
  }
}
