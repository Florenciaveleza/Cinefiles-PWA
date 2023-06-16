window.addEventListener("DOMContentLoaded", function () {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("sw.js")
        .then((res) => console.log("SW. Se registro correctamente"))
        .catch((err) => console.log("SW. No se pudo registrar"));
    }

    //Botón descargar

    let eventInstall;
    let btnInstall = document.querySelector(".descargar");

    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      eventInstall = e;
      showInstallButton();
    })
//NOTIFICACIONES
    const notifBtn = document.querySelector('.btnNotif');
    notifBtn.addEventListener('click', () => {
        Notification.requestPermission().then(perm => {
          if(perm === 'granted'){
            const notification = new Notification("Cinefiles", {
                body: "Aceptaste recibir notificaciones! Encontrá tus películas favoritas.",
                icon: 'icons/icon-192x192.png',
                tag: 1,
                silent: true
            })
        }
    })
})

//COMPARTIR

let btnShare = document.querySelector('.btnShare');
if(btnShare != undefined){
    console.log('test')
    if(navigator.share){

        btnShare.addEventListener('click', e => {
            let dataShare = {title: 'Cinefiles', text: 'Encontrá y guardá peliculas', url: 'http://localhost/pwa/index.html'}
            navigator.share(dataShare)
            .then(res => {
                console.log('compartir la app')
            })
        } )

    }else{
        console.log('no es compatible');
        btnShare.style.display = 'none';
    }
}

//INSTALACION
    let showInstallButton = () => {
      if(btnInstall != undefined) {
        btnInstall.style.display = "inline-block";
        btnInstall.addEventListener("click", InstallApp)
      }
    }
    
    let InstallApp = () => {
      if(eventInstall) {
        eventInstall.prompt();
        eventInstall.userChoice
        .then((res) => {
          if(res.outcome == "accepted"){
            console.log("El usuario aceptó instalar la app");
            btnInstall.style.display = "none";
          }else {
            console.log("El usuario no aceptó instalar la app")
          }
        })
      }
    }

    //Local storage boton de add to list estilo css
    const buttonState = localStorage.getItem('buttonState');
    if (buttonState === 'added') {
      updateButton();
    }
});

//ONLINE / OFFLINE

let OnLineStatus = () => {
  console.log(navigator.onLine);
  if(navigator.onLine){
      console.log("estamos online");
  }else{
      console.log("estamos offline");
      let offline = document.getElementById('offline');
      let html= `
      <p>You are disconnected, but you will still be able to view the movies in your list! </p>
      `;
      offline.innerHTML = html;
  }
}

window.addEventListener('online', function () {
  console.log('online');
  OnLineStatus();
})

window.addEventListener('offline', function () {
  console.log('offline');
  OnLineStatus();
})


//Peliculas

let API_KEY = 'api_key=53a5a25aa1ddde9c01e34dbb4bbe8eba';
let BASE_URL = 'https://api.themoviedb.org/3';
const url = BASE_URL + '/discover/movie?'+ API_KEY;
let IMG = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?'+ API_KEY;
let urlString = window.location.href;
let idUrl = new URL(urlString);
let id = idUrl.searchParams.get('id');
let options = {
  method: 'GET',
  headers: {
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1M2E1YTI1YWExZGRkZTljMDFlMzRkYmI0YmJlOGViYSIsInN1YiI6IjY0NGFhYmY4YjdhYmI1MDUxOGQ5NDNkMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KcadvBiqGiqt8Ah9_QxAb1yCX-FGS38Vj_TN6K2QJfQ'
  }
};
let movieList = JSON.parse(localStorage.getItem("movieList")) || [];

//HERO

function heroSection(results) {
  let hero = document.getElementById("hero");
  const randomMovie = results[Math.floor(Math.random() * results.length)];
  const backdropURL = IMG + randomMovie.backdrop_path;
  hero.style.backgroundImage = `url("${backdropURL}")`;
}


