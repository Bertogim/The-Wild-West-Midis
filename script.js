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
        const response = await fetch('https://raw.githack.com/Bertogim/The-Wild-West-Midis/main/midilist.txt');
        const data = await response.text();
        const midiFileNames = data
            .split('\n')
            .filter(file => file.trim().endsWith('.mid'));

        fileList = midiFileNames.map(name => ({
            name,
            url: `https://raw.githack.com/Bertogim/The-Wild-West-Midis/main/midis/${name}`
        }));

        // Mostrar todos los archivos al cargar la página
        displayFileList(fileList);
    } catch (error) {
        console.error('Error fetching MIDI files:', error);
    }
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
        button.addEventListener('click', function () {
            const url = this.getAttribute('data-url');
            copyToClipboard(url);
            
            // Cambiar el texto del botón a "Copiado!" por 1 segundo
            const originalButtonText = button.textContent;
            button.textContent = 'Copied!';
            setTimeout(() => {
                button.textContent = originalButtonText;
            }, 1000);
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
