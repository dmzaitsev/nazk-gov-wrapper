import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Document, DocumentList } from './document.model';

@Injectable()
export class AppService {
  constructor(private readonly http: HttpService) {}

  private readonly ZNAK_PUBLIC_API =
    'https://public-api.nazk.gov.ua/v2/documents/list';

  public async getDocumentsPage(
    declaration_year: number,
    page: number,
  ): Promise<DocumentList> {
    const url = `${this.ZNAK_PUBLIC_API}?=declaration_year=${declaration_year}&page=${page}`;
    const result = await firstValueFrom(
      this.http.get<DocumentList>(url, { headers: { Accept: '*/*' } }).pipe(),
    );
    return result.data;
  }

  public async getDocuments(declaration_year: number): Promise<Document[]> {
    const documents: Document[] = [];
    for (let i = 0; i <= 100; i++) {
      const documentList = await this.getDocumentsPage(declaration_year, i);
      if (documentList?.data?.length > 0) {
        documents.push(...documentList.data);
      }
    }

    console.log({ documentsSize: documents.length });
    return documents;
  }

  public filterDocuments(
    documents: Document[],
    fieldName: string,
    fieldValue: any,
  ): Document[] {
    return documents.filter((obj) => {
      for (const key in obj) {
        if (key === fieldName && this.compareValues(obj[key], fieldValue)) {
          return true;
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (
            this.filterDocuments([obj[key]], fieldName, fieldValue).length > 0
          ) {
            return true;
          }
        }
      }
      return false;
    });
  }

  private compareValues(value1: any, value2: any): boolean {
    if (typeof value1 === 'string' && typeof value2 === 'string') {
      return (
        value1.toLowerCase().includes(value2.toLowerCase()) ||
        value2.toLowerCase().includes(value1.toLowerCase())
      );
    }
    return value1 == value2;
  }

  public filterDocumentIDs(documents: Document[]): string[] {
    return Array.from(
      new Set(
        documents.map(
          (document) => `https://public.nazk.gov.ua/documents/${document.id}`,
        ),
      ),
    );
  }

  private readonly mongoUrl =
    'https://eu-central-1.aws.data.mongodb-api.com/app/data-wxpohua/endpoint/data/v1/action/insertOne';
  private readonly mongoHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Request-Headers': '*',
    'api-key':
      'vKYiTfTelegeSz3p5NvSSS8KpiVgpvu4L3gQRGR01Vg45MPwg60gf2zD5o7PxcmI',
  };

  public async insertWeddingGuest(guest: any): Promise<any> {
    const body = {
      collection: 'weddingG',
      database: 'weddingG',
      dataSource: 'Cluster0',
      document: guest,
    };
    return await firstValueFrom(
      this.http
        .post(this.mongoUrl, body, {
          headers: this.mongoHeaders,
        })
        .pipe(),
    );
  }
}
