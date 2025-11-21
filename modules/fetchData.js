import { API, QUERYPARAMS } from './utils/constants.js';
import { fetchAPI } from './../utils/fetchAPI.js';

// El método .map() recorre un array y devuelve un nuevo array tras aplicar una función a cada elemento. Aquí, por cada provincia (p) se extraen id y nombre. 
export async function cargarProvincias() {
    let provinciasData = await fetchAPI(`${API}${QUERYPARAMS.provincias}`);
    return (provinciasData ?? []).map((p) => ({ // ??: devuelve un valor por defecto si lo de la izquierda es 'null' o 'undefined'.
        id: p.IDPovincia, // CUIDADO! IDPovincia.
        nombre: p.Provincia,
    }));
}

export async function cargarMunicipios(idProvincia) {
    let municipiosData = await fetchAPI(`${API + QUERYPARAMS.municipios + idProvincia}`);
    return (municipiosData ?? []).map(m => ({ // Al devolver un objeto literal, ponerlo entre paréntesis por claridad.
        id: m.IDMunicipio,
        nombre: m.Municipio,
    }));
}

export async function cargarProductos() {
    let productosData = await fetchAPI(`${API + QUERYPARAMS.productos}`);
    return (productosData ?? []).map(p => ({
        id: p.IDProducto,
        nombre: p.NombreProducto,
    }));
}

export async function cargarEstaciones(idMunicipio, idProducto) {
    let estacionesData = await fetchAPI(`${API + QUERYPARAMS.estaciones + idMunicipio}/${idProducto}`);
    //IMPORTANTE!!! Al contener las claves del JSON caracteres especiales (espacios, acentos, puntos), la notación debe INCLUIR CORCHETES.
    return ((estacionesData?.ListaEESSPrecio) ?? []).map(e => ({ // ? devuelve undefined y para la ejecución si lo de la izquierda es 'null' o 'undefined'. Es una forma segura de acceder a los datos.
        nombre: e['Rótulo'],
        direccion: e['Dirección'],
        localidad: e['Localidad'],
        provincia: e['Provincia'],
        horario: e['Horario'],
        precio: parseFloat((e['PrecioProducto']).replace(',', '.')), // CUIDADO! Devuelve el precio con coma, no con punto, transformar!
    }));
}
