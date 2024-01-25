chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "scrollBack") {
    const lastClickedLink = message.link;
    const element = document.querySelector(`a[href="${lastClickedLink}"]`);
    if (element) {
      element.scrollIntoView();
      window.scrollBy(0, -200);
    } else {
      console.log('NAVIGATE_BROWSER_EXTENSION - Link non trovato:', lastClickedLink);
    }
  }
});

const links = document.querySelectorAll('a[href^="#"]');
links.forEach(link => {
  link.addEventListener('click', handleClick);
});

// Funzione per gestire il click sui link modificati
function handleClick(event) {
  event.preventDefault(); // Evita il comportamento predefinito del link
  const linkHref = event.target.href;
  
  const hashIndex = linkHref.indexOf('#'); // Trova l'indice del primo "#" nell'URL
  if (hashIndex !== -1) {
    const hashValue = linkHref.substring(hashIndex); // Estrai la parte dell'URL dopo l'hash
    chrome.storage.local.set({ 'lastClickedLink': hashValue }, function() {
      console.log('NAVIGATE_BROWSER_EXTENSION - Hash del link salvato:', hashValue);
    });
  } else {
    console.log('NAVIGATE_BROWSER_EXTENSION - Nessun hash trovato nell\'URL:', linkHref);
  }
}