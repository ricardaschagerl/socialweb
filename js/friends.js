var friendFlag = true;

function showFriends() {
    console.log("Loading friends data...");
    FB.api("/v2.9/" + $user.id + "/friends", "GET", {"fields": "id, name, hometown, location, likes"}, (friends) => {
        if (friends && friends.data) {
            console.log("Friends data found!");
            console.log(friends);
            for (var i = 0; i < friends.data.length; i++) {
                addFriend(friends.data[i].name,
                    friends.data[i].id,
                    friends.data[i].hometown,
                    friends.data[i].location);
            }
        }
    });
    console.log("Friends data loaded.");
}

function addFriend(name, id, hometown, location){
    let $text = "";
    if (location && location.name) {
        $text = "von " + location.name + ".";
    } else {
        if (hometown && hometown.name) {
            $text = "von " + hometown.name + ".";
        } else {
            $text = "Kein Ort angegeben.";
        }
    }

    $("#friendContainer").append(
        '<div class="col-md-6">' +
            '<div class="panel panel-default">' +
                '<div class="panel-body">' +
                    '<div class="media">' +
                        '<div class="media-left">' +
                            '<a href="interests.html?id='+ id +'">' +
                                '<img class="media-object" src="http://graph.facebook.com/' + id + '/picture/">' +
                            '</a>' +
                        '</div>' +
                        '<div class="media-body">' +
                            '<h4 class="media-heading">' + name + '</h4>\n' + $text +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>');
}