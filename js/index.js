const hideErrorDiv = () => {
    $('#error').hide()
}

const showErrorDiv = () => {
    $('#error').show()
}

const hideMoviesDiv = () => {
    $('#movies').hide()
}

const showMoviesDiv = () => {
    $('#movies').show()
}

$(document).ready(() => {
    hideErrorDiv()
    $('#searchForm').on('submit', (e) => {
        let searchText = $('#searchText').val()
        getMovies(searchText, undefined)
        e.preventDefault()
    })

})

$("#searchText").autocomplete({
    source: (request, response) => {
        getAutoCompleteMovies(request.term, response)
    },
    select: (event, ui) => {
        $('#searchText').val(ui.item.value);
        $('#searchForm').submit()
    },
    classes: {
        "ui-autocomplete": "ui-visual-focus"
    },
    minLength: 2
});


const getAutoCompleteMovies = (searchText, callback) => {
    let url = `${urlOMDB}s=*${searchText}*`
    axios.get(url)
        .then((response) => {
            //console.log(response)
            let resultSearch = response.data

            if (resultSearch.Response == 'True') {
                let mapped = resultSearch.Search.map((e) => {
                    return e.Title
                })
                callback(mapped)
            } else {
                callback([])
            }
        })
        .catch((err) => {
            console.log(err)
            callback([])
        })
}

const getMovies = (searchText, page) => {
    let url = `${urlOMDB}s=${searchText}${(page != undefined ? '&page=' + page : '')}`
    hideErrorDiv()
    hideMoviesDiv()
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
                  <p>${movie.Title}</p>
                  <p>${movie.Year}</p>
                  <a href="movie.html?movieId=${movie.imdbID}" class="btn btn-primary" target="_blank">Mais Detalhes...</a>
                </div>
              </div>
            `
                })

                $('#movies').html(output)
                showMoviesDiv()

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
                        onPageClick: (event, page) => {
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
                showErrorDiv()
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
            showErrorDiv()
        })
}