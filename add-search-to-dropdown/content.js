console.log('content.js >>> Dropdown Search Filter content script avviato');

function createSearchableDropdown() {
    console.log('content.js >>> Funzione createSearchableDropdown chiamata');
    
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

    if (targetDiv.querySelector('.custom-dropdown')) {
        console.log('content.js >>> Dropdown personalizzato già presente');
        return true;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'custom-dropdown';
    wrapper.style.position = 'relative';
    wrapper.style.width = '100%';

    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Cerca batch...';
    searchInput.style.width = '100%';
    searchInput.style.padding = '10px';
    searchInput.style.marginBottom = '5px';
    searchInput.style.border = '1px solid #ccc';
    searchInput.style.borderRadius = '4px';
    searchInput.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
    searchInput.style.boxSizing = 'border-box';

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

    let focusedOptionIndex = -1;

    function showAllOptions() {
        Array.from(optionsDiv.children).forEach(optionElement => {
            optionElement.style.display = '';
        });
        optionsDiv.style.display = 'block';
        focusedOptionIndex = -1;
    }

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
        focusedOptionIndex = -1;
    }

    Array.from(selectElement.options).forEach(option => {
        if (option.textContent == '-') {
            return;
        }

        const optionElement = document.createElement('div');
        optionElement.textContent = option.textContent;
        optionElement.style.padding = '10px';
        optionElement.style.cursor = 'pointer';
        optionElement.style.boxSizing = 'border-box';
        optionElement.style.borderBottom = '1px solid #f0f0f0';
        optionElement.addEventListener('mouseover', () => {
            optionElement.style.backgroundColor = '#f0f0f0';
        });
        optionElement.addEventListener('mouseout', () => {
            if (focusedOptionIndex !== Array.from(optionsDiv.children).indexOf(optionElement)) {
                optionElement.style.backgroundColor = 'white';
            }
        });
        optionElement.addEventListener('click', () => {
            searchInput.value = option.textContent;
            selectElement.value = option.value;
            optionsDiv.style.display = 'none';

            const event = new Event('change', { bubbles: true });
            selectElement.dispatchEvent(event);
        });
        optionsDiv.appendChild(optionElement);
    });

    function createRegexFromWildcard(str) {
        return new RegExp(str.split('*').map(term => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')).join('.*'), 'i');
    }

    searchInput.addEventListener('input', () => {
        // Impedisce l'inserimento di più asterischi consecutivi
        if (searchInput.value.includes('**')) {
            searchInput.value = searchInput.value.replace(/\*+/g, '*');
        }
        applyFilter();
    });

    searchInput.addEventListener('focus', () => {
        if (searchInput.value.trim() === '') {
            showAllOptions();
        } else {
            applyFilter();
        }
    });

    document.addEventListener('click', (e) => {
        if (!wrapper.contains(e.target)) {
            optionsDiv.style.display = 'none';
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        const options = Array.from(optionsDiv.children).filter(option => option.style.display !== 'none');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            focusedOptionIndex = (focusedOptionIndex + 1) % options.length;
            setFocusedOption();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            focusedOptionIndex = (focusedOptionIndex - 1 + options.length) % options.length;
            setFocusedOption();
        } else if (e.key === 'Enter' && focusedOptionIndex >= 0) {
            e.preventDefault();
            e.stopPropagation();
            options[focusedOptionIndex].click();
        }
    });

    function setFocusedOption() {
        const options = Array.from(optionsDiv.children).filter(option => option.style.display !== 'none');
        options.forEach((option, index) => {
            if (index === focusedOptionIndex) {
                option.style.backgroundColor = '#e9e9e9';
                option.scrollIntoView({ block: 'nearest' });
            } else {
                option.style.backgroundColor = 'white';
            }
        });
    }

    wrapper.appendChild(searchInput);
    wrapper.appendChild(optionsDiv);
    selectElement.style.display = 'none';
    selectElement.parentNode.insertBefore(wrapper, selectElement);

    console.log('content.js >>> Dropdown ricercabile creato');
    return true;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createSearchableDropdown);
} else {
    createSearchableDropdown();
}
