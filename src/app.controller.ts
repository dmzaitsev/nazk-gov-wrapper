import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('documents/list')
  public async getDocuments(
    @Query('year') year: number,
    @Query('name') name: string,
    @Query('value') value: any,
  ): Promise<string[]> {
    console.log('Working on request');
    if (!year || year < 2015 || year > 2024) {
      return ['{year} must be from 2015 to 2024'];
    }
    if (!name || name.length < 1) {
      return ['{name} must be not empty and no whitespace'];
    }
    if (!value) {
      return ['{name} must be not empty'];
    }
    const documents = await this.appService.getDocuments(year);
    const filteredDocs = this.appService.filterDocuments(
      documents,
      name,
      value,
    );
    return this.appService.filterDocumentIDs(filteredDocs);
  }
}
