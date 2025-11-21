import { cargarProvincias, cargarMunicipios, cargarProductos } from './fetchData.js';

export const provinciaSelectEl = document.getElementById('provincia');
export const municipioSelectEl = document.getElementById('municipio');
export const productoSelectEl = document.getElementById('producto');

const placeholder = {
  provincias: 'Elige una provincia',
  municipios: 'Elige un municipio',
  productos: 'Elige el tipo de carburante',
}

initialize();

provinciaSelectEl.addEventListener('change', async () => {
  resetSelect(municipioSelectEl, placeholder.municipios);
  const municipios = await cargarMunicipios(provinciaSelectEl.value);
  insertData(municipioSelectEl, municipios);
});

// Estado inicial de los menús: inhabilitados, con placeholder por defecto. Carga inicial: menú Provincias y menú productos
async function initialize() {
  resetSelect(provinciaSelectEl, placeholder.provincias);
  resetSelect(municipioSelectEl, placeholder.municipios);
  resetSelect(productoSelectEl, placeholder.productos);
  const provincias = await cargarProvincias();
  const productos = await cargarProductos();
  insertData(provinciaSelectEl, provincias);
  insertData(productoSelectEl, productos);
}

// Implementa la opción por defecto en cada select, por ejemplo: <option value="" selected disabled>Texto placeholder</option>
// Aquí el value está vacío porque sólo es un marcador de posición, no un valor real.
function resetSelect(selectEl, placeholder) {
  selectEl.innerHTML = '';
  const option = document.createElement('option');
  option.value = ''; 
  option.textContent = placeholder;
  option.selected = true;
  option.disabled = true;
  selectEl.appendChild(option);
  selectEl.disabled = true; // Deshabilita el desplegable cuando sólo contiene el default.
}


// Añade las opciones después de la inserción del placeholder.
function insertData(selectEl, array) {
  if (array.length === 0) { 
    selectEl.disabled = true; 
    return; 
  } 
  selectEl.disabled = false;
  for (const el of array) {
    const option = document.createElement('option');
    option.value = el.id.toString(); // El value tiene que ser un String. Utilizamos el id porque será el índice de búsqueda en los mapas.
    option.textContent = el.nombre.toUpperCase();
    selectEl.appendChild(option);
  }
}



