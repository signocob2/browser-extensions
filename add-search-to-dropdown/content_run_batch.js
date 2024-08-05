console.log("content_run_batch.js");

let optionsDivBatchId;
let selectElementBatchId;
let searchInputBatchId;

let optionsDivFolder;
let selectElementFolder;
let searchInputFolder;

let inputScript;
let inputArguments;
let selectServer;

const focusedOptionIndexex = {
    batchId: -1,
    folder: -1
}

function createSearchableDropdowns() {
    // RECUPERA L'ELEMENTO inputScript
    document.querySelectorAll('div[name="parameter"]').forEach(div => {
        // Verifica se il <div> contiene un <input> con value="script"
        if (div.querySelector('input[name="name"][value="script"]')) {
          // Trova e stampa l'input di tipo text all'interno di questo <div>
          inputScript = div.querySelector('input[name="value"][type="text"]');
        }
    });

    // RECUPERA L'ELEMENTO inputArguments
    document.querySelectorAll('div[name="parameter"]').forEach(div => {
        // Verifica se il <div> contiene un <input> con value="arguments"
        if (div.querySelector('input[name="name"][value="arguments"]')) {
          // Trova e stampa l'input di tipo text all'interno di questo <div>
          inputArguments = div.querySelector('input[name="value"][type="text"]');
        }
    });

    // RECUPERA L'ELEMENTO selectServer
    document.querySelectorAll('div[name="parameter"]').forEach(div => {
        // Verifica se il <div> contiene un <input> con value="server"
        if (div.querySelector('input[name="name"][value="server"]')) {
          // Trova e stampa l'input di tipo text all'interno di questo <div>
          selectServer = div.querySelector('select[name="value"]');
        }
    });

    const parameterDivs = document.querySelectorAll('div[name="parameter"]');
    const targetDivs = {
        batchId: null,
        folder: null
    };
    
    for (const div of parameterDivs) {
        const input = div.querySelector('input[value="batchId"], input[value="folder"]');
        if (input) {
            targetDivs[input.value] = div;
        }
        if (targetDivs.batchId && targetDivs.folder) break;
    }
    
    if (!targetDivs.batchId || !targetDivs.folder) {
        console.log('content.js >>> Uno o più div target non trovati');
        return false;
    }
    
    for (const [key, div] of Object.entries(targetDivs)) {
        createSearchableDropdown(div, key);
    }
    
    return true;
}

function createSearchableDropdown(targetDiv, type) {
    const selectElement = targetDiv.querySelector('select[name="value"]');
    if (!selectElement) {
        console.log(`content.js >>> Select non trovato nel div target per ${type}`);
        return;
    }
    
    if (targetDiv.querySelector('.custom-dropdown')) {
        console.log(`content.js >>> Dropdown personalizzato già presente per ${type}`);
        return;
    }
    
    const wrapper = createDropdownWrapper();
    const searchInput = createSearchInput(type);
    const optionsDiv = createOptionsDiv();
    
    if (searchInput.id == 'batchId') {
        optionsDivBatchId = optionsDiv;
        selectElementBatchId = selectElement;
        searchInputBatchId = searchInput;
    } else if (searchInput.id == 'folder') {
        optionsDivFolder = optionsDiv;
        selectElementFolder = selectElement;
        searchInputFolder = searchInput;
    }

    populateOptionsDiv(optionsDiv, selectElement, searchInput);
    
    wrapper.appendChild(searchInput);
    wrapper.appendChild(optionsDiv);
    selectElement.style.display = 'none';
    selectElement.parentNode.insertBefore(wrapper, selectElement);
    
    setupEventListeners(searchInput, optionsDiv, selectElement, type);
    
    console.log(`content.js >>> Dropdown ricercabile creato per ${type}`);
}

function createDropdownWrapper() {
    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';
    return wrapper;
}

function createSearchInput(type) {
    const searchInput = document.createElement('input');
    searchInput.id = type;
    searchInput.type = 'text';
    searchInput.placeholder = `Cerca ${type}...`;
    searchInput.style.width = '100%';
    searchInput.style.padding = '10px';
    searchInput.style.marginBottom = '5px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '4px';
    searchInput.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    searchInput.style.boxSizing = 'border-box';
    return searchInput;
}

function createOptionsDiv() {
    const optionsDiv = document.createElement('div');
    optionsDiv.style.display = 'none';
    optionsDiv.style.position = 'absolute';
    optionsDiv.style.width = '100%';
    optionsDiv.style.maxHeight = '300px';
    optionsDiv.style.overflowY = 'auto';
    optionsDiv.style.border = '1px solid #ccc';
    optionsDiv.style.backgroundColor = 'white';
    optionsDiv.style.zIndex = '1000';
    optionsDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    optionsDiv.style.borderRadius = '4px';
    optionsDiv.style.boxSizing = 'border-box';
    return optionsDiv;
}

