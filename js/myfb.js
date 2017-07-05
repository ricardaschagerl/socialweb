/**
 * Created by Gisela on 05.05.17.
 */

var hometown;
var currentUser;
var latitude = 48.31379;
var longitude = 14.2942;
var map;
//var curLatLong;
//var userLatLong;

$(document).ready(function () {
    console.log("Ready to go ");
    $.ajaxSetup({ cache: true });
    $.getScript('//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.9', function(){
        FB.init({
            appId: '887816108038345',
            xfbml: true,
            version: 'v2.9',
            cookie: true,
            status: true
        });
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    });

    FB.Event.subscribe('xfbml.render', finished_rendering);

    /* window.fbAsyncInit = function () {
        FB.init({
            appId: '887816108038345',
            xfbml: true,
            version: 'v2.9',
            cookie: true,
            status: true
        });
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });

    (function (d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s);
        js.id = id;
        js.src = "//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.9";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    /*$("#findMatch").click(()=>{
     findMatch(currentUser);
     });

     $("#login").click(function(){
     //Code is executed if Login Button is pressed
     FB.login((response)=>{
     //Wenn FB Login durchgeführt wurde (Callback)
     if(response.authResponse){
     $("button").button("option", "disabled", false);
     $("#login").button("option", "disabled", true);

     showMe();
     showLikes(currentUser);
     }
     }, {perms:"email, user_birthday, user_location, user_hometown, user_likes, user_friends, user_friendlists"});
     });

     $("#showFriends").click(()=> {
     emptyAndHideAll();
     showFriends(currentUser);
     });*/

     createMap();
     initMap();
});

var finished_rendering = function() {
    $spinner = $("#spinner");
    $spinner.remove();
};

function checkLoginState() {
    FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log("Logged in");
    } else {
        // The person is not logged into your app or we are unable to tell.
        console.log("Please Log in");
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

/*
 function displayPosition(position) {
 latitude = position.coords.latitude;
 longitude = position.coords.longitude;
 curLatLong = new google.maps.LatLng(latitude, longitude);
 var currentLocation = new google.maps.Marker({
 //position: curLatLong,
 position: hometown,
 map: map,
 title: "Your location"
 });
 map.setCenter(curLatLong);
 console.log("got current pos");
 //calculateAndDisplayRoute(curLatLong,userLatLong);

 }
 */

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
                console.log(response);
                var friendsdistance = response.routes[0].legs[0].distance.value;
                console.log("Gesamte Entfernung " + friendsdistance);
                var currentDistance = 0;
                var index = 0;
                var steps = response.routes[0].legs[0].steps;
                while (currentDistance < friendsdistance / 2 && index < steps.length) {
                    currentDistance += steps[index].distance.value;
                    console.log(currentDistance);
                    index++;
                }
                console.log(steps[index]);
                /* Um den Punkt auf der Karte anzuzeigen, müssen die Koordinaten aus dem Waypoint herausgeholt werden
                 -> liegen im Scope! Bekomm ich die nur mit angular heraus?
                 var meetingPointLatLong = steps[index].lat_lngs[0].lat[[[$scope]]][0].a;
                 console.log(meetingPointLatLong)

                 marker = new google.maps.Marker({
                 position: meetingPointLatLong,
                 map: map,
                 icon: {url:'restaurant.png'},
                 flat: true
                 });

                 */
                directionsDisplay.setDirections(response);
            } else {
                window.alert('Directions request failed due to ' + status);
            }
        });
    }
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
                         }    */
                        marker = new google.maps.Marker({
                            position: userLatLong,
                            map: map,
                            icon: {url: 'home.gif'},
                            title: currentUser.name
                        });
                        //calculateAndDisplayRoute(curLatLong,userLatLong)
                        // google.maps.event.addListener(marker, "click", function() {
                        //     createInfoWindow(currentUser,marker);
                        //  });
                        calculateAndDisplayRoute(userLatLong, userLatLong)
                    } else {
                        alert(address + " was not found.");
                    }
                });
        }
    } else {
        alert("User does not provide hometown");
    }
}


function createMap() {
    var coord = new google.maps.LatLng(latitude, longitude);
    var opt = {
        zoom: 13,
        center: coord,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById("map-canvas"), opt);
    $("#map-canvas").show();
}


function showLikes(user) {
    if (user) {
        let html = user.name + " likes: </br>";
        FB.api("/" + user.id + "/likes", (likes) => {
            console.log(likes);
            if (likes && likes.data) {
                for (var i = 0; i < likes.data.length; i++) {
                    html += likes.data[i].name + " - ";
                }
                $("#likes").html(html);
                $("#likes").show();
            }
        });
    }
}


function showFriends(user) {
    if (user) {
        let html = user.name + "s Freunde: </br>";
        FB.api("/" + user.id + "/friends", "GET", {"fields": "id,name,friends,likes"}, (friends) => {
            console.log(friends.data[0].likes.data);
            if (friends && friends.data) {
                for (var i = 0; i < friends.data.length; i++) {
                    html += friends.data[i].name;
                    html += friends.data[i].id;
                    var likes = friends.data[i].likes.data;
                    for (var i = 0; i < likes.length; i++) {
                        html += likes[i].name + " - ";
                    }

                }
                $("#friends").html(html);
                $("#friends").show();
            }
        });
    }
}

function emptyAndHideAll() {
    $("#details").empty().hide();
    $("#friends").empty().hide();
    $("#like").empty().hide();
}

function findMatch(user) {
    console.log("Find match");
    //Ricardas Likes
    FB.api("/" + user.id + "/friends", "GET", {"fields": "id,name,friends,likes,hometown"}, (friends) => {
        console.log(friends.data[0]);
        var friendHometown = friends.data[0].hometown.name;
        console.log(friendHometown);
        var friendlikes = friends.data[0].likes.data;
        var mylikes = user.likes.data;

        for (var i = 0; i < friendlikes.length; i++) {
            for (var j = 0; j < mylikes.length; j++) {
                if (friendlikes[i].id == mylikes[j].id) {
                    console.log("JUHUUUUU");
                    console.log(friendHometown);
                    console.log(hometown);
                    calculateAndDisplayRoute(hometown.name, friendHometown);
                    return;
                }
            }
        }


    });


    /*FB.api("/"+user.id+"/likes", (likes)=> {
     console.log(likes.data);
     });
     console.log(friends.data);
     console.log(likes.data);
     if(friends.data === likes.data) {
     console.log("Freunde gefunden");
     FB.api("/"+user.id+ "GET", {"fields":"hometown"}, (friends)=> {
     console.log(friends.data);
     });
     }*/
}

function showMe() {
    console.log("Now logged in - should load user data");
    FB.api(
        '/me',
        'GET',
        {"fields": "id,name,hometown,birthday,events,likes,friends"},
        function (response) {
            if (response != null) {
                currentUser = response;
                let html = "<div id='pic'><img src='http://graph.facebook.com/" + response.id + "/picture/'></div>";
                let name = "<p id='name'>" + response.name + "</p>";
                let birthday = "<p id='birthday'>" + response.birthday + "</p>";
                let friends = "<p id='friends'>" + response.friends + "</p>";


                hometown = response.hometown;
                if (hometown && hometown.name) {
                    html += "Hometown: " + hometown.name + "</div>";
                } else
                    html += "</div>";

                console.log(response);
                $("#user").empty();
                $("#user").html(html + name + birthday);
                $("#user").show();
                showLikes(currentUser);
                showFriends(currentUser);
                showLocation();
            }
        }
    );
}