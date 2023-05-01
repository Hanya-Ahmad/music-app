export const discoverPage = document.getElementById('discover');
export const searchResultsPage = document.getElementById('search-results');
const searchBtn = document.querySelector('#search-btn');
export const homePageListElem = document.getElementById('music__list');
export const nowPlayingImg = document.getElementById("now_playing_img");
export const nowPlayingTitle = document.getElementById("now_playing_title");
export const nowPlayingArtist = document.getElementById("now_playing_artist");
export const nowPlayingSong = document.getElementById("now_playing_song");
export const playIcon = document.querySelector('.fa-play-circle');

// import { playIcon } from "./nowplaying.js";
// export const audio = document.getElementsByName('audio');
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '796bbbf3bcmshf2115c702d74fd2p17ae88jsnf44f324bc026',
		'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
	}
};
export const observerOptions = {
	attributes: true
}
//This function calls the Shazam API and returns the response

export async function getTracks(url){
    try {
		const response = await fetch(url, options);
		let result = await response.text();
		return result;
	} catch (error) {
		console.error(error);
	}
}

//This function updates the UI with the songs
export function addSongsToUI(jsonObj,page){
    console.log("ADDED TO UI");
    let jsonObjTracks;
    let jsonObjIndex;
    if(page==='topsongs'){
        jsonObjTracks = jsonObj['tracks'];
    }
    else if(page==='searchresults'){
	    jsonObjTracks = jsonObj['tracks']['hits'];
         
    }
	for(let i =0; i<jsonObjTracks.length; i++){
        if(page==='topsongs'){
            jsonObjIndex = jsonObjTracks[i];
        }
        else if(page==='searchresults'){
            jsonObjIndex = jsonObjTracks[i]['track']; 
        }
		let div = document.createElement("div");
		let listItem=document.createElement("li");
		let span= document.createElement("span");
		let image;
		listItem.innerHTML = `${jsonObjIndex['title']}`;
		span.innerHTML = `${jsonObjIndex['subtitle']}`;

		if(jsonObjIndex['images']){
			let coverImg =jsonObjIndex['images']['coverart'];
			image = document.createElement("img");
			image.setAttribute('src',coverImg);
		}

		else{
			continue;
		}

		div.setAttribute('class','bg_div');
		listItem.setAttribute('class','music__list-item');
		listItem.setAttribute('id',jsonObjIndex['key']);
		span.setAttribute('class','song__creator');
		homePageListElem.appendChild(div);
		div.appendChild(listItem)
		listItem.appendChild(image);
		listItem.appendChild(span);
	}
	return jsonObj;
}
export //This function plays a song when clicked
async function addSongClickEvents(songElements,parsedResult,page){
	let hubUrl;
    let jsonObjIndex;
	let chosenSong;
    let jsonObjTracks;
    if(page==='topsongs'){
        jsonObjTracks = parsedResult['tracks'];
    }
    else if(page==='searchresults'){
	    jsonObjTracks = parsedResult['tracks']['hits'];
    }     
	// let jsonObj = parsedResult['tracks']['hits'];
	console.log("click event added ", jsonObjTracks);
	
	for (let i =0; i<songElements.length; i++){
		songElements[i].addEventListener('click', async (e) =>
		{ 
		let elementId = e.target.id;
		if (elementId !== ''){
			chosenSong = elementId;
			for(let j=0; j<jsonObjTracks.length; j++){
                if(page==='topsongs'){
                    jsonObjIndex = jsonObjTracks[j];
                }
                else if(page==='searchresults'){
                    jsonObjIndex = jsonObjTracks[j]['track']; 
                }
				if(jsonObjIndex['key']===chosenSong){
					nowPlayingImg.setAttribute('src', jsonObjIndex['images']['coverart']);
					nowPlayingTitle.innerHTML = jsonObjIndex['title'];
					nowPlayingArtist.innerHTML = jsonObjIndex['subtitle'];
					hubUrl = jsonObjIndex['hub']['actions'][1]['uri'];
					await fetch(hubUrl, {
						method: 'GET',
						'X-RapidAPI-Key': '796bbbf3bcmshf2115c702d74fd2p17ae88jsnf44f324bc026',
						'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
					  })
					.then(response => response.blob())
					.then(blob => {
						const audioUrl = URL.createObjectURL(blob);
						nowPlayingSong.src = audioUrl;
						nowPlayingSong.play();
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
discoverPage.addEventListener('click',()=>{
    if(!discoverPage.classList.contains('is-active')){
    searchResultsPage.classList.remove('is-active');
    discoverPage.classList.add('is-active');
    }
});
searchResultsPage.addEventListener('click',()=>{
    if(!searchResultsPage.classList.contains('is-active')){
        discoverPage.classList.remove('is-active');

        searchResultsPage.classList.add('is-active');
    }
})
searchBtn.addEventListener('click',()=>{
    if(!searchResultsPage.classList.contains('is-active')){
        discoverPage.classList.remove('is-active');

        searchResultsPage.classList.add('is-active');
    }
    console.log("search clicked");
})