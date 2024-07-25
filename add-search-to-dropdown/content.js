console.log('content.js >>> Dropdown Search Filter content script avviato');

function addSearchToDropdown() {
    console.log('content.js >>> Funzione addSearchToDropdown chiamata');
    
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

    // Verifica se l'input di ricerca esiste già
    if (targetDiv.querySelector('input[id="searchBatch"]')) {
        console.log('content.js >>> Campo di ricerca già presente');
        return true;
    }

    // Crea l'input di ricerca
    const searchInput = document.createElement('input');
    searchInput.setAttribute('id', 'searchBatch')
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Cerca batch...');
    searchInput.style.marginBottom = '10px';
    searchInput.style.width = '100%';
    searchInput.style.padding = '5px';
    targetDiv.insertBefore(searchInput, selectElement);

    // Funzione per filtrare le opzioni del dropdown
    searchInput.addEventListener('input', function() {
        const filter = this.value.toLowerCase();
        // console.log('content.js >>> Filtrando con:', filter);
        
        Array.from(selectElement.options).forEach(option => {
            const txtValue = option.textContent || option.innerText;
            if (txtValue.toLowerCase().indexOf(filter) > -1) {
                option.style.display = "";
            } else {
                option.style.display = "none";
            }
        });
        
        // Se nessuna opzione corrisponde, mostra un messaggio
        const visibleOptions = Array.from(selectElement.options).filter(opt => opt.style.display !== 'none');
        if (visibleOptions.length === 0) {
            let noResultOption = selectElement.querySelector('.no-result');
            if (!noResultOption) {
                noResultOption = document.createElement('option');
                noResultOption.classList.add('no-result');
                noResultOption.disabled = true;
                selectElement.appendChild(noResultOption);
            }
            noResultOption.textContent = 'Nessun risultato trovato';
            noResultOption.style.display = '';
        } else {
            const noResultOption = selectElement.querySelector('.no-result');
            if (noResultOption) {
                noResultOption.style.display = 'none';
            }
        }
    });

    console.log('content.js >>> Search input aggiunto al div target');
    return true;
}

// Esegui la funzione quando il DOM è completamente caricato
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addSearchToDropdown);
} else {
    addSearchToDropdown();
}