function peliculasCatalogo(results) {
  let mostrarPeliculas = document.getElementById("mostrar");
  let html = "";
  for (const movie of results) {
    html += `<div class="card sm-img" style="width: 18rem;">
    <a href="detalles.html?id=${movie.id}"><img src="${IMG + movie.poster_path}" class="card-img-top films" alt="${movie.title}"></img></a>
  </div>
 `;
  } 
  mostrarPeliculas.innerHTML = html;
}

fetch(url, options)
.then((response) => response.json())
.then((data) => {
  console.log(data);
  heroSection(data.results);
  peliculasCatalogo(data.results);
  mostrarDetalles(id);

});

//detalles
function mostrarDetalles(id) {
  const url = BASE_URL + '/movie/' + id + '?' + API_KEY;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      let detalles = document.getElementById("detalles");
      const backdropURL = IMG + data.backdrop_path;
      detalles.style.backgroundImage = `url("${backdropURL}")`;
      let html = `
      <div class="container">
      <div class="row content-detalles d-flex align-items-center justify-content-center">
        <div class="col image-container d-flex justify-content-center">
          <img src="${IMG + data.poster_path}" alt="${data.title}" class="sm-img img-fluid">
        </div>
        <div class="col details-container mt-5 d-flex align-items-center justify-content-center">
          <div>
            <div>
              <h2>${data.title}</h2>
              <p>${data.vote_average} | Release date: ${data.release_date}</p>
            </div>
            <div>
              <p>${data.overview}</p>
            </div>
            <button id="buttonList">Add to Lists</button>
            <button id="buttonDelete">Delete</button>
          </div>
        </div>  
      </div>
    </div>
      `;
      detalles.innerHTML = html;
      //BOTON ADD TO LISTS
      let btnList = document.getElementById('buttonList');
      btnList.addEventListener('click', function(){
        if (!movieList.includes(id)) {
          movieList.push(id);
          btnList.classList.add('added');
          localStorage.setItem('movieList', JSON.stringify(movieList));
          localStorage.setItem('buttonState', 'added');
          updateButton();
        }
      });

      updateButton();

      function updateButton() {
        let btnList = document.getElementById('buttonList');
        let buttonState = localStorage.getItem('buttonState');
        let buttonDelete = document.getElementById('buttonDelete');
        //ADD TO LIST
        if (movieList.includes(id)) {
          btnList.classList.add('added');
          btnList.disabled = true;
          btnList.innerText = 'Added';
          buttonDelete.style.display = 'inline-block'

          //BOTON DELETE
          function deleteMovie() {
            let index = movieList.indexOf(id);
            if (index > -1) {
              movieList.splice(index, 1);
            }
            localStorage.setItem('movieList', JSON.stringify(movieList));
            buttonDelete.style.display = 'none';
            updateButton()
          }
          buttonDelete.addEventListener('click', deleteMovie);
        } else {
            btnList.classList.remove('added');
            btnList.disabled = false;
            btnList.innerText = 'Add to List';
            buttonDelete.style.display = 'none';
            buttonDelete.removeEventListener('click', deleteMovie);
        }
      }

    })

}

mostrarDetalles(id);

//Buscador
function buscador() {
  const divBuscador =document.getElementById('validarBuscador')
  const busqueda = document.getElementById('buscar');
  const searchButton = document.getElementById('searchButton');
  searchButton.addEventListener('click', function(){
  const searchTerm = busqueda.value;
  const search = searchURL + '&query=' + searchTerm;
  console.log(search);
  fetch(search, options)
  .then((response) => response.json())
  .then((data) => {
    peliculasCatalogo(data.results);
    })

    if(searchTerm == '') {
      let html = `
      <p>You must search for a movie, go back to the  <a href="index.html">home page<a></p>
      `;
      divBuscador.innerHTML = html;
    }
})
}
buscador()
