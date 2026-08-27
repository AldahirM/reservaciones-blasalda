export interface HuespedRequest {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fechaNacimiento: Date;
  email: string;
  telefono: string;
  tipoDocumento: number;
  documento: string;
  nacionalidad: string;
}
export interface HuespedResponse {
  id: number;
  nombre: string;
  edad: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  documento: string;
  nacionalidad: string;
}

export interface DatosHuesped {
  nombre: string;
  edad: string;
  telefono: string;
  email: string;
  tipoDocumento: string;
  nacionalidad: string;
}
