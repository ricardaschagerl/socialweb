$(document).ready(function() {
	window.fbAsyncInit = function() {
		FB.init({
			appId      : '1675420689152379',
			xfbml      : true,
			version    : 'v2.9',
			cookie: true,
			status: true
		});
		FB.AppEvents.logPageView();
		checkLoginStatus();
	};

	(function(d, s, id){
		var js, fjs = d.getElementsByTagName(s)[0];
		if (d.getElementById(id)) {return;}
		js = d.createElement(s); js.id = id;
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

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
	
});