 const discoverPage = document.getElementById('discover');
 const searchResultsPage = document.getElementById('search-results');
 const likedSongsPage = document.getElementById('liked-songs');
 const searchBtn = document.querySelector('#search-btn');
 const homePageListElem = document.getElementById('music__list');
 const nowPlayingDiv = document.getElementById('now_playing');
 const nowPlayingImg = document.getElementById("now_playing_img");
 const nowPlayingTitle = document.getElementById("now_playing_title");
 const nowPlayingArtist = document.getElementById("now_playing_artist");
 const nowPlayingSong = document.getElementById("now_playing_song");
 const playIcon = document.querySelector('.fa-play-circle');
 const nowPlayingLikeIcon = document.getElementById('now_playing_like_icon');

 const footer = document.querySelector('.footer');
 function likeSong(element){

	element.classList.remove('fa-heart-o');
	element.classList.add('fa-heart');
	element.classList.add('liked');
    element.style.color='#008000';
	
}
 function unlikeSong(element){
	element.classList.add('fa-heart-o');
    element.classList.remove('fa-heart');
	element.classList.remove('liked');
    element.style.color='white';
}
function addLikeEventListener(likeIconElems){
	
	likeIconElems.forEach(likeIcon=>{
    likeIcon.addEventListener('click',()=>{
        if(likeIcon.classList.contains('fa-heart-o')){
            likeSong(likeIcon)
        }
        else{
			unlikeSong(likeIcon)
        }

		let parentNode = likeIcon.parentNode.parentNode;
		//Then this song is now playing
		if (parentNode.classList.contains('now-playing')){
			let likedSongId= parentNode.id;
			likedSongId = likedSongId.substring(3);
			//If the same song is displayed in the current page, like it there too
			if(document.getElementById(likedSongId)){
				let likeIconInPage = document.getElementById(likedSongId).querySelector('.like-icon');
				if(likeIconInPage.classList.contains('fa-heart-o')){
					likeSong(likeIconInPage);
				}

				else{
					unlikeSong(likeIconInPage);
				}
			}

		}
  
    });
    
});
}

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '1512532601msh0d2ab2a07c62b6fp17fb67jsn23b5bd40391f',
		'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
	}
};
 const observerOptions = {
	attributes: true
}
//This function calls the Shazam API and returns the response


 async function getTracks(url){
    try {
		const response = await fetch(url, options);
		let result = await response.text();
		return result;
	} catch (error) {
		console.error(error);
	}
}

//This function updates the UI with the songs
 function addSongsToUI(jsonObj,page){
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
		let artistName= document.createElement("span");
        let songName = document.createElement("span");
        let likeIconDiv = document.createElement("div");
        let likeIcon = document.createElement("i");
		
		let image;
        songName.innerHTML = `${jsonObjIndex['title']}`;
		artistName.innerHTML = `${jsonObjIndex['subtitle']}`;
		if(jsonObjIndex['images']['coverart']){
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
        songName.setAttribute('class','song__name');
		artistName.setAttribute('class','song__creator');
        likeIconDiv.classList.add('like-div');
        likeIcon.classList.add('like-icon');
        likeIcon.classList.add('fa');
        likeIcon.classList.add('fa-heart-o');
        likeIcon.ariaHidden='true';
		homePageListElem.appendChild(div);
		div.appendChild(listItem)
		listItem.appendChild(image);
        listItem.appendChild(songName);
		listItem.appendChild(artistName);
        likeIconDiv.append(likeIcon);
        listItem.append(likeIconDiv);
        
	}
    let likeIconElems = document.querySelectorAll('.like-icon');
    addLikeEventListener(likeIconElems);
	return jsonObj;
}

 //This function plays a song when clicked
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
						'X-RapidAPI-Key': '1512532601msh0d2ab2a07c62b6fp17fb67jsn23b5bd40391f',
						'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
					  })
					.then(response => response.blob())
					.then(blob => {
						const audioUrl = URL.createObjectURL(blob);
						nowPlayingSong.src = audioUrl;
						footer.classList.remove('hidden');
						nowPlayingSong.play();
                        nowPlayingDiv.id=`id=${chosenSong}`;
						if(songElements[i].querySelector('.like-div').querySelector('.like-icon').classList.contains('liked')){
							likeSong(nowPlayingLikeIcon);

						}
						else{
							unlikeSong(nowPlayingLikeIcon);

						}
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
	likedSongsPage.classList.remove('is-active');

    discoverPage.classList.add('is-active');
	document.getElementById("search-box").querySelector("input[type='text']").value = "";
    }
});
searchResultsPage.addEventListener('click',()=>{
    if(!searchResultsPage.classList.contains('is-active')){
        discoverPage.classList.remove('is-active');
        likedSongsPage.classList.remove('is-active');
        searchResultsPage.classList.add('is-active');
    }
})
likedSongsPage.addEventListener('click',()=>{
    if(!likedSongsPage.classList.contains('is-active')){
        discoverPage.classList.remove('is-active');
        searchResultsPage.classList.remove('is-active');
        likedSongsPage.classList.add('is-active');
    }
})

searchBtn.addEventListener('click',()=>{
    if(!searchResultsPage.classList.contains('is-active')){
        discoverPage.classList.remove('is-active');
        likedSongsPage.classList.remove('is-active');
        searchResultsPage.classList.add('is-active');
    }
	else{
        searchResultsPage.classList.remove('is-active');
        likedSongsPage.classList.remove('is-active');
        searchResultsPage.classList.add('is-active');
	}
 
})
export{discoverPage, searchResultsPage,likedSongsPage,searchBtn,homePageListElem,nowPlayingDiv,nowPlayingImg,nowPlayingTitle,
nowPlayingArtist,nowPlayingSong,playIcon,nowPlayingLikeIcon,footer,observerOptions,likeSong,unlikeSong,getTracks,addSongsToUI,
addSongClickEvents, addLikeEventListener}