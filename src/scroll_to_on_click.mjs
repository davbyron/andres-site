// createClickHandler() creates a click event on the specified
// element that scrolls to a specific location on the webpage.

function createClickHandler(element, down, over) {
  element.onclick = () => {
    document.documentElement.scroll({
      top: down,
      left: over,
      behavior: 'smooth'
    });
  };
}

export { createClickHandler };
