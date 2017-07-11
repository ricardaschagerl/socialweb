var map;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
}

function getCoordinatesOfCity(city, coord){
    var geocoder = new google.maps.Geocoder();
    if (geocoder) {
        geocoder.geocode({address: city}, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                coord = results[0].geometry.location;
            }
        });
    }
}

function setCenterAndMarkerOnMap(coord, title){
    map.setCenter(userLatLong);
    marker = new google.maps.Marker({
        position: userLatLong,
        map: map,
        icon: {url: 'home.gif'},
        title: currentUser.name
    });
}

/* function displayPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    curLatLong = new google.maps.LatLng(latitude, longitude);
    var currentLocation = new google.maps.Marker({
        position: curLatLong,
        map: map,
        title: "Your location"
    });
    map.setCenter(curLatLong);
    console.log("got current pos");
    calculateAndDisplayRoute(curLatLong, userLatLong);

    createMap();
    initMap();
}


function calculateAndDisplayRoute(currentPos, hometown) {
    if (currentPos != null && hometown != null) {
        var directionsService = new google.maps.DirectionsService;
        var directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            preserveViewport: true,
            draggable: true
        });

        directionsService.route({
            origin: currentPos,
            destination: hometown,
            travelMode: google.maps.TravelMode.DRIVING
        }, function (response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
}

function displayError(positionError) {
    alert("error");
}

function initMap() {
    try {
        if (typeof(navigator.geolocation) == 'undefined') {
            alert("I'm sorry, but geolocation services are not supported by your browser.");
        } else {
            var gl = navigator.geolocation;
            gl.getCurrentPosition(displayPosition, displayError);
        }
    } catch (e) {
    }
}

function createMap() {
    var c = new google.maps.LatLng(latitude, longitude);
    var opt = {
        zoom: 13,
        center: c,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById("map-canvas"), opt);
    $("#map-canvas").show()
}

function showLocation() {
    if (hometown != null && hometown.name != null && currentUser != null) {
        var geocoder = new google.maps.Geocoder();
        if (geocoder) {
            geocoder.geocode(
                {address: hometown.name},
                function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        userLatLong = results[0].geometry.location;
                        map.setCenter(userLatLong);
                        /*if (marker != null){
                         marker.setMap(null);
                         }
                        marker = new google.maps.Marker({
                            position: userLatLong,
                            map: map,
                            icon: {url: 'home.gif'},
                            title: currentUser.name
                        });
                        calculateAndDisplayRoute(curLatLong, userLatLong)
                        google.maps.event.addListener(marker, "click", function () {
                            createInfoWindow(currentUser, marker);
                        });
                    } else {
                        alert(address + " was not found.");
                    }
                });
        }
    } else {
        alert("User does not provide hometown");
    }
} */

$(document).ready(function() {
 initMap();
});