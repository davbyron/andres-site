// vhToPx() and vwToPx() convert whole vh and vw units into pixels,
// respectively, when given information about the document/window
// height and width.

let clientHeight = document.documentElement.clientHeight;
let clientWidth = document.documentElement.clientWidth;
let scrollHeight = document.documentElement.scrollHeight;

const vhToPx = (amount) => {
  let pixelHeight = (amount * 0.01) * (scrollHeight - clientHeight);
  return pixelHeight;
}

const vwToPx = (amount) => {
  let pixelWidth = (amount * 0.01) * clientWidth;
  return pixelWidth;
}

export { vhToPx, vwToPx };
