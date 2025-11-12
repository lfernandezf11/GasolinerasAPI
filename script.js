const API = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/';

const QUERYPARAMS = {
    provincias: 'Listados/Provincias/',
    municipios: 'Listados/MunicipiosPorProvincia/', // más {IDPROVINCIA}, que vendrá del listado de provincias.
    productos: 'Listados/ProductosPetroliferos/',
    estaciones: 'EstacionesTerrestres/FiltroMunicipioProducto/', // más {IDMUNICIPIO}/{IDPRODUCTO}, que vendrán de los filtros anteriores.
};

async function fetchAPI(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) { throw new Error(`Error de red: ${response.statusText}`); }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }
}

async function cargarProvincias() {
    let provinciasData = await fetchAPI(`${API}${QUERYPARAMS.provincias}`);
    // Sintaxis de map: array.map(elemento, index). Aquí, por cada elemento (provincia p) de dataProvincias, se añade al mapa su id y nombre, que corresponden a las variables del JSON IDPovincia y Provincia. 
    return (provinciasData ?? []).map((p) => ({ // ??: devuelve un valor por defecto (en este caso, [], si lo de la izquierda es 'null' o 'undefined'.
        id: p.IDPovincia, // CUIDADO! DEVUELVE IDPovincia.
        nombre: p.Provincia,
    }));
}

async function cargarMunicipios(idProvincia) {
    let municipiosData = await fetchAPI(`${API + QUERYPARAMS.municipios + idProvincia}`);
    return (municipiosData ?? []).map(m => ({ // Al devolver un objeto literal, ponerlo entre paréntesis por claridad.
        id: m.IDMunicipio,
        nombre: m.Municipio,
    }));
}

async function cargarProductos() {
    let productosData = await fetchAPI(`${API + QUERYPARAMS.productos}`);
    return (productosData ?? []).map(p => ({
        id: p.IDProducto,
        nombre: p.NombreProducto,
    }));
}

async function cargarEstaciones(idMunicipio, idProducto) {
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
