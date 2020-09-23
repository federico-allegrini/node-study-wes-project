import axios from "axios";
import { $ } from "./bling";
import { autocompleteCallback } from "./autocomplete";

const platform = new H.service.Platform({
  apikey: "mXUWewgIdC6mbtzIMawy4yQVc7-ylBVJXXcvyqmJvv8",
});
const defaultLayers = platform.createDefaultLayers();
const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 8,
  pixelRatio: window.devicePixelRatio || 1,
};

function loadPlaces(map, ui, lat = 43.2, lng = -79.8) {
  axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`).then((res) => {
    const places = res.data;
    if (!places.length) {
      alert("No places found!");
      return;
    }

    // Create a group for makers
    const group = new H.map.Group();
    map.addObject(group);

    // When someone clicks on a marker, show details of that place
    group.addEventListener(
      "tap",
      function (evt) {
        const bubble = new H.ui.InfoBubble(evt.target.getGeometry(), {
          content: evt.target.getData(),
        });
        ui.addBubble(bubble);
      },
      false
    );

    //Generate the makers
    const markers = places.map((place) => {
      const [lng, lat] = place.location.coordinates;
      const marker = new H.map.Marker({ lat, lng });
      console.log(place);
      const html = `
        <div class="popup">
        <a href="/store/${place.slug}">
            <img
                src="/uploads/${place.photo || "store.png"}"
                alt="${place.name}" />
            <p>
                <strong>${place.name}</strong><br>
                <span class="popup-address">${place.location.address}</span>
            </p>
        </a>
        </div>
      `;
      marker.setData(html);
      group.addObject(marker);
    });

    // Create a bounds
    map.getViewModel().setLookAtData({
      bounds: group.getBoundingBox(),
    });
  });
}

function makeMap(mapDiv) {
  if (!mapDiv) {
    return;
  }

  // Make our map
  var map = new H.Map(mapDiv, defaultLayers.vector.normal.map, mapOptions);
  window.addEventListener("resize", () => map.getViewPort().resize());
  var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
  var ui = H.ui.UI.createDefault(map, defaultLayers);

  // Load the markers on the map
  loadPlaces(map, ui);

  // Search
  const input = $('[name="geolocate"]');
  autocompleteCallback(input, (lat, lng) => {
    loadPlaces(map, ui, lat, lng);
  });
}

export default makeMap;
