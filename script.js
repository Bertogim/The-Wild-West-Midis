const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const fileListContainer = document.getElementById('file-list');
const urlParams = new URLSearchParams(window.location.search);

// Obtener el término de búsqueda de los parámetros de la URL
const searchTermFromURL = urlParams.get('search');
if (searchTermFromURL) {
    searchInput.value = searchTermFromURL;
}

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    
    // Agregar un retraso de 1 segundo antes de realizar la búsqueda
    setTimeout(() => {
        fetchMidiFiles(searchTerm);

        // Actualizar la URL con el parámetro de búsqueda
        urlParams.set('search', searchTerm);
        history.pushState(null, '', `?search=${encodeURIComponent(searchTerm)}`);
    }, 1000);
});

async function fetchMidiFiles(searchTerm = '') {
    try {
        const response = await fetch('https://api.github.com/repos/Bertogim/The-Wild-West-Midis/contents/midis');
        const data = await response.json();

        const midiFiles = data.filter(item => item.name.endsWith('.mid'));

        // Filtrar por término de búsqueda si se proporciona
        if (searchTerm) {
            const filteredFiles = midiFiles.filter(file => file.name.toLowerCase().includes(searchTerm));
            displayFileList(filteredFiles);
        } else {
            displayFileList(midiFiles);
        }
    } catch (error) {
        console.error('Error fetching MIDI files:', error);
    }
}

function formatFileName(name) {
    // Reemplazar "_" y "-" por " " (espacio)
    const formattedName = name.replace(/_/g, ' ').replace(/-/g, ' ');

    // Eliminar espacios duplicados causados por el reemplazo anterior
    return formattedName.replace(/\s+/g, ' ');
}

function displayFileList(files) {
    fileListContainer.innerHTML = '';

    if (files.length === 0) {
        fileListContainer.innerHTML = '<p>No results found.</p>';
        return;
    }

    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <p>${formatFileName(file.name)}</p>
            <button class="copy-button" data-url="${file.download_url}">Copy Midi Data</button>
        `;
        fileListContainer.appendChild(listItem);
    });

    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const url = this.getAttribute('data-url');
            copyToClipboard(url);

            button.textContent = 'Copied!';
            await new Promise(resolve => setTimeout(() => {
                button.textContent = 'Copy Midi Data';
            }, 1000));
        });
    });
}

function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

// Llamar a la función para obtener y mostrar la lista de archivos MIDI
const searchTerm = urlParams.get('search');
fetchMidiFiles(searchTerm);
