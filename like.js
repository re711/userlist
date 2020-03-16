(function () {
    const BASE_URL = 'https://movie-list.alphacamp.io'
    const INDEX_URL = BASE_URL + '/api/v1/movies/'
    const POSTER_URL = BASE_URL + '/posters/'
    const dataPanel = document.getElementById('data-panel')
    const data = JSON.parse(localStorage.getItem('favoriteUsers')) || []
  
    displayDataList(data)

    function displayDataList (data) {
        let htmlContent = ''
        data.forEach(function (item, index) {
          htmlContent += `
            <div class="col-sm-3">
            <div class="card mb-2 ">
                <img  class="card-img-top" src="${item.avatar}" alt="Card image cap">
                <div class="card-body user-item-body">                       
                  <h5 class="text-center" style="width: auto;">${item.name}</h5>
                </div>
                
                <!-- "Details" button -->
                <div class="card-footer">               
                <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
                </div>    
            </div>
        </div>
      `
        })
        dataPanel.innerHTML = htmlContent
    }

    dataPanel.addEventListener('click', (event) => {
        if (event.target.matches('.btn-show-user')) {
          showMovie(event.target.dataset.id)
        } else if (event.target.matches('.btn-remove-favorite')) {
          removeFavoriteItem(event.target.dataset.id)
        }
    })

    function removeFavoriteItem (id) {
        const index = data.findIndex(item => item.id === Number(id))
        if (index === -1) return

        data.splice(index, 1)
        localStorage.setItem('favoriteUsers', JSON.stringify(data))

        displayDataList(data)
    }
})()