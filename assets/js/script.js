


const imdb = (function () {

    var searchResult = [];

    var topMovies = ["tt0371746","tt11866324","tt0078346","tt0096895","tt6443346","tt0974015"];

    const searchInput = document.querySelector('#search');
    const preResult = document.querySelector('.pre-search-result');

    const searchBtn = document.querySelector('#searchMovie');

    const movieList = document.querySelector('.movie-list');

    const movieDetailsSection = document.querySelector('.movie-details-bg');

    const watchList = document.querySelector('.watchlist');

    const overlay = document.querySelector('.overlay');
    const overlayMsg = document.querySelector('.overlay-msg-inner');

    // for show overlay message
    function showOverlay(msg) {
        overlay.style.display = "flex";
        overlayMsg.innerHTML = msg;
    }

    // to close overlay message
    function hideOverlay() {
        overlay.style.display = "none";
    }

    // to initialize value of localstorage for watchlist
    function initializeLocalStorage() {
        list = [];
        if (localStorage.getItem("list") == undefined) {
            localStorage.setItem("list", JSON.stringify(list));
        }
        return;

    }
    initializeLocalStorage();

    // to check same object contained in array or not
    function containsObject(obj, list){
        for(let i=0; i<list.length; i++){
            if(obj.imdbID === list[i].imdbID){
                return true;
            }
        }
        return false;
    }

    // events for searching the movie
    function keyEvent(e) {
        let query = e.target.value;
        if (query == '') {
            preResult.style.display = 'none';
            return;
        }
        const response = getMoviesByTitle(query);
        response.then(function (data) {
            if (data.Response == 'True') {
                if(!containsObject(data,searchResult)){
                    searchResult.push(data);
                }    
            }
            preResult.style.display = "block";
            let ul = document.querySelector('#pre-result-list');
            let li = document.createElement('li');
            if (data.Response == "False") {
                ul.innerHTML = '';
                li.innerHTML = `<li>${data.Error}</li>`;
                ul.append(li);
                return;
            }

            ul.innerHTML = '';

            li.innerHTML = `<li class='pre-result-item'><img src='${data.Poster}' class='pre-search-item-img' />${data.Title}</li>`;
            ul.append(li);
        }).catch(function (error) {
            console.log(error);
        });
    }

    // to search the movie by movie title
    async function getMoviesByTitle(query) {
        try {
            const response = await fetch('https://omdbapi.com/?t=' + query + '&plot=full&apikey=c933b829');
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }


    // to search the movie by movie id
    async function getMoviesById(id) {
        try {
            const response = await fetch('https://omdbapi.com/?i=' + id + '&plot=full&apikey=c933b829');
            const data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    // to render the search result after search the movie
    function renderSearchResult(movie) {
        if(searchResult.length == 0){
            if(movie.Response == 'True'){
                searchResult.push(movie);
            }
            
        }
        console.log(searchResult);
        movieList.innerHTML = '';

        for (let i = 0; i < searchResult.length; i++) {
            let movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `<div class="movie-header">
                                    <a href="movie.html?id=${searchResult[i].imdbID}"><img src="${searchResult[i].Poster=='N/A'?'./assets/images/no_image_new.png':searchResult[i].Poster}" class="movie-img"></a>
                                    <i class="bookmark fa-solid fa-bookmark" data-id="${searchResult[i].imdbID}" title="Add To Watchlist"></i>
                                </div>
                                <div class="movie-body">
                                    <div class="movie-rating"><i class="fa-solid fa-star"></i> <span>${searchResult[i]?.Ratings[0]?.Value||'N/A'}</span></div>
                                    <div class="movie-title">${searchResult[i].Title}</div>
                                    <a href="movie.html?id=${searchResult[i].imdbID}"><button class="wathlist-btn mt-4">Watch Options</button></a>
                                    <div class="movie-information">
                                        <span class="trailor"><i class="fa-solid fa-play ms-3"></i>Trailor</span>
                                        <a href="movie.html?id=${searchResult[i].imdbID}"><i class="fa-solid fa-circle-info"></i></a>
                                    </div>
                                </div>`;
            movieList.append(movieItem);
        }
        searchResult = [];
        
    }


    // to render the movie full information on movie details page
    function renderMovieInformation(movie) {
        let poster = `url(${movie.Poster});`;
        let genres = movie.Genre.split(",");
        console.log(genres);
        let genreText = '';
        for(let i=0; i<genres.length; i++){
            genreText += '<div class="tag">'+genres[i]+'</div>';
        }

        let ratings = '';
        for (let i = 0; i < movie.Ratings.length; i++) {
            ratings += `<div class="rating">
            <h4>${movie.Ratings[i].Source}</h4>
            <div class="movie-rating-details"><i class="fa-solid fa-star"></i> <span>${movie.Ratings[i].Value}</span>
            </div>
        </div>`
        }
        movieDetailsSection.innerHTML = `<div class="movie-details-bg" style="background-image: url(${movie.Poster=='N/A'?'./assets/images/no_image_new.png':movie.Poster});"> <div class="transbox py-5">
                                    <div class="container">
                                        <div class="movie-details-section">
                                            <div class="movie-details-heading">
                                                <div class="movie-title">
                                                    <h2>${movie.Title}</h2>
                                                    <ul class="presentation">
                                                        <li>${movie.Type}</li>
                                                        <li>${movie.Year}</li>
                                                        <li>${movie.Rated}</li>
                                                        <li>${movie.Runtime}</li>
                                                        <li><i class="add-to-watchlist fa-solid fa-bookmark" title="Add To Watch List" data-id="${movie.imdbID}"></i></li>
                                                    </ul>
                                                </div>
                                                <div class="movie-ratings">
                                                    `+ ratings + `
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-3 g-0 mt-1">
                                                    <img src="${movie.Poster=='N/A'?'./assets/images/no_image_new.png':movie.Poster}" class="img-poster">
                                                </div>
                                                <div class="col-md-6 mt-1 g-0">
                                                    <div class="video-box">
                                                        <h2>Video Playback Not Supported By API</h2>
                                                    </div>
                                                </div>
                                                <div class="col-md-3 g-0">
                                                    <div class="video-count">
                                                        <span>8 Videos</span>
                                                    </div>
                                                    <div class="photo-count">
                                                        10 Photos
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="row">
                                                <div class="col-md-8">
                                                    <div class="genere-tags">
                                                        `+genreText+`
                                                    </div>
                                                    <div class="movie-details-list">
                                                        <div class="movie-detail-item">
                                                            <p>${movie.Plot}</p>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Director</b>
                                                            <span class="me-5">${movie.Director}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Stars</b>
                                                            <span class="me-5">${movie.Actors}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Country/Region</b>
                                                            <span class="me-5">${movie.Country}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Release</b>
                                                            <span class="me-5">${movie.Released}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Genre</b>
                                                            <span class="me-5">${movie.Genre}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Collection</b>
                                                            <span class="me-5">${movie.BoxOffice}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>Writer</b>
                                                            <span class="me-5">${movie.Writer}</span>
                                                        </div>
                                                        <div class="movie-detail-item">
                                                            <b>IMDb Votes</b>
                                                            <span class="me-5">${movie.imdbVotes}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-md-4">
                                                    
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div></div>`;

        movieDetailsSection.style.background = poster;
    }


    // to search the movie by its title
    function searchMovie(title) {
        const response = getMoviesByTitle(title);
        response.then(function (data) {
            console.log(data);
            renderSearchResult(data);
        });
    }


    // to add the movie id to watchlist
    function addToWatchList(movieId) {
        if(movieId == null || movieId == ''){
            return;
        }
        let list = JSON.parse(localStorage.getItem("list"));
        if (!list.includes(movieId)) {
            list.push(movieId);
            localStorage.setItem("list", JSON.stringify(list));
            return "Added To Watch List";
        }
        return "Movie Already Added To Watch List";
    }

    // to remove the movie  from the watchlist from localstorage
    function removeFromWatchList(movieId) {
        let list = JSON.parse(localStorage.getItem("list"));
        let index = list.indexOf(movieId);
        if (index >= 0) {
            list.splice(index, 1);
            localStorage.setItem("list", JSON.stringify(list));
            return "Movie Removed From Watchlist";
        }
        return "Movie Doesnt't Exits";


    }


    // to fetch the all result watchlist from api
    async function getWatchList() {
        let result = new Array();
        let list = JSON.parse(localStorage.getItem("list"));
        console.log(list);
        for (let i = 0; i < list.length; i++) {
            let response = await getMoviesById(list[i]);
            if (response.Response === 'True') {
                result.push(response);
            }
        }
        return result;
    }

    // to get the top movies from api
    async function getTopMovies(){
        let result = new Array();
        for (let i = 0; i < topMovies.length; i++) {
            let response = await getMoviesById(topMovies[i]);
            if (response.Response === 'True') {
                result.push(response);
            }
        }
        return result;
    }
    // to render the top movies on hompage
    async function renderTopMovies(){
        let movies = await getTopMovies();

        let topMovies = document.querySelector('#top-movies');
        topMovies.innerHTML = '';

        for (let i = 0; i < movies.length; i++) {
            let movieItem = document.createElement('div');
            movieItem.classList.add('movie-item');
            movieItem.innerHTML = `<div class="movie-header">
                                    <a href="movie.html?id=${movies[i].imdbID}"><img src="${movies[i].Poster=='N/A'?'./assets/images/no_image_new.png':movies[i].Poster}" class="movie-img"></a>
                                    <i class="bookmark fa-solid fa-bookmark" data-id="${movies[i].imdbID}" title="Add To Watchlist"></i>
                                </div>
                                <div class="movie-body">
                                    <div class="movie-rating"><i class="fa-solid fa-star"></i> <span>${movies[i]?.Ratings[0]?.Value||'N/A'}</span></div>
                                    <div class="movie-title">${movies[i].Title}</div>
                                    <a href="movie.html?id=${movies[i].imdbID}"><button class="wathlist-btn mt-4">Watch Options</button></a>
                                    <div class="movie-information">
                                        <span class="trailor"><i class="fa-solid fa-play ms-3"></i>Trailor</span>
                                        <a href="movie.html?id=${movies[i].imdbID}"><i class="fa-solid fa-circle-info"></i></a>
                                    </div>
                                </div>`;
            topMovies.append(movieItem);
        }
    }
    // to render the watchlist data on watchlist page
    async function renderWatchList() {
        window.addEventListener('click', eventClickHandler);


        let movies = await getWatchList();

        if (movies.length == 0) {
            watchList.innerHTML = '<h1>Sorry! No Data Found.</h1>';
            return;
        }
        watchList.innerHTML = '';
        for (let i = 0; i < movies.length; i++) {
            let watchListItem = document.createElement('div');
            watchListItem.classList.add('watchlist-item');
            watchListItem.innerHTML = `<div class="watchlist-item-image">
                            <img src="${movies[i].Poster=='N/A'?'./assets/images/no_image_new.png':movies[i].Poster}" >
                            <div class="watchlist-item-info">
                                <h2 class="watchlist-item-title">${movies[i].Title}</h2>
                                <p class="watchlist-item-year">${movies[i].Released}</p>
                                <p class="watchlist-item-genre">${movies[i].Genre}</p>
                                <p class="watchlist-item-ratings"><i class="fa-solid fa-star"></i> <span>${movies[i]?.Ratings[0]?.Value||'N/A'}</span></p>
                            </div>
                        </div>
                        <div class="watchlist-item-options">
                            <i class="remove fa-solid fa-trash" data-id="${movies[i].imdbID}"></i>
                            <a href="movie.html?id=${movies[i].imdbID}" data-id="${movies[i].imdbID}"><i class="fa-solid fa-circle-info"></i></a>
                        </div>`;
            watchList.append(watchListItem);
        }
        return;

    }



    // click event handler for various functionalities
    function eventClickHandler(e) {
        console.log(e.target);
        let element = e.target;
        if (element.className == 'pre-result-item') {
            let value = element.childNodes[1].textContent;
            console.log(value);
            searchInput.value = value;
            preResult.style.display = "none";
            return;
        }


        // event for search the movie
        if (element.id == 'searchMovie') {
            preResult.style.display = "none";
            let query = searchInput.value;
            query = query.toLowerCase();
            searchMovie(query);
            return;

        }

        // event for adding the movie to watchlist
        if (element.classList[0] == 'bookmark' || element.classList[0] == 'add-to-watchlist') {
            let bookmark = element;
            let movieId = bookmark.dataset.id;
            let result = addToWatchList(movieId);
            showOverlay(result);
            return;
        }

        // event for removing the movie from watchlist
        if (element.classList[0] == 'remove') {
            console.log(element);
            let movie = element;
            let movieId = movie.dataset.id;
            let result = removeFromWatchList(movieId);
            renderWatchList();
            showOverlay(result);
            return;

        }

        // event for close the overlay message
        if (element.classList[0] == 'close') {
            hideOverlay();
        }

    }


    // main function called for getting movie information on movie details page
    function getMovieDetails() {
        window.addEventListener('click', eventClickHandler);
        let urlString = window.location;
        let url = new URL(urlString);
        let id = url.searchParams.get('id');
        const response = getMoviesById(id);
        response.then(function (data) {
            console.log(data);
            renderMovieInformation(data);
        });

    }

    // for initialize the main functionality of website
    function initialize() {
        window.addEventListener('click', eventClickHandler);
        searchInput.addEventListener('keyup', keyEvent);
        renderTopMovies();

    }

    return {
        init: initialize,
        getMovieDetails: getMovieDetails,
        renderWatchList: renderWatchList

    };
})();


