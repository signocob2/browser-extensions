chrome.commands.onCommand.addListener(function(command) {
  if (command === "navigateBack") {
    chrome.storage.local.get('lastClickedLink', function(data) {
      const lastClickedLink = data.lastClickedLink;
      if (lastClickedLink) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {action: "scrollBack", link: lastClickedLink});
        });
      } else {
        console.log('NAVIGATE_BROWSER_EXTENSION - Nessun link salvato precedentemente.');
      }
    });
  } else if (command === "navigateForward") {
    // Aggiungi qui la logica per navigare in avanti se necessario
  }
});
