import { getTracks, addSongsToUI,searchResultsPage,observerOptions, homePageListElem, nowPlayingImg, nowPlayingTitle, nowPlayingArtist, nowPlayingSong, addSongClickEvents  } from "./index.js";
const searchBox = document.querySelector('#search-box input');

const handleSearchResultsPage = ()=>{
	
	let parsedResult;
	if(searchResultsPage.classList.contains('is-active')){
	while (homePageListElem.firstChild) {
		homePageListElem.removeChild(homePageListElem.firstChild);
	}

	let searchTerm = searchBox.value;
	console.log("search term",searchTerm);

	const searchURL = `https://shazam.p.rapidapi.com/search?term=${searchTerm}&locale=en-US&offset=0&limit=5`;
	console.log("search url", searchURL);
	getTracks(searchURL).then(result => {
		parsedResult = JSON.parse(result);
		console.log(parsedResult['tracks']);
		parsedResult = addSongsToUI(parsedResult,'searchresults');
	  })
	  .then(() => {
		const songElements = document.querySelectorAll('.music__list-item');
		addSongClickEvents(songElements, parsedResult,'searchresults');
	  })
	  .catch(error => {
		console.error(error);
	  });
} };
// Listen for changes in searchResultsPage's classList

const searchObserver = new MutationObserver(handleSearchResultsPage);
searchObserver.observe(searchResultsPage,observerOptions);