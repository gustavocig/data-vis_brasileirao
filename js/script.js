function create_map(html_tag, lat, long, magnification) {
	let map = L.map(html_tag).setView([lat, long], magnification);
            L.tileLayer("https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
            { attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>',
            maxZoom: 18}).addTo(map);
}