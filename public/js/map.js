mapboxgl.accessToken = mapToken;

if (!coordinates || coordinates.length !== 2) {
    console.warn("No valid coordinates found for this listing");
} else {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        projection: 'globe',
        zoom: 9,
        center: coordinates
    });

    map.addControl(new mapboxgl.NavigationControl());
    map.scrollZoom.disable();

    map.on('style.load', () => {
        map.setFog({});
    });

    new mapboxgl.Marker({ color: 'red' })
        .setLngLat(coordinates)
        
        .addTo(map);
}
