import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import {
  ReservacionRequest,
  ReservacionResponse,
} from '../models/Reservaciones.model';

@Injectable({
  providedIn: 'root',
})
export class ReservacionesService {
  private apiUrl: string = environment.reservacionesUrl;

  constructor(private http: HttpClient) {}

  getReservaciones(): Observable<ReservacionResponse[]> {
    return this.http.get<ReservacionResponse[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener las reservaciones', error);
        return of([]);
      }),
    );
  }
  getReservacion(idReservacion: number): Observable<ReservacionResponse> {
    return this.http
      .get<ReservacionResponse>(this.apiUrl + '/' + idReservacion)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener la reservacion', error);
          return of();
        }),
      );
  }
  postReservacion(
    reservacionRequest: ReservacionRequest,
  ): Observable<ReservacionResponse> {
    return this.http
      .post<ReservacionResponse>(this.apiUrl, reservacionRequest)
      .pipe(
        catchError((error) => {
          console.error('Error al registrar la reservacion', error);
          return of();
        }),
      );
  }

  putReservacion(
    reservacionRequest: ReservacionRequest,
    idReservacion: number,
  ): Observable<ReservacionResponse> {
    return this.http
      .put<ReservacionResponse>(
        this.apiUrl + '/' + idReservacion,
        reservacionRequest,
      )
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar la reservacion', error);
          return of();
        }),
      );
  }
  deleteReservacion(idReservacion: number): Observable<void> {
    return this.http
      .delete<void>(this.apiUrl + '/' + idReservacion)
      .pipe(
        catchError((error) => {
          console.error('Error al eliminar la reservacion', error);
          return of();
        }),
      );
  }
}
