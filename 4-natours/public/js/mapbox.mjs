/* eslint-disable */
export const displayMap = (locations) => {
  mapboxgl.accessToken = `pk.eyJ1IjoiaHlicmlkeCIsImEiOiJjbGh0MzZ1cGMwN2ZpM2hsOXMyZ2JtcWFxIn0.FJQnyiDEXplFgVRxjPuxlg`;

  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/hybridx/clht3m3dr005401pnf4tq0vd3',
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Add marker
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day} ${loc.description}</p>`);

    bounds.extend(loc.coordinates, {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100,
    });
  });
};
