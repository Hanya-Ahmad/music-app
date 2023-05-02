import { getTracks, addSongsToUI,searchResultsPage,observerOptions, homePageListElem, addSongClickEvents  } from "./index.js";
const searchBox = document.querySelector('#search-box input');

// Hide search results when input is empty
searchBox.addEventListener('input', () => {
	if (searchBox.value.trim() === '') {
	  searchResultsPage.classList.add('hidden');
	} 
	
  });
const handleSearchResultsPage = ()=>{	
	let parsedResult;
	if(searchResultsPage.classList.contains('is-active')){
	while (homePageListElem.firstChild) {
		homePageListElem.removeChild(homePageListElem.firstChild);
	}
	// while(sea)

	let searchTerm = searchBox.value;
	const searchURL = `https://shazam.p.rapidapi.com/search?term=${searchTerm}&locale=en-US&offset=0&limit=5`;
	getTracks(searchURL).then(result => {
		parsedResult = JSON.parse(result);
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

