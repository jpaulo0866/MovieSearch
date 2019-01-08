const urlOMDB = 'http://www.omdbapi.com?apikey=fb0ae205&'

var resultSearch

$(document).ready(() => {
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val()
    getMovies(searchText, undefined)
    e.preventDefault()
  })

})

function getMovies(searchText, page) {
  let url = urlOMDB + 's=' + searchText + (page != undefined ? '&page=' + page : '')
  console.log(url)
  axios.get(url)
    .then((response) => {
      console.log(response)
      resultSearch = response.data
      let movies = resultSearch.Search
      let output = ''
      $.each(movies, (index, movie) => {
        output += `
          <div class="col-md-3">
            <div class="well text-center">
              <img src="${movie.Poster}">
              <p class=""><span>${movie.Title}<span></h5>
              <h5>${movie.Year}</h5>
              <a href="movie.html?movieId=${movie.imdbID}" class="btn btn-primary" href="#">Mais Detalhes...</a>
            </div>
          </div>
        `
      })

      $('#movies').html(output)

      if (page == undefined) {
        let paginationTotal = Math.round(response.data.totalResults / 10)
        $('#pagination').empty();

        $('#pagination').removeData("twbs-pagination");

        $('#pagination').unbind("page");
        
        $('#pagination').twbsPagination({
          totalPages: paginationTotal,
          visiblePages: 5,
          next: 'Next',
          prev: 'Prev',
          onPageClick: function (event, page) {
            let searchText = $('#searchText').val()
            getMovies(searchText, page)
          }
        });
      } 

    })
    .catch((err) => {
      let output = `
      <div class="col-md-3">
        <div class="well text-center">
          <p>Houve um erro ao fazer a busca...</p>
          <p>${err}</p>
        </div>
      </div>
    `
      console.log(err)
      $('#movies').html(output)
    })
}

function getMovie() {
  let movieId = getUrlParameter('movieId')

  axios.get(urlOMDB + '?plot=full&i=' + movieId)
    .then((response) => {
      console.log(response)
      let movie = response.data
      document.title = movie.Title

      let output = `
        <div class="row">
          <div class="col-md-4">
            <img src="${movie.Poster}" class="thumbnail">
          </div>
          <div class="col-md-8">
            <h2>${movie.Title}</h2>
            <ul class="list-group">
              <li class="list-group-item"><strong>Ano de lançamento:</strong> ${movie.Released}</li>
              <li class="list-group-item"><strong>Diretor(a):</strong> ${movie.Director}</li>
              <li class="list-group-item"><strong>País:</strong> ${movie.Country}</li>
              <li class="list-group-item"><strong>Tempo de Duração:</strong> ${movie.Runtime}</li>
              <li class="list-group-item"><strong>Gênero:</strong> ${movie.Genre}</li>
              <li class="list-group-item"><strong>Escritor(a):</strong> ${movie.Writer}</li>
              <li class="list-group-item"><strong>Atores/Atrizes:</strong> ${movie.Actors}</li>
            </ul>
          </div>
        </div>
        <div class="row">
          <div class="well">
            <h3>Enredo</h3>
            ${movie.Plot}
            <hr>
            <a href="http://imdb.com/title/${movie.imdbID}" target="_blank" class="btn btn-primary">Acessar IMDB</a>
            <a href="index.html" class="btn btn-default">Voltar para a Pesquisa</a>
          </div>
        </div>
      `

      $('#movie').html(output)
    })
    .catch((err) => {
      let output = `
          <div class="col-md-4">
            <p>Houve um erro ao fazer a busca...</p>
            <p>${err}</p>
          </div>
      `
      $('#movie').html(output)
      console.log(err)
    })
}