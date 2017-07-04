var map;
var longitude = 14.2942;
var latitude = 48.31379;
var hometown;
var currentUser;
var marker;
var curLatLong;
var userLatLong;

$(document).ready(function() {
	console.log("Ready to go");
	
	$("button").button();
		
	$("#logout").click(function(){
		FB.logout(function(response){
			$("button").button("option","disabled",true);
			$("#login").button("option","disabled",false);
			$("#user").empty().hide();
			emptyAndHideAll();
		});
	});
	
	$("#showfriends").click(function(){
		emptyAndHideAll();
		showFriends();
	});
	
	$("#login").click(()=>{
		//code executed if button login pressed
		FB.login((response)=>{
			//wenn Facebook das Login durchgeführt - Callback
			if(response.authResponse){
				$("button").button("option","disabled",false);
				$("#login").button("option","disabled",true);
				showMe();
			}
		  },{perms:"email, user_birthday, user_location, user_hometown, user_likes, user_friends"});
	});
	
	
	$("#showdetails").click(()=>{
        emptyAndHideAll();
		FB.api("/me?metadata=1",(user)=>{
			if(user!=null){
				console.log(user);
				showDetails(user);
			}
		});
    });
	
	createMap();
	initMap();
});

function checkLoginStatus(){
	FB.getLoginStatus((response)=>{
		if(response.authResponse){
			$("button").button("option","disabled",false);
			$("#login").button("option","disabled",true);
			showMe();
		}
	});
}

function showFriends() {
    FB.api( "/me/friends", (list)=>{
        if( list != null && list.data != null ) {            
            for( var i=0; i<list.data.length; i++ ) {
                var link = "<a id='" + list.data[i].id + "' href=''>" + list.data[i].name + "</a> ";    
                $("#friends").append(link);
            }
            
            $("#friends a").click( ()=> {
                var id = $(this).attr("id");                
                FB.api( "/" + id, (user)=> {
                    if( user != null ) {
                        showDetails(user);
                        showLikes(user);
                    }
                });     
                return false;
            });            
            $("#friends").show();
        }
    });
}

function emptyAndHideAll(){
	$("#details").empty().hide();
	$("#friends").empty().hide();
	$("#likes").empty().hide();
}

function showDetails(user){
	//console.log("In show details");
	for(var field in user.metadata.fields){
		//console.log(user.metadata.fields[field].name);
		FB.api("/"+user.id+"?fields="+user.metadata.fields[field].name,function(field){
			if(field!=null){
				//console.log(field);
				$("#details").append(printData(field));
				showLikes(user);
			}
		});
	}
	
	$("#details").show();
}

function printData(user){
	var str ="";
	switch(to(user)){
		case "Array" :
			str += printArray(user);
			str += "<br/>";
			break;
		case "Object":
			if(Object.keys(user).length > 1) {
				str += "<div class='obj'>";
				str += printObject(user);
				str += "</div>";
			}
			break;
		case "String":
			str += user;
			str +="<br/>";
			break;
		default:
			break;
	}
	return str;
}

function printObject(o){
	var s="";
	for(var k in o){
		if(k!="id"){
			s += k + ": " + printData(o[k]);
		}
	}
	return s;
}

function printArray(a) {
	var s="";
	for(var i=0; i<a.length; i++){
		s+= printData(a[i]);
	}
	return s;
}

function to(t){
	if(t !=null){
		return String(t.constructor).split(" ")[1].split("()").join("");
	}
	return null;
}

function showLikes(user) {
	var html = user.name + " likes <br/>";
	FB.api("/" + user.id + "/likes", function(likes){
		console.log(likes);
		if(likes !=null && likes.data != null){
			for (var i=0; i < likes.data.length; i++){
				html += likes.data[i].name + " - ";
			}
		}
		
		$("#likes").html(html);
		$("#likes").show();
	});
}


function showMe(){
	FB.api("/me?fields=id,name,birthday,link,email,hometown",function(user){
		if(user!=null){
			currentUser = user
			var html ="<div id='pic'><img src='http://graph.facebook.com/" + user.id + "/picture/'></div>";
			html += "<div id='info'>"+user.name + "<br/>";
			html += "<a href='"+user.link+"'>"+user.link+"</a><br/>";
			html += "email: "  + user.email + " | birthday: " + user.birthday + "</div>";
			hometown = user.hometown;
			if (hometown != null && hometown.name != null){
				html += "Hometown: " + hometown.name + "</div>";
			} else {
			    html += "</div>";
			}
						
			$("#user").empty();
			$("#user").html(html);
			$("#user").show();
			showLocation();
		}
	});
}
//google maps part

function displayPosition(position) {
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
	calculateAndDisplayRoute(curLatLong,userLatLong);
}


function calculateAndDisplayRoute(currentPos,hometown) {
  if(currentPos != null && hometown != null){
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
    }, function(response, status) {
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

function initMap(){
	
	try {
		if(typeof(navigator.geolocation) == 'undefined'){
			alert("I'm sorry, but geolocation services are not supported by your browser.");
		} else {
			var gl = navigator.geolocation;
			gl.getCurrentPosition(displayPosition, displayError);
		}
	}catch(e){}
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

function showLocation(){
	if (hometown != null && hometown.name != null && currentUser != null){
		var geocoder = new google.maps.Geocoder();
		if(geocoder) {
			geocoder.geocode(
			{address : hometown.name}, 
			function(results, status) {
				if(status == google.maps.GeocoderStatus.OK) {
					userLatLong = results[0].geometry.location;
					map.setCenter(userLatLong);
					/*if (marker != null){
						marker.setMap(null);
					}	*/
					marker = new google.maps.Marker({
						position: userLatLong,
						map: map,
						icon: {url:'home.gif'},
						title: currentUser.name
					});
					calculateAndDisplayRoute(curLatLong,userLatLong)
					google.maps.event.addListener(marker, "click", function() {
						createInfoWindow(currentUser,marker);
					});
				} else {
					alert(address + " was not found.");
				}
			});
		}
	} else {
		alert("User does not provide hometown");
	}	
}

function createInfoWindow(user,marker){
	var html = "<div id='pic'><img src=http://graph.facebook.com/" + user.id + "/picture/></div>";
	html += "<div id='info'>" + user.name + "</div>";
	var infowindow = new google.maps.InfoWindow({
		content: html
	});
	infowindow.open(map,marker);
}