export const API = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/';

export const QUERYPARAMS = {
    provincias: 'Listados/Provincias/',
    municipios: 'Listados/MunicipiosPorProvincia/', // más {IDPROVINCIA}, que vendrá del listado de provincias.
    productos: 'Listados/ProductosPetroliferos/',
    estaciones: 'EstacionesTerrestres/FiltroMunicipioProducto/', // más {IDMUNICIPIO}/{IDPRODUCTO}, que vendrán de los filtros anteriores.
};
// NOTA: para filtrar por horario, no hace falta el endpoint de estaciones que incluye {FECHA}, por defecto la response incluye el horario actual.

export const regDays = /^[LMXJVS]-[LMXJVS]$/;