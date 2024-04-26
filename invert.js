function to_invert(i, j = 0) {
  return j === 0 ? `invert(${i})` : `brightness(${j}) invert(${i})`;
}

var SPECIALS = [{'website': 'overleaf.com',
                  'selector': '.pdf-viewer .pdfjs-viewer',
                  'feature': 'override'},
                  {'website': 'wikipedia.org',
                   'selector': '.mwe-math-element > img',
                   'feature': 'extend',
                   'filter': to_invert(0, 0.5)}
                ];

function invertir(factor) {
  // Cambiar el selector CSS en los casos especiales
  let selector = 'html';
  SPECIALS.filter((special) => special.feature === 'override').forEach((special) => {
    if (document.location.href.match(special.website)) {
      selector = special.selector;
    }
  });
  // Invierte los colores de la página
  // Se debe garantizar la existencia de un fondo
  document.querySelector(selector).style.background = 'white';
  document.querySelector(selector).style.filter = to_invert(factor);
  // Invierte los colores de las imágenes
  var imgs = document.getElementsByTagName("img");
  for (i = 0; i < imgs.length; i++) {
    imgs[i].style.filter = to_invert(factor, 0.5 * factor);
  }
  // Extender las características de la página en los casos especiales
  SPECIALS.filter((special) => special.feature === 'extend').forEach((special) => {
    if (document.location.href.match(special.website)) {
      document.querySelector(special.selector).style.filter = special.filter;
    }
  });
}

chrome.storage.sync.get('factor', ({factor}) => {
  invertir(factor);
  chrome.storage.sync.set({factor: (factor + 1) % 2});
});