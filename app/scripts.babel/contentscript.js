'use strict';

import ansi_up from 'ansi_up';

const FILTERED_ROOT_ID = "ansi_up_filtered";

chrome.runtime.onMessage.addListener(message => {
  if (message.event == "iconClicked") {
    filterAnsi();
  }
});

/** Perform the ANSI parsing operation. */
function filterAnsi() {
  var textElement = document.querySelector("body>pre");
  if (textElement === null) {
    return;
  }

  var filteredRoot = (document.getElementById(FILTERED_ROOT_ID)
      || createFilteredRoot(textElement.innerText));

  if (filteredRoot.style.display === "none") {
    filteredRoot.innerHTML = ansi_up.ansi_to_html(textElement.innerText);
  }
  toggleVisibility(textElement)
  toggleVisibility(filteredRoot);
}

/** Create the element to hold the parsed ANSI text. */
function createFilteredRoot(text) {
  var filteredRoot = document.createElement("pre");
  filteredRoot.id = FILTERED_ROOT_ID;
  filteredRoot.setAttribute(
    "style", "word-wrap: break-word; white-space: pre-wrap;");
  filteredRoot.style.display = "none";
  filteredRoot.innerHTML = ansi_up.ansi_to_html(text);
  document.body.appendChild(filteredRoot);
  return filteredRoot;
}

/** Toggle visibility on the tags containing the parsed/unparsed text. */
function toggleVisibility(element) {
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
