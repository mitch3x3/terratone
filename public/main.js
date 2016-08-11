var audioFiles = [];

for (var i = 0; i < recordings.length; i++) {
    var file_path = "mp3/" + recordings[i][4].substring(0, 14) + ".mp3";
    //var audio = new Audio('test.mp3');
    audioFiles.push(file_path);
}

// Preload audio files
for (var i in audioFiles) {
    preloadAudio(audioFiles[i]);
}

function preloadAudio(url) {
    var audio = new Audio();
    // once this file loads, it will call loadedAudio()
    // the file will be kept by the browser as cache
    audio.addEventListener('canplaythrough', loadedAudio, false);
    audio.src = url;
    audio.preload = "automatic";
}

var loaded = 0;
function loadedAudio() {
    // this will be called every time an audio file is loaded
    // we keep track of the loaded files vs the requested files
    loaded++;
}

function onReady(callback) {
    var intervalID = window.setInterval(checkReady, 1000);
    function checkReady() {
        // console.log("all files loaded");
        var test_time = 0;
        if (loaded == audioFiles.length) {
            window.clearInterval(intervalID);
            setTimeout(function(){
                callback.call(this);
            }, test_time);
        }
        else {
            setTimeout(function(){
                window.clearInterval(intervalID);
                callback.call(this);
            }, 5000);
        }
        // if (document.getElementsByTagName('body')[0] !== undefined) {
        //     window.clearInterval(intervalID);
        //     callback.call(this);
        // }
    }
}

function show(id, value) {
    //document.getElementById(id).style.display = value ? 'block' : 'none';
    //document.getElementById(id).style.opacity = value ? '1' : '0';
    document.getElementById('loading').style.opacity = value ? '1' : '0';
    setTimeout(function(){
        document.getElementById('page').style.opacity = value ? '0' : '1';
    }, 1000);
}

onReady(function () {
    show('page', true);
    show('loading', false);
});

function toggleSidenav() {
  document.body.classList.toggle('sidenav-active');
}

var icon_diameter = 20;
var cssIcon = L.divIcon({
  // Specify a class name we can refer to in CSS.
  className: 'css-icon',
  // Set marker width and height
  iconSize: [icon_diameter, icon_diameter]
});

var map = L.map('map', { zoomControl: false });
map.setView([37.7600,-122.4431], 13);
map.options.minZoom = 12;
map.options.maxZoom = 16;
L.control.zoom({ position:'topright' }).addTo(map);

//var info = L.control();
var info = L.control.zoom({ position:'bottomleft' });

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    // this._div.innerHTML = '<h4>Neighborhood</h4>' + (props ?
    //     props.name
    //     : 'Hover over a district');
    this._div.innerHTML = (props ? props.name : '');
};

info.addTo(map);

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

var audio = new Audio();

function highlightFeature(e) {
    var layer = e.target;

    //layer.setStyle({className: 'hs'});
    //$(".hoverStyle").animate({ opacity: 0 }, 1000, function() {});
    //layer.setStyle(hoverStyle);
    //console.log(layer.feature.properties.name);

    for (var i = 0; i < recordings.length; i++) {
        if (layer.feature.properties.name == recordings[i][3]) {
            var file_path = "mp3/" + recordings[i][4].substring(0, 14) + ".mp3";
            //var audio = new Audio('test.mp3');
            // console.log(file_path);
            audio = new Audio(file_path);
            audio.play();
        }
    }
    info.update(layer.feature.properties);
    $(".info").animate({ opacity: 0.9 }, 500, function() {});

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function resetHighlight(e) {
    var layer = e.target;
    audio.pause();
    audio.currentTime = 0;

    info.update();
    $(".info").animate(0, function() {
        $(".info").css('opacity',0.0);
    });
    //layer.setStyle(mainStyle);
    //layer.setStyle({className: 'hs'});
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

function binarySearch(itemList, item) {
	minIndex = 0;
	maxIndex = itemList.length - 1;
	itemFound = false;

	while (minIndex <= maxIndex && !itemFound) {
		midpoint = (minIndex + maxIndex) / 2 | 0;
		if (itemList[midpoint] == item) {
			itemFound = true;
		}
		else {
			if (item < itemList[midpoint]) {
				maxIndex = midpoint - 1;
			}
			else {
				minIndex = midpoint + 1;
			}
		}
	}
	return itemFound;
}

function raycast(point, polygon) {
    // Credit: https://github.com/substack/point-in-polygon/blob/master/index.js
    // Ray Casting Algorithm
    // Returns true if point is inside polygon
    // Assumes:
    // 1. point has format [lat, long]
    // 2. polygon has format [[long, lat], ...] (due to geojson format)

    var x = point[0], y = point[1];

    var point_inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][1], yi = polygon[i][0];
        var xj = polygon[j][1], yj = polygon[j][0];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) {
            point_inside = !point_inside;
        }
    }
    return point_inside;
};

// MATCHING RECORDING TO HIGHLIGHTED POLYGON

// var raycast_bool = raycast([recordings[0][1], recordings[0][2]], neighborhoodsData.features[0].geometry.coordinates[0][0]);
// console.log(raycast_bool);
// console.log(recordings[0][4]);

// Tests raycasting algorithm for each recording in "recordings"
function raycast_test() {
    for (var i = 0; i < recordings.length; i++) {
        for (var j = 0; j < neighborhoodsData.features.length; j++) {
            var raycast_bool = raycast([recordings[i][1], recordings[i][2]], neighborhoodsData.features[j].geometry.coordinates[0][0]);
            if (raycast_bool) {
                console.log(neighborhoodsData.features[j].properties.name);
                //info.update(neighborhoodsData.features[j].properties);
            }
        }
    }
}
//raycast_test();

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
