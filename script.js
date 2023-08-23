const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const fileListContainer = document.getElementById('file-list');
let fileList = [];

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredFiles = fileList.filter(file => file.name.toLowerCase().includes(searchTerm));
    
    displayFileList(filteredFiles);
});

async function fetchMidiFiles() {
    try {
        const response = await fetch('https://api.github.com/repos/Bertogim/The-Wild-West-Midis/contents/midis');
        const data = await response.json();

        const midiFiles = data.filter(item => item.name.endsWith('.mid'));

        fileList = midiFiles.map(file => ({
            name: formatFileName(file.name),
            url: file.download_url
        }));

        // Mostrar todos los archivos al cargar la página
        displayFileList(fileList);
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
            <p>${file.name}</p>
            <button class="copy-button" data-url="${file.url}">Copy Midi Data</button>
        `;
        fileListContainer.appendChild(listItem);
    });

    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.addEventListener('click', async function () {
            const url = this.getAttribute('data-url');
            copyToClipboard(url);

            button.textContent = 'Copied!';
            await new Promise(resolve => setTimeout(resolve, 1000));
            button.textContent = 'Copy Midi Data';
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
fetchMidiFiles();
