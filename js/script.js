const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const fileListContainer = document.getElementById('file-list');

searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    
    const filteredFiles = fileList.filter(file => file.name.toLowerCase().includes(searchTerm));
    
    displayFileList(filteredFiles);
});

async function fetchFileList() {
    try {
        const response = await fetch('https://api.github.com/repos/tu-usuario/tu-repositorio/contents/archivos');
        const data = await response.json();
        
        return data.map(file => ({
            name: file.name,
            url: file.download_url
        }));
    } catch (error) {
        console.error('Error al obtener la lista de archivos:', error);
        return [];
    }
}

async function displayFileList(files) {
    fileListContainer.innerHTML = '';

    if (files.length === 0) {
        fileListContainer.innerHTML = '<p>No se encontraron resultados.</p>';
        return;
    }

    try {
        const githubFiles = await fetchFileList();

        files.forEach(file => {
            const githubFile = githubFiles.find(f => f.name === file.name);
            if (githubFile) {
                const listItem = document.createElement('li');
                listItem.innerHTML = `
                    <p>${file.name}</p>
                    <button class="copy-button" data-url="${githubFile.url}">Copiar Enlace</button>
                `;
                fileListContainer.appendChild(listItem);
            }
        });

        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', function () {
                const url = this.getAttribute('data-url');
                copyToClipboard(url);
                alert('Enlace copiado al portapapeles: ' + url);
            });
        });
    } catch (error) {
        console.error('Error al mostrar la lista de archivos:', error);
    }
}

function copyToClipboard(text) {
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    tempInput.value = text;
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
}

// Llamar a la función para mostrar la lista de archivos
displayFileList(fileList);
