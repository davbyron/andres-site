// getOffset() is a function that returns either the actual
// offset top or left values of the specified element by tracing
// the offset value of each parent element.

export const getOffset = (element, side) => {
  let offset = 0;
  while(element) {
    if (side == 'top') {
      offset += element.offsetTop;
    } else {
      offset += element.offsetLeft;
    }
    element = element.offsetParent;
  }
  return offset;
}
