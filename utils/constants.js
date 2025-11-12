export const API = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/';

export const QUERYPARAMS = {
    provincias: 'Listados/Provincias/',
    municipios: 'Listados/MunicipiosPorProvincia/', // más {IDPROVINCIA}, que vendrá del listado de provincias.
    productos: 'Listados/ProductosPetroliferos/',
    estaciones: 'EstacionesTerrestres/FiltroMunicipioProducto/', // más {IDMUNICIPIO}/{IDPRODUCTO}, que vendrán de los filtros anteriores.
};