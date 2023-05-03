import { likedSongsPage, observerOptions,homePageListElem, getTracks, likeSong,nowPlayingDiv, nowPlayingSong, footer, nowPlayingLikeIcon, playIcon, nowPlayingImg, nowPlayingArtist, nowPlayingTitle } from "./index.js";
const targetNode = document.getElementById('main');
const config = { attributes: true, childList: true, subtree: true, attributeFilter: ['class'] };
let likedSongs=[];

const constructLikesPage =  function(mutationsList) {
    observer.disconnect();
	for(let mutation of mutationsList) {
	  if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
      let targetNode = mutation.target;
      let secondParent = targetNode.parentNode.parentNode;
          let secondParentId = secondParent.id;
      if (mutation.target.classList.contains('liked')) {
        let imgSrc = secondParent.querySelector('img').src;
        let songName = secondParent.querySelector('.song__name').innerHTML;
        let songCreator = secondParent.querySelector('.song__creator').innerHTML; 
        let likedSongsJson = {'id':secondParentId, 'coverart':imgSrc, 'title':songName, 'subtitle':songCreator};
        let isDuplicate = likedSongs.some(song => song.id === likedSongsJson.id);
        if (!isDuplicate) {
          likedSongs.push(likedSongsJson);
          } 
        if(likedSongs.length==1){
          likedSongsPage.classList.remove('hidden');
          }  
      } 
      else {
        let indexToRemove = likedSongs.findIndex(song => song.id === secondParentId);
        if (indexToRemove !== -1) {
          likedSongs.splice(indexToRemove, 1);
        } 
        if(likedSongs.length==0){
          likedSongsPage.classList.add('hidden');
        }
      }
	  } 
	}
  observer.observe(targetNode, config);
};
//Listen for changes in the '.like' class to construct the likes page
const observer = new MutationObserver(constructLikesPage);
observer.observe(targetNode, config);

function handleLikesPage() {
  if (likedSongsPage.classList.contains('is-active')) {
    //Clear the existing songs
    while (homePageListElem.firstChild) {
      homePageListElem.removeChild(homePageListElem.firstChild);
    }
    //Add liked songs to the page
    for (let i = 0; i < likedSongs.length; i++) {
      const div = document.createElement("div");
      const artistName = document.createElement("span");
      const songName = document.createElement("span");
      const listItem = document.createElement("li");
      const likeIconDiv = document.createElement("div");
      const likeIcon = document.createElement("i");
      const coverImg = likedSongs[i].coverart;
      const image = document.createElement("img");

      songName.innerHTML = likedSongs[i].title;
      artistName.innerHTML = likedSongs[i].subtitle;
      image.setAttribute('src', coverImg);
      div.setAttribute('class', 'bg_div');
      listItem.setAttribute('class','music__list-item');
      listItem.setAttribute('id',likedSongs[i].id);
      songName.setAttribute('class','song__name');
      artistName.setAttribute('class','song__creator');
      likeIconDiv.classList.add('like-div');
      likeIcon.classList.add('like-icon');
      likeIcon.classList.add('fa');
      likeIcon.classList.add('fa-heart');
      likeIcon.style.color='#008000';
      likeIcon.ariaHidden='true';
      homePageListElem.appendChild(div);
      div.appendChild(listItem)
      listItem.appendChild(image);
      listItem.appendChild(songName);
      listItem.appendChild(artistName);
      likeIconDiv.append(likeIcon);
      listItem.append(likeIconDiv);    
      }

    //For each song add an event listener to play it on click
    const songElements = document.querySelectorAll('.music__list-item');
    let parsedResult;
    let hubURL;
    for (let i =0; i<songElements.length; i++){
        songElements[i].addEventListener('click', async (e) =>
        { 
        let elementId = e.target.id;

            for(let j=0; j<likedSongs.length; j++){
                if(likedSongs[i].id===elementId){
                    const url = `https://shazam.p.rapidapi.com/songs/get-details?key=${elementId}&locale=en-US`;
                    getTracks(url).then(result => {
                    parsedResult = JSON.parse(result)}).then(async ()=>{
                    hubURL = parsedResult['hub']['actions'][1]['uri'];
                    
                    return await fetch(hubURL, {
                        method: 'GET',
                        'X-RapidAPI-Key': '1512532601msh0d2ab2a07c62b6fp17fb67jsn23b5bd40391f',
                        'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
                    })}).then(response => response.blob())
                  .then(blob => {
                    const audioUrl = URL.createObjectURL(blob);
                    nowPlayingSong.src = audioUrl;
                    nowPlayingImg.setAttribute('src', likedSongs[i].coverart);
                    nowPlayingTitle.innerHTML = likedSongs[i].title;
                    nowPlayingArtist.innerHTML = likedSongs[i].subtitle;
                    footer.classList.remove('hidden');
                    nowPlayingSong.play();
                    nowPlayingDiv.id=`id=${elementId}`;
                    likeSong(nowPlayingLikeIcon);
                    playIcon.classList.remove('fa-play-circle');
                    playIcon.classList.add('fa-pause-circle');
                })
                .catch(error => {
                    console.error(error);
          });}
        }
    }
  )
    }
  }
}
//Listen for changes in the liked songs page
const likesObserver = new MutationObserver(handleLikesPage);
likesObserver.observe(likedSongsPage,observerOptions);