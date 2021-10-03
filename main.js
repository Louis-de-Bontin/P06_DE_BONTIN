let linkBestMovie = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=";

let linkBestMovies = "http://localhost:8000/api/v1/titles/?actor=&actor_contains=&company=&company_contains=&country=&country_contains=&director=&director_contains=&genre=&genre_contains=&imdb_score=&imdb_score_max=&imdb_score_min=&lang=&lang_contains=&max_year=&min_year=&rating=&rating_contains=&sort_by=-imdb_score&title=&title_contains=&writer=&writer_contains=&year=&page="
let linkBestThriller = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=thriller&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=&page=";
let linkBestHistory = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=history&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=&page=";
let linkBestScifi = "http://localhost:8000/api/v1/titles/?year=&min_year=&max_year=&imdb_score=&imdb_score_min=&imdb_score_max=&title=&title_contains=&genre=sci-fi&genre_contains=&sort_by=-imdb_score&director=&director_contains=&writer=&writer_contains=&actor=&actor_contains=&country=&country_contains=&lang=&lang_contains=&company=&company_contains=&rating=&rating_contains=&page=";

let bestMoviesInfo = [linkBestMovies, "group_best"];
let bestThrillerInfo = [linkBestThriller, "group_thriller"];
let bestHistoryInfo = [linkBestHistory, "group_history"];
let bestScifiInfo = [linkBestScifi, "group_scifi"];

let moviesInfos = [bestMoviesInfo, bestThrillerInfo, bestHistoryInfo, bestScifiInfo];

// Fonction qui prend en paramètre l'ID du film sur lequel l'utilisateur a cliqué.
// Elle fait un requette au serveur et puis affiche les information nécessaires dans
// une modale.
async function modalMaker(clickedId){
    await fetch("http://localhost:8000/api/v1/titles/" + clickedId)
        .then(response => response.json())
        .then(response => {
            let modal = document.getElementById("modal");
            let modal_content = `
            <div id="modal_content">
                <span id="close">&times;</span>
                <h3>${response.title}</h3>
                <h4>Genres : ${response.genres}</h4>
                <h4>Année de sortie : ${response.year}</h4>
                <h4>Score du publique : ${response.votes}</h4>
                <h4>Score imdb : ${response.imdb_score}</h4>
                <h4>Réalisateur : ${response.directors}</h4>
                <h4>Acteurs : ${response.actors}</h4>
                <h4>Durée : ${response.duration}min</h4>
                <h4>Pays d'origine : ${response.countries}</h4>
                <h4>Box office : ${response.usa_gross_income}$</h4>
                <h4>Résumé : ${response.description}</h4>
            </div>
            `;
            modal.innerHTML = modal_content;
            modal.style.display = "block";

            let span = document.getElementById("close");
            span.onclick = function(){
                modal.style.display = "none";
            }
            window.onclick = function(event){
                if (event.target == modal) {
                    modal.display = "none";
                }
            }
        })
}

// Cette fonction crée la portion réservée au meilleur film
async function fetch_best_movie(linkBestMovie){
    fetch(linkBestMovie)
        .then(response => response.json())
        .then(response => {
            let dataFilm = response.results[0];
            let contentImg = `<img src="${dataFilm.image_url}" onClick="modalMaker(this.id)" class="best_movie_img" id="${dataFilm.id}">`;
            let divBestMovieImg = document.getElementById("best_movie_img_container")
            let divBestMovieInfos = document.getElementById("best_movie_infos");
            let contentInfos = `
                <p id="title">${dataFilm.title}</p>
                <p>De : <br>${dataFilm.directors}</p>
                <p>Avec : <br>${dataFilm.actors}</p>
            `;
            divBestMovieImg.innerHTML = contentImg;
            divBestMovieInfos.innerHTML = contentInfos;
        })
}

// Fonction async qui récupère 7 films
async function fetch7Movies(link){
    let movies = [];
    let link1 = link + "1";
    let link2 = link + "2";

    // Le link1 va chercher tous les films (5) de la page 1
    await fetch(link1)
        .then(response => response.json())
        .then(response => {
            for (let result of response.results){
                movies.push(result);
            }
        })
        .then(
            // Le link2 va chercher tous les films (5) de la page 2
            await fetch(link2)
                .then(response => response.json())
                .then(response => {
                    for (let result of response.results){
                        movies.push(result);
                    }
                    let i = 0;
                    // Je retire les 3 derniers afin qu'il n'en reste que 7
                    while (i < 3) {
                        movies.pop();
                        i ++;
                    }
                    
                })
        )
    return movies;
}

// Cette fonction écrit les flèches ainsi qu'une div qui accueillera les films
function write_arrows (carouselContainer, id){
    let div_id = "film_container_" + id;
    let content = `
    <button class="left_arrows" id="left_${id}"></button>
    <div class="carousel_images" id="${div_id}"></div>
    <button class="right_arrows" id="right_${id}"></button>
    `
    carouselContainer.innerHTML = content;
    return div_id;
}

