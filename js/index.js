$(document).ready(() => {
    $('#error').hide()
    $('#searchForm').on('submit', (e) => {
      let searchText = $('#searchText').val()
      getMovies(searchText, undefined)
      e.preventDefault()
    })
  
  })
  
  function getMovies(searchText, page) {
    let url = urlOMDB + 's=' + searchText + (page != undefined ? '&page=' + page : '')
    $('#error').hide()
    $('#movies').hide()
    axios.get(url)
      .then((response) => {
        console.log(response)
        let resultSearch = response.data
  
        if (resultSearch.Response == 'True') {
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
          $('#movies').show()
  
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
        } else {
          let output = `
              <p>Houve um erro ao fazer a busca...</p>
              <p>${resultSearch.Error}</p>`
          $('#error').html(output)
          $('#error').show()
          try {
            $('#pagination').empty();
  
            $('#pagination').removeData("twbs-pagination");
  
            $('#pagination').unbind("page");
          } catch (error) {
            console.log(error)  
          }
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
        $('#error').html(output)
        $('#error').show()
      })
  }