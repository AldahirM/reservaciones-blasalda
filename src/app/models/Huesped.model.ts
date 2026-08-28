import { TipoDocumento } from "../constants/TipoDocumento";

export interface HuespedRequest {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: string;
  email: string;
  telefono: string;
  tipoDocumento: number;
  documento: string;
  nacionalidad: string;
}
export interface HuespedResponse {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: Date;
  email: string;
  telefono: string;
  tipoDocumento: TipoDocumento;
  documento: string;
  nacionalidad: string;
}

export interface DatosHuesped {
  id?: number;
  nombre: string;
  edad: string;
  telefono: string;
  email: string;
  tipoDocumento: string;
  nacionalidad: string;
}
