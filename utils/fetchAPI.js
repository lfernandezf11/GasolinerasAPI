export async function fetchAPI(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) { throw new Error(`Error de red: ${response.statusText}`); }

        let data = await response.json();
        return data;
    } catch (error) {
        console.error('Error en la solicitud:', error.message);
    }
}