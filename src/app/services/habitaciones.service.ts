import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import {
  HabitacionRequest,
  HabitacionResponse,
} from '../models/Habitacion.model';

@Injectable({
  providedIn: 'root',
})
export class HabitacionesService {
  private apiUrl: string = environment.habitacionesUrl;

  constructor(private http: HttpClient) {}

  getHabitaciones(): Observable<HabitacionResponse[]> {
    return this.http.get<HabitacionResponse[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error al obtener las habitaciones', error);
        return of([]);
      }),
    );
  }

  getHabitacion(idHabitacion: number): Observable<HabitacionResponse> {
    return this.http
      .get<HabitacionResponse>(this.apiUrl + '/' + idHabitacion)
      .pipe(
        catchError((error) => {
          console.error('Error al obtener las habitaciones', error);
          return of();
        }),
      );
  }

  postHabitacion(request: HabitacionRequest): Observable<HabitacionResponse> {
    return this.http.post<HabitacionResponse>(this.apiUrl, request).pipe(
      catchError((error) => {
        console.error('Error al registrar la habitacion', error);
        return of();
      }),
    );
  }

  putHabitacion(
    request: HabitacionRequest,
    idHabitacion: number,
  ): Observable<HabitacionResponse> {
    return this.http
      .put<HabitacionResponse>(this.apiUrl + '/' + idHabitacion, request)
      .pipe(
        catchError((error) => {
          console.error('Error al actualizar la habitacion', error);
          return of();
        }),
      );
  }
  
  deleteHabitacion(idHabitacion: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + '/' + idHabitacion).pipe(
      catchError((error) => {
        console.error('Error al eliminar la reservacion', error);
        return of();
      }),
    );
  }

  cambiarEstadoHabitacion(idHabitacion: number, idEstado: 3 | 4): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${idHabitacion}/estado/${idEstado}`,
      {},
    );
  }
}
