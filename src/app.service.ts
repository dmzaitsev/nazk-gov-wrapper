/* eslint-disable prettier/prettier */
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Document, DocumentList } from './document.model';

@Injectable()
export class AppService {
  constructor(private readonly http: HttpService) {}

  private readonly ZNAK_PUBLIC_API = 'https://public-api.nazk.gov.ua/v2/documents/list';

  public async getDocumentsPage(declaration_year: number, page: number): Promise<DocumentList> {
    const url = `${this.ZNAK_PUBLIC_API}?=declaration_year=${declaration_year}&page=${page}`;
    const result = await firstValueFrom(
      this.http.get<DocumentList>(url, { headers: { Accept: '*/*' } }).pipe()
    );
    return result.data;
  }

  public async getDocuments(declaration_year: number): Promise<Document[]> {
    const documents: Document[] = [];
    for(let i = 0; i <= 100; i++) {
      const documentList = await this.getDocumentsPage(declaration_year, i);
      if (documentList?.data?.length > 0) {
        documents.push(...documentList.data);
      }
    }

    console.log({documentsSize: documents.length});
    return documents;
  }

  public filterDocuments(documents: Document[], fieldName: string, fieldValue: any): Document[] {
    return documents.filter(obj => {
      for (const key in obj) {
        if (key === fieldName && obj[key] === fieldValue) {
          return true;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (this.filterDocuments([obj[key]], fieldName, fieldValue).length > 0) {
            return true;
          }
        }
      }
      return false;
    });
  }

  public filterDocumentIDs(documents: Document[]): string[] {
    console.log({documentsSizeTOFOlter: documents.length});
    return documents.map(document => `https://public.nazk.gov.ua/documents/${document.id}`);
  }
}
