let clickedLinks = [];

chrome.commands.onCommand.addListener(function (command) {
  console.log('NAVIGATE_BROWSER_EXTENSION - background.js - addListener');
  if (command === "navigateBack") {
    console.log('NAVIGATE_BROWSER_EXTENSION - background.js - navigateBack');
    if (clickedLinks.length > 0) {
      const lastClickedLink = clickedLinks.pop();
      chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id,
            {action: "scrollBack", link: lastClickedLink});
      });
    } else {
      console.log(
          'NAVIGATE_BROWSER_EXTENSION - Nessun link cliccato precedentemente.');
    }
  } else if (command === "navigateForward") {
    // Aggiungi qui la logica per navigare in avanti se necessario
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "linkClicked") {
    const clickedLink = message.link;
    clickedLinks.push(clickedLink);
    if (clickedLinks.length > 10) { // Limita il numero di link memorizzati
      clickedLinks.shift();
    }
  }
});
