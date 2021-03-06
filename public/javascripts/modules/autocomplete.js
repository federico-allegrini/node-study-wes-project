import { setInputDropdown } from "./maps";

function autocomplete(input, latInput, lngInput) {
  if (!input) return; // Skip this fn from running if there is not input on the page
  setInputDropdown(input, (lat, lng) => {
    latInput.value = lat;
    lngInput.value = lng;
  });
}

exports.autocompleteCallback = function (input, callback) {
  if (!input) return;
  setInputDropdown(input, (lat, lng) => {
    callback(lat, lng);
  });
};

export default autocomplete;
