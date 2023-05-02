import { getTracks, addSongsToUI, discoverPage, observerOptions, homePageListElem, nowPlayingImg, nowPlayingTitle, nowPlayingArtist, nowPlayingSong, addSongClickEvents} from "./index.js";
let linkElems=document.querySelectorAll('.like-icon')

const handleDiscoverPageChange = () => {
	let parsedResult;
	const url = 'https://shazam.p.rapidapi.com/charts/track?locale=en-US&pageSize=20&startFrom=0';

	if (discoverPage.classList.contains('is-active')) {
		while (homePageListElem.firstChild) {
			homePageListElem.removeChild(homePageListElem.firstChild);
		}
	  getTracks(url)
		.then(result => {
		  parsedResult = JSON.parse(result);
		  parsedResult = addSongsToUI(parsedResult,'topsongs',linkElems);
		})
		.then(() => {
		  const songElements = document.querySelectorAll('.music__list-item');
		  addSongClickEvents(songElements, parsedResult,'topsongs');
		})
		.catch(error => {
		  console.error(error);
		});
	}
  };

// Listen for changes in discoverPage's classList
const observer = new MutationObserver(handleDiscoverPageChange);
observer.observe(discoverPage,observerOptions);

// Call handleDiscoverPageChange initially to execute the code if discoverPage already has the 'is-active' class
handleDiscoverPageChange();