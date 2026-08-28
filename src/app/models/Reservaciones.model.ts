import { DatosHabitacion } from './Habitacion.model';
import { DatosHuesped } from './Huesped.model';

export interface ReservacionRequest {
  idHuesped: number;
  idHabitacion: number;
  fechaEntrada: string;
  fechaSalida: string;
}

export interface ReservacionResponse {
  id: number;
  datosHuesped?: DatosHuesped;
  datosHabitacion?: DatosHabitacion;
  fechaEntrada: Date;
  fechaSalida: Date;
  idEstadoReserva: number;
  estadoReserva: string;
}
