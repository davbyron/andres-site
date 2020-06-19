// styleTuples is a list of tuples.

// styleTuples should be formatted with the max width (in px) as
// the first element and the desired property value at that
// width as the second element.
// Ex: adjustStyle('paddingTop', document.getElementById('copyright'), (1260, '600vh'))

export function adjustProperty(property, element, styleTuples) {
  for (let i = 0; i < styleTuples.length; i++) {
    if (window.innerWidth < styleTuples[i][0]) {
      element.style.property = styleTuples[i][1];
    }
  }
}
