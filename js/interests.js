var interestsFlag = true;
var friendLikes = [];
var myLikes = [];

function showInterests() {
    console.log("Loading interests data...");
	var $url =  window.location.href;
	var $friendId = $url.substr($url.lastIndexOf('=') + 1);


    FB.api("/v2.9/" + $friendId + "/likes", {"fields": "id, name, about"}, getLikesFriend);
    FB.api("/v2.9/me/likes", {"fields": "id, name, about"}, getLikesMe);
    FB.api("/v2.9/" + $friendId, setFriend);

    console.log("Interests data loaded.");
}

var getLikesMe = function getLikesMe(response){
    for (var i = 0; i < response.data.length; i++) {
        addInterest("#interestsMe", response.data[i].id, response.data[i].name, response.data[i].about);
	}

    if(response.paging.next){
        $.get(response.paging.next, getLikesMe, "json");
    }
};

var getLikesFriend = function getLikesFriend(response){
    for (var i = 0; i < response.data.length; i++) {
        addInterest("#interestsFriend", response.data[i].id, response.data[i].name, response.data[i].about);
    }

    if(response.paging.next){
        $.get(response.paging.next, getLikesFriend, "json");
    }
};

var setFriend = function setFriend(friend){
    $(".media-object.friend").attr("src", "http://graph.facebook.com/" + friend.id + "/picture/");
    $(".media-heading.friend").text(friend.name);
};

function addInterest(place, id, name, about){

    $(place).append(
		'<div class="col-md-6">' +
			'<div class="panel panel-default">' +
				'<div class="panel-body">' +
					'<div class="media">' +
						'<div class="media-left">' +
							'<img class="media-object" src="http://graph.facebook.com/' + id + '/picture/">' +
						'</div>' +
						'<div class="media-body">' +
							'<h4 class="media-heading">' + name + '</h4>\n' + about +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>'+
		'</div>'
	);
}

$(document).ready(function () {
    $(document).on("click", "#back", function(){
        window.location.replace("friends.html");
	});

    $(document).on("click", "#mapBtn", function(){
        window.location.replace("map.html");
    });
});