// Cette fonction insère les films dans la div créée dans la fonction write_arrows
// Elle prend en paramètre les films à montrer ainsi que la div qui va les acueillir
function show_movies (moviesContainerid, movies_to_show) {
    let content = ``;
    let moviesContainer = document.getElementById(moviesContainerid);
    for (let movie of movies_to_show) {
        content += `
        <div class="carousel_square" onClick="modalMaker(this.id)" id="${movie.id}">
            <img class="movie_cover" src="${movie.image_url}">
            <h5>${movie.title}</h5>
        </div>
        `;
    }
    moviesContainer.innerHTML = "";
    moviesContainer.innerHTML += content;
}

// Cette fonction modifie les films à afficher grâce à de nouveaux index calculés soit dans la
// fonction carouselTurnLeft soit dans la fonction carouselTurnRight. Puis appel la fonction
// show_movies
function turnCarousel(newIndex, sevenMovies, carouselId){
    let moviesToShow = [
        sevenMovies[newIndex[0]],
        sevenMovies[newIndex[1]],
        sevenMovies[newIndex[2]],
        sevenMovies[newIndex[3]],
    ]
    let moviesContainerId = "film_container_" + carouselId;
    show_movies(moviesContainerId, moviesToShow)
}

// Calcule de nouveaux index qui correspondes aux index des films à montrer au sein de l'array
// de 7 films. Cette fonction crée l'évennement du carousel lors du clique sur la flèche de gauche
// turnCarousel est ensuite appelée avec les nouveaux index, l'array avec tous les films, et l'id
// du carousel sur lequelle elle travaille.
function carouselTurnLeft(leftArrowId, sevenMovies, carouselId){
    let newIndex = [0, 1, 2, 3];
    let clickableLeftArrow = document.getElementById(leftArrowId);
    clickableLeftArrow.addEventListener("click", function(){
        let i = 0;
        while (i<4){
            newIndex[i] -= 1;
            if (newIndex[i] < 0){
                newIndex[i] = 6;
            }
            i++;
        }
        turnCarousel(newIndex, sevenMovies, carouselId);
    })
}

// Calcule de nouveaux index qui correspondes aux index des films à montrer au sein de l'array
// de 7 films. Cette fonction crée l'évennement du carousel lors du clique sur la flèche de droite
// turnCarousel est ensuite appelée avec les nouveaux index, l'array avec tous les films, et l'id
// du carousel sur lequelle elle travaille.
function carouselTurnRight(rightArrow, sevenMovies, carouselId){
    let newIndex = [0, 1, 2, 3];
    let clickableRightArrow = document.getElementById(rightArrow);
    clickableRightArrow.addEventListener("click", function(){
        let i = 0;
        while(i<4){
            newIndex[i] += 1;
            if (newIndex[i] > 6){
                newIndex[i] = 0;
            }
            i++;
        }
        turnCarousel(newIndex, sevenMovies, carouselId);
    })
}

// Cette fonction est le coeur du programe, elle appel la fonction fetch7movies, afin de récupérer
// les données nécessaires à la création d'un carouseil, puis appel la fonction show_movies afin
// d'afficher le carousel de base, avec les 4 premiers films.
async function display_carousel(infos) {
    let movies = [];
    let movies_to_show = [];

    await fetch7Movies(infos[0])
        // Après avoir récupéré mes 7 films :
        .then(new_movies => {
            movies = new_movies;
            // Les 4 premiers films sont séléctionnés comme étant à montrer
            movies_to_show = [movies[0], movies[1], movies[2], movies[3]];

            let carouselContainer = document.getElementById(infos[1]);
            // La fonction write_arrows écris les flêches et renvoi la dic accueillant les films
            let moviesContainerId = write_arrows(carouselContainer, infos[1]);
            show_movies(moviesContainerId, movies_to_show);
            // Le 4eme élément retourné est la liste d'index correspondant aux films à montrer
            // dans la liste de tous les films
            return [movies, movies_to_show, infos[1], [0, 1, 2, 3]]
        })
        // Après avoir affiché les films et les flèches, on crée les évènements qui déclanchent le
        // carousel
        .then(data => {
            let carouselId = data[2];
            let leftArrow = "left_" + data[2];
            let rightArrow = "right_" + data[2];
            carouselTurnLeft(leftArrow, movies, carouselId);
            carouselTurnRight(rightArrow, movies, carouselId);
        })
}

fetch_best_movie(linkBestMovie); // Je crée l'affiche pour le meilleur film
for (infos of moviesInfos){ // J'itère mes carousels
    display_carousel(infos); // Une fonction asynchrone qui ecrit le html
}
