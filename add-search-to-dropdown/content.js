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
    optionsDiv.style.maxHeight = 'none';
    optionsDiv.style.overflowY = 'visible';
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

    // Funzione per applicare il filtro corrente
    function applyFilter() {
        const filter = searchInput.value;
        const regex = createRegexFromWildcard(filter);
        
        Array.from(optionsDiv.children).forEach(optionElement => {
            if (regex.test(optionElement.textContent)) {
                optionElement.style.display = '';
            } else {
                optionElement.style.display = 'none';
            }
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
            
            // Trigger change event on the original select element
            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);
        });
        optionsDiv.appendChild(optionElement);
    });

    // Funzione per creare una regex da una stringa con wildcard
    function createRegexFromWildcard(str) {
        return new RegExp(str.split('*').map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*'), 'i');
    }

    // Gestisci l'input di ricerca
    searchInput.addEventListener('input', applyFilter);

    // Gestisci il focus sull'input
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '') {
            showAllOptions();
        } else {
            applyFilter();
        }
    });

    // Nascondi le opzioni quando si clicca fuori
    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            optionsDiv.style.display = 'none';
        }
    });

    // Aggiungi gli elementi al wrapper
    wrapper.appendChild(searchInput);
    wrapper.appendChild(optionsDiv);

    // Nascondi il select originale invece di rimuoverlo
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