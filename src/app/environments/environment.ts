export const localhost: string = 'http://localhost';
export const gateway: string = localhost.concat(':8090/api');

export const environment = {
  apiUrl: localhost.concat(':8090/api/'),
  authUrl: localhost.concat(':9000/api/login'),
  apiUsuarios: localhost.concat(':9000/admin/usuarios'),
  huespedesUrl: gateway.concat('/huespedes'),
  habitacionesUrl: gateway.concat('/habitaciones'),
  reservacionesUrl: gateway.concat('/huespedes'),
};
