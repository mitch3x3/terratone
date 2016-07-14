function toggleSidenav() {
  document.body.classList.toggle('sidenav-active');
}

var LeafIcon = L.Icon.extend({
    options: {
        shadowUrl: 'leaf-shadow.png',
        iconSize:     [38, 95],
        shadowSize:   [50, 64],
        iconAnchor:   [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor:  [-3, -76]
    }
});

//var icon_size = [30, 30];
var icon_diameter = 20;
var cssIcon = L.divIcon({
  // Specify a class name we can refer to in CSS.
  className: 'css-icon',
  // Set marker width and height
  iconSize: [icon_diameter, icon_diameter]
});

var map = L.map('map', { zoomControl: false });
map.setView([37.7552,-122.4431], 13);
map.options.minZoom = 12;
map.options.maxZoom = 16;
L.control.zoom({ position:'topright' }).addTo(map);

L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',{
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

var mainStyle = {
    fillColor: '#5CC9ED',
    weight: 2,
    opacity: 0.0,
    color: 'white',
    fillOpacity: 0.0
};

var hoverStyle = {
    fillColor: '#5CC9ED',
    weight: 4,
    opacity: 0.4,
    color: 'white',
    fillOpacity: 0.5
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({className: 'hs'});
    //$(".hoverStyle").animate({ opacity: 0 }, 1000, function() {});
    //layer.setStyle(hoverStyle);

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    var layer = e.target;

    //layer.setStyle(mainStyle);
    layer.setStyle({className: 'hs'});
    //$(".hoverStyle").animate({ opacity: 1 }, 1000, function() {});
    //geojson.resetStyle(layer);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

var neighborhood_geojson = L.geoJson(neighborhoodsData, {
    style: {className: 'hs'},
    onEachFeature: onEachFeature
});
neighborhood_geojson.addTo(map);


function raycast(point, polygon) {
    // Credit: https://github.com/substack/point-in-polygon/blob/master/index.js
    // Ray Casting Algorithm
    // Returns true if point is inside polygon
    // Assumes:
    // 1. point has format [lat, long]
    // 2. polygon has format [[long, lat], ...] (due to geojson format)

    let x = point[0], y = point[1];

    let point_inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][1], yi = polygon[i][0];
        let xj = polygon[j][1], yj = polygon[j][0];

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            point_inside = !point_inside;
        }
    }
    return point_inside;
};

// Tests raycasting algorithm for each recording in "recordings"
for (let i = 0; i < recordings.length; i++) {
    for (let j = 0; j < neighborhoodsData.features.length; j++) {
        let raycast_bool = raycast([recordings[i][1], recordings[i][2]], neighborhoodsData.features[j].geometry.coordinates[0][0]);
        if (raycast_bool) {
            console.log(neighborhoodsData.features[j].properties.name);
        }
    }
}

// var info = L.control();
//
// info.onAdd = function (map) {
//     this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
//     this.update();
//     return this._div;
// };
//
// // method that we will use to update the control based on feature properties passed
// info.update = function (props) {
//     console.log(neighborhood_geojson);
//     this._div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
//         '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
//         : 'Hover over a state');
// };
//
// info.addTo(map);

map.on('zoomend', function() {
    var currentZoom = map.getZoom();
    icon_diameter = currentZoom * 2;
});

//var audio = document.getElementsByTagName("audio")[0];
// var audio = $("audio");
// var marker1 = L.marker([37.7620,-122.4431],{icon: cssIcon}).bindPopup('Popup test').addTo(map);
// marker1.on('mouseover', function (e) {
//     audio[0].volume = 0;
//     audio[0].play();
//     var animate = audio.animate({volume: 1}, 2000);
//     //audio.animate({volume: 1}, 2000);
//
//     console.log(animate);
//     //marker1.openPopup();
//     //$.audio.animate({volume: 0.8}, 100);
//     //audioVolumeIn(audio.play());
//     //audio.play();
//     //$(audio).fadeIn('fast');
// });
// marker1.on('mouseout', function (e) {
//     //marker1.closePopup();
//     //audio[0].currentTime = 0;
//     audio.animate({volume: 0}, 2000);
//     setTimeout(function(){
//         audio[0].pause();
//         audio[0].volume = 0;
//     }, 2000);
// });

/*
for (var i = 0; i < recordings.length; i++) {
    marker = new L.marker([recordings[i][1],recordings[i][2]],{icon: cssIcon})
        .bindPopup(recordings[i][3])
        .addTo(map);

    //var audio = document.getElementsByTagName("audio")[0];
    var audio = $("audio");
    //var marker1 = L.marker([37.7620,-122.4431],{icon: cssIcon}).bindPopup('Popup test').addTo(map);
    marker.on('mouseover', function (e) {
        audio[0].volume = 0;
        audio[0].play();
        var animate = audio.animate({volume: 1}, 2000);
        //audio.animate({volume: 1}, 2000);

        console.log(animate);
        //marker1.openPopup();
        //$.audio.animate({volume: 0.8}, 100);
        //audioVolumeIn(audio.play());
        //audio.play();
        //$(audio).fadeIn('fast');
    });
    marker.on('mouseout', function (e) {
        //marker1.closePopup();
        //audio[0].currentTime = 0;
        audio.animate({volume: 0}, 2000);
        setTimeout(function(){
            audio[0].pause();
            audio[0].volume = 0;
        }, 2000);
    });
}
*/

$('css-icon').click(function() {
    // Add the audio + source elements to the page.
    audio.appendTo('body');
    $(audio).fadeOut('slow');
    return false;
});

//for (var i = 0; i < planes.length; i++) {
//	marker = new L.marker([planes[i][1],planes[i][2]])
//		.bindPopup(planes[i][0])
//		.addTo(map);
//}
