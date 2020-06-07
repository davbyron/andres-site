// createClickHandler() creates a click event on the specified
// element that scrolls to a specific location on the webpage.

import React from 'react';
import { Element, animateScroll, scroller } from 'react-scroll';

export function createClickHandler(element, name) {
  element.onclick = () => {
    scroller.scrollTo(name, {
      to: name,
      smooth: 'easeInQuad'
    });
  };
}
