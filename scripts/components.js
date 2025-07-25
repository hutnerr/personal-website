const BACKGROUND = 'background';
const HEADER = 'header';
const FOOTER = 'footer';

const BACKGROUND_PATH = '/components/background.html';
const HEADER_PATH = '/components/header.html';
const FOOTER_PATH = '/components/footer.html';

// loads certain components to reduce code duplication
// and make it easier to make changes in the future
async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const html = await response.text();
        document.getElementById(elementId).innerHTML = html;
    } catch (error) {
        console.error(`Error loading ${filePath}:`, error);
    }
}

async function loadAllComponents() {
    await loadComponent(BACKGROUND, BACKGROUND_PATH);
    await loadComponent(HEADER, HEADER_PATH);
    await loadComponent(FOOTER, FOOTER_PATH);
    document.body.classList.add('components-loaded');
}

document.addEventListener('DOMContentLoaded', loadAllComponents);