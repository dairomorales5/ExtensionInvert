// Establecer el factor de inversión en 0 al instalar la extensión
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({factor: '0'});
});

// Función para disparar la inversión de colores
function invert() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      tabs.forEach(function (tab) {
          chrome.scripting.executeScript({
              target: {tabId: tab.id},
              files: ['invert.js']
          });
      });
  });
}

// Ejectuar el script invert.js al hacer click en el icono de la extensión
// No se abrirá popup
chrome.action.onClicked.addListener((tab) => {
  invert();
});

// Escuchar los comandos para realizar la inversión de colores
// Ver `commands` en el manifest.json
chrome.commands.onCommand.addListener(function (command) {
  switch (command) {
      case 'use-invert':
          invert();
          break;
      default:
          console.log(`Comando ${command} no encontrado.`);
  }
});