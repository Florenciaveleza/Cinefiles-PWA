const urlFind = BASE_URL + '/movie/' + id + '?' + API_KEY;
const listStorage = localStorage.getItem('movieList');
const listArray = JSON.parse(listStorage);
let listaSection = document.getElementById('MoviesList')

function mostrarLista() {
  listArray.forEach((id) => {
    const urlImages = BASE_URL + '/movie/' + id + '/images?' + API_KEY;
    fetch(urlImages, options)
    .then((response) => response.json())
    .then((data) => {
        const posterPath = data.posters[0].file_path;
        const posterURL = IMG + posterPath;
        let html = `
        <div class="gap-4 mt-5 d-flex justify-content-center col-sm-6 col-md-4 col-lg-3">
          <div class="card sm-img" style="width: 18rem;">
            <a href="detalles.html?id=${id}">
              <img src="${posterURL}" class="card-img-top films" alt="${data.title}">
            </a>
          </div>
        </div>
        `;

        listaSection.innerHTML += html;
    
  });
 });
}

document.addEventListener('DOMContentLoaded', function() {
    mostrarLista();
});

  console.log(listArray)