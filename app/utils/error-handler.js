

export const errorHandler = (status) => {
  switch (status) {
    case 200:
      break;
    case 500:
      console.log("Desde Error-Handler: Error en el servidor");
      break;
    case 404:
      console.log("Desde Error-Handler: No se encontraron datos");
      break;
    case 400:
      console.log("Desde Error-Handler: Error en la petición");
      break;
    case 401:
      console.log("Desde Error-Handler: No autorizado");
      break;
    default:
      console.log("Desde Error-Handler:  Error desconocido");
  }
}