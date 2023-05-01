const discoverPage = document.getElementById('discover');
const searchResultsPage = document.getElementById('search-results');
const searchBtn = document.querySelector('#search-btn');

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
})