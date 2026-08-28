import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { HuespedRequest, HuespedResponse } from '../models/Huesped.model';

@Injectable({
  providedIn: 'root',
})
export class HuespedesService {
  private apiUrl: string = environment.huespedesUrl;

  constructor(private http: HttpClient) {}

  getHuespedes(): Observable<HuespedResponse[]> {
    return this.http.get<HuespedResponse[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener los huéspedes', error);
        return of([]);
      }),
    );
  }
  getHuesped(idHuesped: number): Observable<HuespedResponse> {
    return this.http.get<HuespedResponse>(this.apiUrl + '/' + idHuesped).pipe(
      catchError((error) => {
        console.error('Error al obtener el huesped', error);
        return of();
      }),
    );
  }

  postHuesped(huesped: HuespedRequest): Observable<HuespedResponse> {
    return this.http.post<HuespedResponse>(this.apiUrl, huesped).pipe(
      catchError((error) => {
        console.error('Error al registrar el huesped', error);
        return throwError(() => error);
      }),
    );
  }

  putHuesped(
    huesped: HuespedRequest,
    huespedId: number,
  ): Observable<HuespedResponse> {
    return this.http
      .put<HuespedResponse>(`${this.apiUrl}/${huespedId}`, huesped)
      .pipe(
        catchError((error) => {
          console.error('Error al registrar el huesped', error);
          return throwError(() => error);
        }),
      );
  }
  deleteHuesped(huespedId: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${huespedId}`)
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar el usuario', error);
          return throwError(() => error);
        }),
      );
  }
}
