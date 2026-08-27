export interface HabitacionRequest {
  numeroHabitacion: number;
  tipo: number;
  precio: number;
  capacidad: number;
}

export interface HabitacionResponse {
  id: number;
  estadoHabitacin: string;
  numeroHabitacion: number;
  tipo: string;
  precio: number;
  capacidad: number;
}

export interface DatosHabitacion{
    numeroHabitacion: number;
    precio: number;
    capacidad: number;
    estadoHabitacion: string;
}