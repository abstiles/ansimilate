'use strict';

import ansi_up from 'ansi_up';

const FILTERED_ROOT_ID = "ansi_up_filtered";

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.event == "iconClicked") {
      filterAnsi();
    }
  });

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

function toggleVisibility(element) {
  if (element.style.display === "none") {
    element.style.display = "block";
  } else {
    element.style.display = "none";
  }
}
