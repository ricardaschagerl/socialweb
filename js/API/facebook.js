var $user;

function checkLoginState(response) {
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
    $loginButton = $(".fb-login-button").detach();
    if (response.status === 'connected') {
        // Logged into your app and Facebook.
        console.log("Logged in");
        $loginButton.appendTo("#media-buttons");
        showMe();
    } else {
        // The person is not logged into your app or we are unable to tell.
        console.log("Please Log in");
        $loginButton.appendTo("#jumbo");
        deleteMe();
    }
}

function deleteMe() {
    console.log("Logged out - delete user content.")
    if ($("#jumbo").length) {
        $(".media-object.me").attr("src", "");
        $(".media-heading.me").text("");
        $(".media-body.me").text("");
        $("#userdata").hide();
    } else {
        window.location.replace("index.html");
    }
}

function showMe() {
    console.log("Loading user data...");
    FB.api(
        '/me',
        'GET',
        {"fields": "id,name,hometown,location"},
        function (response) {
            if (response != null) {
                console.log("User data found!");
                console.log(response);

                currentUser = response;
                $user = currentUser;

                if(typeof window.friendFlag !== 'undefined'){
                    showFriends();
                }

                if(typeof window.interestsFlag !== 'undefined'){
                    showInterests();
                }

                $(".media-object.me").attr("src", "http://graph.facebook.com/" + currentUser.id + "/picture/");
                $(".media-heading.me").text(currentUser.name);
                var text = "";
                if (currentUser.location && currentUser.location.name) {
                    text = "von " + currentUser.location.name + ".";
                } else {
                    if (currentUser.hometown && currentUser.hometown.name) {
                        text = "von " + currentUser.hometown.name + ".";
                    } else {
                        text = "Kein Ort angegeben.";
                    }
                }
                $(".media-body.me").append(text);
                $("#userdata").show();
                console.log("User data loaded.");
            }
        }
    );
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

$(document).ready(function () {
    var loginLogoutEvent = statusChangeCallback;

    $.ajaxSetup({cache: true});
    $.getScript('//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.9', function () {
        FB.init({
            appId: '887816108038345',
            xfbml: true,
            version: 'v2.9',
            cookie: true,
            status: true
        });
        FB.Event.subscribe("auth.login", loginLogoutEvent);
        FB.Event.subscribe("auth.logout", loginLogoutEvent);
        checkLoginState();
    });

});

