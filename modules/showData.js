import { cargarEstaciones } from './fetchData.js';
import { provinciaSelectEl, municipioSelectEl, productoSelectEl } from './fillData.js';
import { regDays } from './../utils/constants.js';

const submit = document.getElementById('buscar');
const checkEl = document.getElementById('abierta');
const resultsSectionEl = document.querySelector('.results');

submit.addEventListener('click', async (e) => {
    e.preventDefault();
    const provinciaId = provinciaSelectEl?.value || ''; //Al utilizar || y no ?? para dar el valor por defecto, '' es considerado en JS un falsy, y provincia será false.
    const municipioId = municipioSelectEl?.value || '';
    const productoId = productoSelectEl?.value || '';
    const isOpen = checkEl.checked;

    if (provinciaId && municipioId && productoId) {
        const estaciones = await cargarEstaciones(municipioId, productoId);
        const filtered = isOpen ? isOpenNow(estaciones) : estaciones;
        showResults(filtered);
    }
});

//Formatos de llegadas de horario: 
// 'L-V: 07:00-19:00' || L: 06:00-22:00' || 'L-D: 24H' ||
//  L-J: 07:00-23:00; V: 07:00-01:00; S: 05:00-01:00; D: 05:00-23:00 || L-D: 06:00-23:00

function isOpenNow(estaciones) {
    const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];// CUIDADO! La semana empieza en domingo.
    let isOpen = [];
    let now = new Date();
    let hour = now.getHours();
    let min = now.getMinutes();
    let dayIndex = now.getDay();

    for (const e of estaciones) {
        if (e.horario.includes('24')) {
            isOpen.push(e);
        } else {
            let partitions = e.horario?.split(';');
            for (const p of partitions) { //in para índices, of para elementos
                let parts = p.split(' ');
                let openDays = parts[0].replace(':', '');

                let dayOk = false;
                if (openDays.startsWith(weekDays[dayIndex])) { dayOk = true; }

                if (openDays === 'L-D') { dayOk = true; }
                if (regDays.test(openDays)) {

                    let initialIndex = weekDays.indexOf(openDays.split('-')[0]);
                    let finalIndex = weekDays.indexOf(openDays.split('-')[1]);
                    if (initialIndex < finalIndex) {
                        dayOk = (dayIndex >= initialIndex && dayIndex <= finalIndex);
                    } else { // Caso de días cíclicos: ej S-D, donde los índices son 6-0
                        dayOk = (dayIndex >= initialIndex) || (dayIndex <= finalIndex);
                    }
                }

                let hourOk = false;
                if (dayOk) {
                    let splitHor = parts[1]?.split('-');
                    let openHour = Number(splitHor[0].split(':')[0]);
                    let closeHour = Number(splitHor[1].split(':')[0]);

                    if ((openHour <= hour) && (hour < closeHour)) {
                        hourOk = true;
                    } else if (hour === closeHour) {
                        let closeMin = Number(splitHor[1].split(':')[1]);
                        if (min < closeMin) {
                            hourOk = true;
                        }
                    }
                }
                if (dayOk && hourOk) {
                    isOpen.push(e);
                }
            }
        }
    }
    return isOpen;
}

function showResults(estaciones) {
    resultsSectionEl.innerHTML = '';

    if (!estaciones || estaciones.length === 0) {
        resultsSectionEl.textContent = 'No hay resultados para los filtros seleccionados.';
        return;
    }
    
    const table = document.createElement('table');
    table.classList.add('resultados-gasolineras');

    table.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Localidad</th>
                <th>Provincia</th>
                <th>Horario</th>
                <th>Precio</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    const tbody = table.querySelector('tbody');

    for (const e of estaciones) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${e.nombre}</td>
            <td>${e.direccion}</td>
            <td>${e.localidad}</td>
            <td>${e.provincia}</td>
            <td>${e.horario}</td>
            <td>${e.precio?.toFixed(3) ?? '-'}€</td>
        `;
        tbody.appendChild(row);
    }

    resultsSectionEl.appendChild(table);
}

