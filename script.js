const fileListContainer = document.getElementById('file-list');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');

async function fetchFileList() {
    try {
        const response = await fetch('https://api.github.com/repos/Bertogim/The-Wild-West-Midis/contents/archivos');
        const data = await response.json();
        
        return data.map(file => ({
            name: file.name,
            url: file.download_url
        }));
    } catch (error) {
        console.error('Error fetching file list:', error);
        return [];
    }
}

async function displayFiles(files) {
    fileListContainer.innerHTML = '';

    if (files.length === 0) {
        fileListContainer.innerHTML = '<p>No results found.</p>';
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
                    <button class="copy-button" data-url="${githubFile.url}">Copy Link</button>
                `;
                fileListContainer.appendChild(listItem);
            }
        });

        const copyButtons = document.querySelectorAll('.copy-button');
        copyButtons.forEach(button => {
            button.addEventListener('click', function () {
                const url = this.getAttribute('data-url');
                copyToClipboard(url);
                alert('Link copied to clipboard: ' + url);
            });
        });
    } catch (error) {
        console.error('Error displaying file list:', error);
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

// Search form submission handler
searchForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const searchTerm = searchInput.value.toLowerCase();
    
    fetchFileList().then(files => {
        const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchTerm));
        displayFiles(filteredFiles);
    });
});

// Call the function to display all files initially
fetchFileList().then(displayFiles);
