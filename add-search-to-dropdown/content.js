console.log('content.js >>> Dropdown Search Filter content script avviato');

function createSearchableDropdown() {
    console.log('content.js >>> Funzione createSearchableDropdown chiamata');
    
    // Trova il div specifico con name="parameter" e input value="batchId"
    const parameterDivs = document.querySelectorAll('div[name="parameter"]');
    let targetDiv;
    
    for (const div of parameterDivs) {
        const input = div.querySelector('input[value="batchId"]');
        if (input) {
            targetDiv = div;
            break;
        }
    }
    
    if (!targetDiv) {
        console.log('content.js >>> Div target non trovato');
        return false;
    }
    
    console.log('content.js >>> Div target trovato');
    
    const selectElement = targetDiv.querySelector('select[name="value"]');
    if (!selectElement) {
        console.log('content.js >>> Select non trovato nel div target');
        return false;
    }
    
    console.log('content.js >>> Select trovato nel div target');

    // Verifica se il dropdown è già stato sostituito
    if (targetDiv.querySelector('.custom-dropdown')) {
        console.log('content.js >>> Dropdown personalizzato già presente');
        return true;
    }

    // Crea il wrapper per il dropdown personalizzato
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';

    // Crea l'input di ricerca
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Cerca batch...';
    searchInput.style.width = '100%';
    searchInput.style.padding = '5px';
    searchInput.style.marginBottom = '5px';

    // Crea il div per le opzioni
    const optionsDiv = document.createElement('div');
    optionsDiv.style.display = 'none';
    optionsDiv.style.position = 'absolute';
    optionsDiv.style.width = '100%';
    optionsDiv.style.maxHeight = '200px';
    optionsDiv.style.overflowY = 'auto';
    optionsDiv.style.border = '1px solid #ccc';
    optionsDiv.style.backgroundColor = 'white';
    optionsDiv.style.zIndex = '1000';

    // Funzione per mostrare tutte le opzioni
    function showAllOptions() {
        Array.from(optionsDiv.children).forEach(optionElement => {
            optionElement.style.display = '';
        });
        optionsDiv.style.display = 'block';
    }

    // Popola le opzioni
    Array.from(selectElement.options).forEach(option => {
        const optionElement = document.createElement('div');
        optionElement.textContent = option.textContent;
        optionElement.style.padding = '5px';
        optionElement.style.cursor = 'pointer';
        optionElement.addEventListener('click', () => {
            searchInput.value = option.textContent;
            selectElement.value = option.value;
            optionsDiv.style.display = 'none';
        });
        optionsDiv.appendChild(optionElement);
    });

    // Gestisci l'input di ricerca
    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        Array.from(optionsDiv.children).forEach(optionElement => {
            if (optionElement.textContent.toLowerCase().includes(filter)) {
                optionElement.style.display = '';
            } else {
                optionElement.style.display = 'none';
            }
        });
        optionsDiv.style.display = 'block';
    });

    // Mostra tutte le opzioni quando l'input riceve il focus
    searchInput.addEventListener('focus', showAllOptions);

    // Nascondi le opzioni quando si clicca fuori
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            optionsDiv.style.display = 'none';
        }
    });

    // Aggiungi gli elementi al wrapper
    wrapper.appendChild(searchInput);
    wrapper.appendChild(optionsDiv);

    // Sostituisci il select originale con il nuovo dropdown
    selectElement.style.display = 'none';
    selectElement.parentNode.insertBefore(wrapper, selectElement);

    console.log('content.js >>> Dropdown ricercabile creato');
    return true;
}

// Esegui la funzione quando il DOM è completamente caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSearchableDropdown);
} else {
    createSearchableDropdown();
}