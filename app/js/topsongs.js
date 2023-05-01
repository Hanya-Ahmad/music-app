const homePageListElem = document.getElementById('music__list');
let parsedResult;
let nowPlaying;
const nowPlayingImg = document.getElementById("now_playing_img");
const nowPlayingTitle = document.getElementById("now_playing_title");
const nowPlayingArtist = document.getElementById("now_playing_artist");
const nowPlayingSong = document.getElementById("now_playing_song");

//This function calls the Shazam API and retrieves the most streamed songs
async function getHomePageTracks(){
	const url = 'https://shazam.p.rapidapi.com/charts/track?locale=en-US&pageSize=20&startFrom=0';
	const options = {
		method: 'GET',
		headers: {
			'X-RapidAPI-Key': '624be265cfmshb898fc9de602961p1563a7jsn5d5c9ab74c77',
			'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
		}
	};
	try {
		const response = await fetch(url, options);
		let result = await response.text();
		return result;
	} catch (error) {
		console.error(error);
	}
}

//This function updates the UI with the songs
function addTopSongsToUI(jsonObj){
	let jsonObjTracks = jsonObj['tracks'];
	for(let i =0; i<jsonObjTracks.length; i++){
		let div = document.createElement("div");
		let listItem=document.createElement("li");
		let span= document.createElement("span");
		let image;
		listItem.innerHTML = `${jsonObjTracks[i]['title']}`;
		span.innerHTML = `${jsonObjTracks[i]['subtitle']}`;

		if(jsonObjTracks[i]['images']){
			let coverImg =jsonObjTracks[i]['images']['coverart'];
			image = document.createElement("img");
			image.setAttribute('src',coverImg);
		}

		else{
			continue;
		}

		div.setAttribute('class','bg_div');
		listItem.setAttribute('class','music__list-item');
		listItem.setAttribute('id',jsonObjTracks[i]['key']);
		span.setAttribute('class','song__creator');
		homePageListElem.appendChild(div);
		div.appendChild(listItem)
		listItem.appendChild(image);
		listItem.appendChild(span);
	}
	return jsonObj;
}

function setNowPlayingUI(nowPlayingObj){

	// nowPlayingImg.setAttribute('src',nowPlayingObj[''])
}

//This function plays a song when clicked
async function addSongClickEvents(songElements,parsedResult){
	let hubUrl;
	let chosenSong;
	console.log("parsed ", parsedResult);
	for (let i =0; i<songElements.length; i++){
		songElements[i].addEventListener('click', async (e) =>
		{ 
		let elementId = e.target.id;
		if (elementId !== ''){
			chosenSong = elementId;
			for(let j=0; j<parsedResult['tracks'].length; j++){
				if(parsedResult['tracks'][j]['key']===chosenSong){
					nowPlayingImg.setAttribute('src', parsedResult['tracks'][j]['images']['coverart']);
					nowPlayingTitle.innerHTML = parsedResult['tracks'][j]['title'];
					nowPlayingArtist.innerHTML = parsedResult['tracks'][j]['subtitle'];
					hubUrl = parsedResult['tracks'][j]['hub']['actions'][1]['uri'];
					await fetch(hubUrl, {
						method: 'GET',
						'X-RapidAPI-Key': '624be265cfmshb898fc9de602961p1563a7jsn5d5c9ab74c77',
						'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
					  })
					.then(response => response.blob())
					.then(blob => {
						const audioUrl = URL.createObjectURL(blob);
						nowPlayingSong.src = audioUrl;
						audio.play();
						playIcon.classList.remove('fa-play-circle');
						playIcon.classList.add('fa-pause-circle');
					})
					.catch(error => {
					  console.error(error);
					});

				}
			}
		}

	}
	);
		}
}

if(discoverPage.classList.contains('is-active')){
getHomePageTracks().then(result => {
	parsedResult = JSON.parse(result);
	console.log(parsedResult['tracks']);
	parsedResult = addTopSongsToUI(parsedResult);

})
.then(()=>{
	const songElements = document.querySelectorAll('.music__list-item');
	addSongClickEvents(songElements,parsedResult);
 }).
catch(error => {
  console.error(error);
});
}
