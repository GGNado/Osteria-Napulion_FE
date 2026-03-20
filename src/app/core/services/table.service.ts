import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AllUrl } from '../url/all.url';
import { UpdateTableSchemaDTO } from '../dto/update-table-schema.dto';

@Injectable({ providedIn: 'root' })
export class TableService {
    constructor(private readonly http: HttpClient) { }

    getAllTables(): Observable<HttpResponse<any>> {
        return this.http.get(AllUrl.tavoli(), { observe: 'response' });
    }

    updateSchema(tables: UpdateTableSchemaDTO[]): Observable<HttpResponse<any>> {
      console.log(tables);
        return this.http.patch(AllUrl.tavoliUpdateSchema(), tables, { observe: 'response' });
    }
}
