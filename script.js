// Load data on page load
var user = {};
var genres = {};
var artists = {};

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    	while ( e = r.exec(q)) {
    		hashParams[e[1]] = decodeURIComponent(e[2]);
    	}
    return hashParams;
}

var params = getHashParams();

var access_token = params.access_token,
    state = params.state;

if (!access_token) {
  	alert('There was an error during the authentication');
  	window.location = "/";
} else {
    $.ajax({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          	'Authorization': 'Bearer ' + access_token
        },
        success: function(response) {
        	console.log('success');
        	localStorage['user'] = JSON.stringify(response);
        	user = JSON.parse(localStorage['user']);
        	$('.welcome-title').append("Welcome, " + user.display_name + "." );
        }
    });
}

//select random values from list
function selectRandom(limit, source){
	var destination = [];
	for (i = 0; i < limit; i++) {

	    var index = Math.floor((Math.random() * source.length));

	    while(destination.includes(source[index])){
	    	index = Math.floor((Math.random() * source.length));
	    }

		destination = destination.concat(source[index]);
	}

	return destination;
}


// get tracks from api
function createPlaylist(){
	var user = JSON.parse(localStorage['user']);
	var genres = JSON.parse(localStorage['genres']);
	var playlist = localStorage['playlist'] ? JSON.parse(localStorage['playlist']) : undefined;
	var all_genres = {};
	var final_genres = [];
	var final_tracks = [];
	var ajaxList = [];

	// iterate through genres and count the occurance of each genre
	for(let key in genres) {
		for(let i  in genres[key]){
			var g = genres[key];
			all_genres[genres[key][i]] = (all_genres[genres[key][i]] || 0) + 1;
		}
	}
	console.log(all_genres);

	// get genres that occur more than once and get 3
	for (let i in all_genres){
		if (all_genres[i] > 1){
			final_genres = final_genres.concat(i);
		}
	}

	if (final_genres.length > 3){
		final_genres = selectRandom(3, final_genres);
	}

	console.log(final_genres);
	console.log(final_genres.join());
	localStorage['final_genres'] = JSON.stringify(final_genres);

	getTracks(final_genres);

	function getTracks(genre){
		return $.ajax({
	      	url: 'https://api.spotify.com/v1/search?q=genre%3A%22'+ final_genres.join() +'%22+tag%3Ahipster&type=track',
	      	// url: 'https://api.spotify.com/v1/search?q=genre%3A%22'+ final_genres.join() +'%22&type=track',
	      	headers: {
	      			'Authorization': 'Bearer ' + access_token
	      	},
	      	success: function(response){
	      		var curr_tracks = response.tracks.items;
	      		final_tracks = final_tracks.concat(curr_tracks);

				if (!playlist){
					$.ajax({
						url: 'https://api.spotify.com/v1/users/'+ user.id +'/playlists',
						type: 'post',
						dataType: 'json',
						data: JSON.stringify({
						 "description": "New playlist from Discover",
						  "public": false,
						  "name": "New Playlist from Discover"
						}),
						headers: {
							'Authorization': 'Bearer ' + access_token
						},
						success: function(response){
							console.log('created playlist');
							localStorage['playlist'] = JSON.stringify(response);
							addTracks();
						}
					});
				} else {
					replaceTracks();
				}
	   		}
	  	});
	}

	function setUris(){
		playlist_artists = {};
		final_tracks_uris = [];
		for (t in final_tracks){
			final_tracks_uris = final_tracks_uris.concat(final_tracks[t].uri);
			playlist_artists[final_tracks[t].artists[0].name] = final_tracks[t].artists[0];
			localStorage['playlist_artists'] = JSON.stringify(playlist_artists);
		}
	}

	function addTracks(){
		setUris();
		return $.ajax({
			url: 'https://api.spotify.com/v1/users/'+ user.id +'/playlists/'+ playlist.id+'/tracks',
			type: 'post',
			dataType: 'json',
			data: JSON.stringify({
				'uris': final_tracks_uris
			}),
			headers: {
				'Authorization': 'Bearer ' + access_token
			},
			success: function(response){
				console.log('added tracks');
				console.log(final_tracks_uris);
				window.location = "/playlist.html#access_token=" + access_token;
				// window.location = "https://nikkidomingo.github.io/discover/playlist.html#access_token=" + access_token;
			}
		});
	}

	function replaceTracks(){
		setUris();
		return $.ajax({
			url: 'https://api.spotify.com/v1/users/'+ user.id +'/playlists/'+ playlist.id+'/tracks',
			type: 'put',
			dataType: 'json',
			data: JSON.stringify({
				'uris': final_tracks_uris
			}),
			headers: {
				'Authorization': 'Bearer ' + access_token
			},
			success: function(response){
				console.log('replaced tracks');
				window.location = "/playlist.html#access_token=" + access_token;
				// window.location = "https://nikkidomingo.github.io/discover/playlist.html#access_token=" + access_token;

			}
		});
	}
};