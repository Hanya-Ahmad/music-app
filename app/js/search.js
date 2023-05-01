const searchBox = document.querySelector('#search-box input');
const searchDiv = document.querySelector('#search-box');
let dropdown;
const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': '624be265cfmshb898fc9de602961p1563a7jsn5d5c9ab74c77',
		'X-RapidAPI-Host': 'shazam.p.rapidapi.com'
	}
};

searchBtn.addEventListener('click', () => {
	// discoverPage.classList.remove('is-active');

    // searchResultsPage.classList.add('is-active');
	if(searchResultsPage.classList.contains('is-active')){
		console.log("ELSE0");
		while (homePageListElem.firstChild) {
		
			homePageListElem.removeChild(homePageListElem.firstChild);
		}
	if(dropdown){
	dropdown.classList.toggle("show");
	}
    let searchTerm = searchBox.value;
    console.log("search term",searchTerm);

    const searchURL = `https://shazam.p.rapidapi.com/search?term=${searchTerm}&locale=en-US&offset=0&limit=5`;
    console.log("search url", searchURL);
    getSearchResults(searchURL);
}
});
async function getSearchResults(searchURL){
try {
	searchDiv.style.display = 'block';
	const response = await fetch(searchURL, options);
	const result = await response.json();
    // console.log("search result:");
	console.log(result);
	let tracks = result.tracks.hits;
	let div = document.createElement("div");
	let listItem=document.createElement("li");
	let span= document.createElement("span");
	let image;

	// dropdown = document.createElement("div");
	// dropdown.classList.add("dropdown");
	// dropdown.classList.add("show");

	tracks.forEach(track => {
	if(track.track.images){
	let title = track.track.title;
	let subtitle = track.track.subtitle;
	let coverart = track.track.images.coverart;
	let uri = track.track.hub.actions[1].uri;
	image = document.createElement("img");
	image.setAttribute('src',coverart);
	listItem.innerHTML = title;
	
	span.innerHTML = subtitle;


	div.setAttribute('class','bg_div');
	listItem.setAttribute('class','music__list-item');
	listItem.setAttribute('id',track.track.key);
	span.setAttribute('class','song__creator');
	homePageListElem.appendChild(div);
	div.appendChild(listItem)
	listItem.appendChild(image);
	listItem.appendChild(span);
	}
	
	});



	// searchDiv.appendChild(dropdown);
} catch (error) {
	console.error(error);
}
}

