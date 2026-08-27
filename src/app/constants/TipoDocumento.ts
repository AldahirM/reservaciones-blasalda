export enum TipoDocumento {
  INE = 'INE',
  DNI = 'DNI',
  PASAPORTE = 'PASAPORTE',
  CEDULA_PROFESIONAL = 'CEDULA_PROFESIONAL',
  LICENCIA_CONDUCIR = 'LICENCIA_CONDUCIR',
}

export const CodigoTipoDocumento = {
  [TipoDocumento.INE]: 1,
  [TipoDocumento.DNI]: 2,
  [TipoDocumento.PASAPORTE]: 3,
  [TipoDocumento.CEDULA_PROFESIONAL]: 4,
  [TipoDocumento.LICENCIA_CONDUCIR]: 5,
};

export const DescripcionTipoDocumento = {
  [TipoDocumento.INE]: 'Identificacion por INE',
  [TipoDocumento.DNI]: 'Identificacion por DNI',
  [TipoDocumento.PASAPORTE]: 'Identificacion por PASAPORTE',
  [TipoDocumento.CEDULA_PROFESIONAL]: 'Identificacion por CÉDULA PROFESIONAL',
  [TipoDocumento.LICENCIA_CONDUCIR]: 'Identificacion por LICENCIA PARA CONDUCIR',
};
