$(document).ready(function () {
    $(document).on("click", "#showdetails", function(){
        console.log("CLICK ME!");
        showMe();
    });

    var finished_rendering = function () {
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
            showMe();
        } else {
            // The person is not logged into your app or we are unable to tell.
            console.log("Please Log in");
        }
    }

    $.ajaxSetup({cache: true});
    $.getScript('//connect.facebook.net/de_DE/sdk.js#xfbml=1&version=v2.9', function () {
        FB.init({
            appId: '887816108038345',
            xfbml: true,
            version: 'v2.9',
            cookie: true,
            status: true
        });
        FB.Event.subscribe('xfbml.render', finished_rendering);
        FB.getLoginStatus(function (response) {
            statusChangeCallback(response);
        });
    });

    function showMe() {
        console.log("Now logged in - should load user data");
        FB.api(
            '/me',
            'GET',
            {"fields": "id,name,hometown,likes,friends,location"},
            function (response) {
                if (response != null) {
                    console.log(response);
                    $(".fb-login-button").hide();
                    currentUser = response;
                    $(".media-object").attr("src", "http://graph.facebook.com/" + currentUser.id + "/picture/");
                    $(".media-heading").text(currentUser.name);
                    var text = "";
                    if(currentUser.location && currentUser.location.name){
                        text = "von " +  currentUser.location.name + ".";
                    } else {
                        if (currentUser.hometown && currentUser.hometown.name) {
                            text = "von " + currentUser.hometown.name + ".";
                        } else {
                            text = "Kein Ort angegeben.";
                        }
                    }
                    $(".media-body").append(text);
                    $("#userdata").show();
                }
            }
        );
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
                    $likes = $("#likes");
                    $likes.html(html);
                    $likes.show();
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
                    $friends = $("#friends");
                    $friends.html(html);
                    $friends.show();
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
});