function populateOptionsDiv(optionsDiv, selectElement, searchInput) {
    // Ripulisci il div delle opzioni prima di popolarlo
    optionsDiv.innerHTML = '';
    
    Array.from(selectElement.options).forEach(option => {
        if (option.textContent == '-') return;

        const optionElement = document.createElement('div');
        optionElement.textContent = option.textContent;
        optionElement.style.padding = '10px';
        optionElement.style.cursor = 'pointer';
        optionElement.style.boxSizing = 'border-box';
        optionElement.style.borderBottom = '1px solid #f0f0f0';
        
        optionElement.addEventListener('mouseover', () => optionElement.style.backgroundColor = '#f0f0f0');
        optionElement.addEventListener('mouseout', () => optionElement.style.backgroundColor = 'white');
        
        optionElement.addEventListener('click', () => {
            searchInput.value = option.textContent;
            selectElement.value = option.value;
            optionsDiv.style.display = 'none';
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));
            if (searchInput.id == 'batchId') {
                if (searchInput.value.includes("scrambling")) {
                    selectServer.value = "as-springtest05";
                } else {
                    selectServer.value = "as-springtest02";
                }
            }
            if (searchInput.id == 'batchId') {
                inputScript.value = selectElementBatchId.value.replace(/^batch-/, "") + "_";
            }
            if (searchInput.id == 'folder') {
                inputArguments.value = searchInput.value;
            }
        });
        
        optionsDiv.appendChild(optionElement);
    });
}

function setupEventListeners(searchInput, optionsDiv, selectElement, type) {
    searchInput.addEventListener('input', () => {
        if (searchInput.value.includes('**')) {
            searchInput.value = searchInput.value.replace(/\*+/g, '*');
        }
        if (searchInput.value.includes(' ')) {
            searchInput.value = searchInput.value.replace(/ /g, '');
        }
        applyFilter(searchInput, optionsDiv);
    });

    searchInput.addEventListener('focus', () => {
        focusedOptionIndexex[searchInput.id] = -1;
        setFocusedOption(Array.from(optionsDiv.children).filter(optionElement => optionElement.style.display !== 'none'), focusedOptionIndexex[searchInput.id]);
        showAllOptions(optionsDiv);
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.parentNode.contains(e.target)) {
            optionsDiv.style.display = 'none';
        }
    });

    searchInput.addEventListener('keydown', (e) => handleKeyDown(e, optionsDiv, searchInput, selectElement, type));
}

function showAllOptions(optionsDiv) {
    Array.from(optionsDiv.children).forEach(optionElement => {
        optionElement.style.display = '';
    });
    optionsDiv.style.display = 'block';
}

function applyFilter(searchInput, optionsDiv) {
    const filter = searchInput.value;
    const regex = createRegexFromWildcard(filter);

    Array.from(optionsDiv.children).forEach(optionElement => {
        optionElement.style.display = regex.test(optionElement.textContent) ? '' : 'none';
    });
    optionsDiv.style.display = 'block';
}

function createRegexFromWildcard(str) {
    return new RegExp(str.split('*').map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*'), 'i');
}

function handleKeyDown(e, optionsDiv, searchInput, selectElement, type) {
    const options = Array.from(optionsDiv.children).filter(option => option.style.display !== 'none');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        focusedOptionIndexex[searchInput.id] = ((focusedOptionIndexex[searchInput.id] + 1) % options.length);
        setFocusedOption(options, focusedOptionIndexex[searchInput.id]);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        focusedOptionIndexex[searchInput.id] = ((focusedOptionIndexex[searchInput.id] - 1) % options.length);
        if (focusedOptionIndexex[searchInput.id] < 0) {
            focusedOptionIndexex[searchInput.id] = options.length - 1;
        }
        setFocusedOption(options, focusedOptionIndexex[searchInput.id]);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        e.stopPropagation();
        if (focusedOptionIndexex[searchInput.id] >= 0) {
            options[focusedOptionIndexex[searchInput.id]].click();
        }
        
        requestAnimationFrame(() => {
            const nextType = e.shiftKey ? getPreviousType(type) : getNextType(type);
            let nextSelect = document.querySelector(`input[id="${nextType}"]`);
            if (!nextSelect) {
                nextSelect = e.shiftKey ? selectServer : inputScript;
            }
            if (nextSelect) {
                if (focusedOptionIndexex[searchInput.id] < 0) {
                    optionsDivBatchId.style.display = 'none';
                    optionsDivFolder.style.display = 'none';
                }

                nextSelect.focus();
                nextSelect.dispatchEvent(new MouseEvent('mousedown'));
            } else {
                console.log(`Select ${e.shiftKey ? 'precedente' : 'successivo'} non trovato per ${type}`);
            }
        });
    } else if (e.key === 'Escape') {
        optionsDivBatchId.style.display = 'none';
        optionsDivFolder.style.display = 'none';
    }
}

function getNextType(currentType) {
    const types = ['batchId', 'folder', 'script'];
    const currentIndex = types.indexOf(currentType);
    return types[(currentIndex + 1) % types.length];
}

function getPreviousType(currentType) {
    const types = ['batchId', 'folder', 'script'];
    const currentIndex = types.indexOf(currentType);
    return types[(currentIndex - 1 + types.length) % types.length];
}

function setFocusedOption(options, focusedOptionIndex) {
    options.forEach((option, index) => {
        option.style.backgroundColor = index === focusedOptionIndex ? '#e9e9e9' : 'white';
        if (index === focusedOptionIndex) {
            option.scrollIntoView({ block: 'nearest' });
        }
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSearchableDropdowns);
} else {
    createSearchableDropdowns();
}