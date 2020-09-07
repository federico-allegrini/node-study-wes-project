import { $, $$ } from "./bling";

// Here Maps API
var platform = new H.service.Platform({
  apikey: "mXUWewgIdC6mbtzIMawy4yQVc7-ylBVJXXcvyqmJvv8",
});

export const service = platform.getSearchService();

// My functions for suggestions dropdown
export function setInputDropdown(input, callback) {
  input.on("input", () =>
    createSuggestionsDropdown(input, (lat, lng) => {
      callback(lat, lng);
    })
  );
}

function createSuggestionsDropdown(input, callback) {
  let suggestions = $("#suggestions");
  if (!suggestions) {
    suggestions = document.createElement("ul");
    suggestions.id = "suggestions";
    input.parentNode.insertBefore(suggestions, input.nextSibling);
  }
  const value = input.value.trim();
  if (value.trim() === "") {
    suggestions.innerHTML = "";
    return; // stop fn to running
  }
  service.autosuggest(
    {
      q: value,
      at: "0.0,0.0",
    },
    (result) => {
      console.log(result.items);
      suggestions.innerHTML = "";
      for (let i = 0; i < result.items.length; i++) {
        if (!result.items[i].address) continue;
        const label = result.items[i].address.label;
        const lat = result.items[i].position.lat;
        const lng = result.items[i].position.lng;
        const suggestion = document.createElement("li");
        suggestion.class = "suggestion";
        suggestion.innerText = label;
        suggestion.addEventListener("click", () => {
          input.value = label;
          callback(lat, lng);
        });
        suggestions.appendChild(suggestion);
      }
    },
    alert
  );
}
