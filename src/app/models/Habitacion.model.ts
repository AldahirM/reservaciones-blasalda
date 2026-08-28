export interface HabitacionRequest {
  numeroHabitacion: number;
  tipo: number;
  precio: number;
  capacidad: number;
}

export interface HabitacionResponse {
  id: number;
  idEstadoHabitacion: number;
  estadoHabitacion: string;
  numeroHabitacion: number;
  tipoHabitacion: string;
  idTipoHabitacion: number;
  precio: number;
  capacidad: number;
}

export interface DatosHabitacion{
  id?: number;
    numeroHabitacion: number;
    precio: number;
    capacidad: number;
    estadoHabitacion: string;
}