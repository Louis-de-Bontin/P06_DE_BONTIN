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
                    modal.style.display = "none";
                }
            }
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

function turn_carousel (data){
    let carouselId = data[2];
    let allMovies = data[0];
    let indexMovies = data[3];
    let leftArrows = document.getElementsByClassName("left_arrows");
    let rightArrows = document.getElementsByClassName("right_arrows");
    // for (let leftArrow of leftArrows){
    //     console.log(leftArrows.length);
    //     leftArrow.addEventListener("click", function(){
    //         let i = 0;
    //         while (i < 4){
    //             indexMovies[i]--;
    //             if (indexMovies[i] < 0){
    //                 indexMovies[i] = 6;
    //             }
    //             i++;
    //         }

    //     })
    //     movies_to_show = [allMovies[indexMovies[0]], allMovies[indexMovies[1]], allMovies[indexMovies[2]], allMovies[indexMovies[3]]];
    //     let carouselContainer = document.getElementById(carouselId);
    //     show_movies(carouselContainer, movies_to_show, carouselId);
    //     newData = [allMovies, movies_to_show, carouselId, indexMovies]
    //     turn_carousel(newData);
    // }
    // for (let rightArrow of rightArrows){
    //     rightArrow.addEventListener("click", function(){
    //         let i = 0;
    //         while (i < 4){
    //             indexMovies[i] += 1;
    //             if (indexMovies[i] > 6){
    //                 indexMovies[i] = 0;
    //             i++;
    //             }
    //         }
    //         console.log(indexMovies);
    //     })
    // }
    // movies_to_show = [allMovies[indexMovies[0]], allMovies[indexMovies[1]], allMovies[indexMovies[2]], allMovies[indexMovies[3]]];
    // let carouselContainer = document.getElementById(carouselId);
    // show_movies(carouselContainer, movies_to_show, carouselId);
    // newData = [allMovies, movies_to_show, carouselId, indexMovies]
    // turn_carousel(newData);
// }
    let arrows = [];
    arrows = Array.prototype.concat.apply(arrows, leftArrows);
    arrows = Array.prototype.concat.apply(arrows, rightArrows);
    for (let arrow of arrows){
        arrow.addEventListener("click", function(){
            let arrowId = this.id;
            if (arrowId.includes("left")){
                console.log("salut")
            } else if (arrowId.includes("right")) {
                console.log("bonjour");
            }
            // let i = 0;
            // while (i < 4){
            //     if (arrow.classList.contains("left_arrows")){
            //         indexMovies[i] -= 1;
            //         if (indexMovies[i] < 0){
            //             indexMovies[i] = 6;
            //         }
            //         i++;
            //     } else if (arrow.classList.contains("right_arrows")) {
            //         indexMovies[i] += 1;
            //         if (indexMovies[i] > 6){
            //             indexMovies[i] = 0;
            //         }
            //         i++;
            //     } else {
            //         console.log("erreur");
            //     }
            // }
            // movies_to_show = [allMovies[indexMovies[0]], allMovies[indexMovies[1]], allMovies[indexMovies[2]], allMovies[indexMovies[3]]];
            // let carouselContainer = document.getElementById(carouselId);
            // show_movies(carouselContainer, movies_to_show, carouselId);
            // newData = [allMovies, movies_to_show, carouselId, indexMovies]
            // turn_carousel(newData);
        });
    }
}

function show_movies (carouselContainer, movies_to_show, id) {
    let content = `
    <button style="background: url('icons/left_arrow.png'); background-repeat: no-repeat;" class="left_arrows" id="left_${id}"></button>
    <div class="carousel_images">
    `;
    for (let movie of movies_to_show) {
        content += `
        <div class="carousel_square" onClick="modalMaker(this.id)" id="${movie.id}">
            <img class="movie_cover" src="${movie.image_url}">
            <h5>${movie.title}</h5>
        </div>
        `;
    }
    content += `
        </div>
        <button style="background: url('icons/right_arrow.png'); background-repeat: no-repeat;" class="right_arrows" id="right_${id}"></button>
    `;
    carouselContainer.innerHTML = "";
    carouselContainer.innerHTML += content;
}

// J'itère mon objet Map pour avoir accès aux liens et aux id
async function display_carousel(infos) {
    let movies = [];
    let movies_to_show = [];

    await fetch7Movies(infos[0])
        // Après avoir récupéré mes 7 films :
        .then(new_movies => {
            movies = new_movies;
            movies_to_show = [movies[0], movies[1], movies[2], movies[3]];

            let carouselContainer = document.getElementById(infos[1]);
            show_movies(carouselContainer, movies_to_show, infos[1]);
            return [movies, movies_to_show, infos[1], [0, 1, 2, 3]]
        })
        .then(data => {
            turn_carousel(data);
        })
}

for (infos of moviesInfos){ // J'itère mes carousels
    display_carousel(infos) // Une fonction asynchrone qui ecrit le html
}

fetch(linkBestMovie)
    .then(response => response.json())
    .then(response => {
        let dataFilm = response.results[0];
        // let linkAllData = data[0].url;
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