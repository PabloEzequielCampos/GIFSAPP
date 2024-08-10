// variables

const inputTermino = document.querySelector('#termino');
const resultadosDiv = document.querySelector('#resultados');
const spinner = document.querySelector('#spinner');
const ulHistorial = document.querySelector('#historial');
const apikey = 'AL2LJB4m4LJ2ukdzXdT6MCfMbmrrm4Fg';
const urlBase = 'https://api.giphy.com/v1/gifs/search';


let listadoGifs = [];
let terminos = [];

// eventos
eventos();


function eventos() {
    inputTermino.addEventListener('keypress', obtenerDato)
    ulHistorial.addEventListener('click', eliminarTermino)
    ulHistorial.addEventListener('click', buscarPorHistorial)
    document.addEventListener('DOMContentLoaded', () => {
        terminos = JSON.parse(localStorage.getItem('historial')) || [];

        if (terminos.length > 0) {
            generarHtmlTermino();
        }
    })

}





//funciones

function obtenerDato(e) {

    if (e.key === 'Enter') {
        e.preventDefault();
        const termino = e.target.value
        if (termino.trim() === '') {
            console.log(); ('No hay resultados');
            Swal.fire({
                icon: "error",
                title: "Hubo un error",
                text: "El termino no puede ir vacio",
            })
        } else if (termino.length > 20) {
            Swal.fire({
                icon: "error",
                title: "Hubo un error",
                text: "El termino debe ser menor a 20 caracteres",
            });
        } else {
            obtenerDatosApi(termino);

            const nuevoTermino = {
                texto: termino,
                id: generarId()
            };
            terminos = [...terminos, nuevoTermino];
            generarHtmlTermino();
        }


    }


}


async function obtenerDatosApi(termino) {
    const endpoint = `${urlBase}?api_key=${apikey}&q=${termino}&limit=8`
    spinner.classList.remove('hidden');


    try {
        const respuesta = await fetch(endpoint);

        if (respuesta.ok) {

            const datos = await respuesta.json();
            spinner.classList.add('hidden')
            listadoGifs = [...datos.data];

            if (listadoGifs.length > 0) {
                generarHtmlGifs();

            } else {

                //generar html de error.
            }


        }
    } catch (error) {
        console.log(error);
    }
}

function generarHtmlGifs() {

    limpiarHTML(resultadosDiv);

    listadoGifs.map(gif => {
        const { title, images: { downsized: { url } } } = gif;
        const div = document.createElement('div');
        div.classList.add('max-w-sm', 'rounded', 'overflow-hidden', 'shadow-lg', 'bg-gray-900');

        div.innerHTML = `
                <img class="w-full" src=${url} alt="imagen gif">
                <div class="px-6 py-4">
                    <div class=" text-white font-bold text-xl mb-2">${title}</div>
                </div>
        `;
        resultadosDiv.appendChild(div);
    })

}


/* function limpiarHtmlResultados() {
    while (resultadosDiv.firstChild) {
        resultadosDiv.removeChild(resultadosDiv.firstChild);
    }
}
function limpiarHtmlTerminos() {
    while (ulHistorial.firstChild) {
        ulHistorial.removeChild(ulHistorial.firstChild);
    }
} */
function limpiarHTML(elemento){
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function generarHtmlTermino() {
    limpiarHTML(ulHistorial);

    terminos.map(termino => {
        const { texto, id } = termino
        const li = document.createElement('li');
        //border-2 border-gray-200 flex rounded-lg px-3 py-2
        li.classList.add('border-2', 'border-gray-200', 'flex', 'rounded-lg', 'px-3', 'py-2', 'mt-4', 'flex-wrap');
        li.innerHTML = `
        <p class=" buscar grow text-white font-bold cursor-pointer">${texto}</p>
                <a data-id="${id}" class=" borrar text-red-500 font-bold cursor-pointer ">X</a>
        `;
        ulHistorial.appendChild(li);
    });
    guardarLs();
}

function generarId() {
    const id = Date.now();
    return id;
}

function eliminarTermino(e) {


    if (e.target.classList.contains('borrar')) {
        const terminoId = e.target.getAttribute('data-id');
        terminos = terminos.filter(termino => termino.id !== Number(terminoId));
        generarHtmlTermino();

    }

}

function buscarPorHistorial(e) {
    if (e.target.classList.contains('buscar')) {
        const termino = e.target.innerText;
        obtenerDatosApi(termino);
    }
}

function guardarLs() {
    localStorage.setItem('historial', JSON.stringify(terminos));
}