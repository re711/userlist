(function () {
    const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
    const INDEX_URL = BASE_URL + '/api/v1/users/'
    const data = []
    const dataPanel = document.getElementById('data-panel')
    const searchForm = document.getElementById('search')
    const searchInput = document.getElementById('search-input')
    const pagination = document.getElementById('pagination')
    const ITEM_PER_PAGE = 12
    let paginationData = []
    const switchmode = document.getElementById('switch-Mode')
      
    axios.get(INDEX_URL)
    .then((response) => {
        data.push(...response.data.results)
        displayDataList(data)
        getTotalPages(data)
        getPageData(1, data)
    })
    .catch((err) => console.log(err))

    dataPanel.addEventListener('click', event => {
        if(event.target.matches('.btn-show-user')){
            showUser(event.target.dataset.id) 
            console.log(event.target.matches)
        } else if (event.target.matches('.btn-add-favorite')) {
            console.log(event.target.dataset.id)
            addFavoriteItem(event.target.dataset.id)
        }
    })
  
  //搜尋
    searchForm.addEventListener('submit', event => {
        event.preventDefault()
        let input = searchInput.value.toLowerCase()
        let results = data.filter(
            user => user.name.toLowerCase().includes(input)
        )
        console.log(results)
        getTotalPages(results)
        getPageData(1, results)
    })

   pagination.addEventListener('click', event => {
      console.log(event.target.dataset.page)
      if (event.target.tagName === 'A') {
        getPageData(event.target.dataset.page)
    }
   })  
     
  switchmode.addEventListener('click', event => {
    if (event.target.matches('#males')) {
        let males = data.filter(user => user.gender === "male")              
        getTotalPages(males)
        displayDataList(males)
        getPageData(1, males)
    } else if (event.target.matches('#females')) {
        let females = data.filter(user => user.gender === 'female')
        getTotalPages(females)
        displayDataList(females)
        getPageData(1, females)
    } else if (event.target.matches('#everyone')) {
        getTotalPages(data)
        displayDataList(data)
        getPageData(1, data)
    }               
  })
  
  
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
                      
                       <button class="btn btn-primary btn-show-user"data-toggle="modal" data-target="#show-user-modal" data-id="${item.id}">Details</button>
                       
                       <button class="btn btn-danger btn-add-favorite" data-id="${item.id}">Like</button>
                    </div>    
                </div>
            </div>
            `
        })
        dataPanel.innerHTML = htmlContent
    }
   
    function showUser(id) {
        const modalTitle = document.getElementById('show-user-title')
        const modalImage = document.getElementById('show-user-image')
        const modalData = document.getElementById('show-user-date')
        const modalDescription = document.getElementById('show-user-description')
        const url = INDEX_URL + id
        console.log(url)

        axios.get(url).then((response) => {
            const data = response.data
            console.log(data)
            modalTitle.textContent = `${data.name} ${data.surname}`
            modalImage.innerHTML = `
            <img src="${data.avatar}" class="img-fluid"
            alt="Responsive image">
            `
            modalData.innerHTML = `Release at : ${data.updated_at}`
            modalDescription.innerHTML = `
              <ul class="col-6 list-group list-group-flush">            
                <li class="list-group-item"><strong>Gender :</strong> ${data.gender}</li>
                <li class="list-group-item"><strong>Age :</strong> ${data.age}</li>
                <li class="list-group-item"><strong>Region :</strong> ${data.region}</li>
                <li class="list-group-item"><strong>Birthday :</strong> ${data.birthday}</li>
                <li class="list-group-item"><strong>Email :</strong> ${data.email}</li>
              </ul>
            </div>
            `            
        }).catch((err) => console.log(err))
    }
  
  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }
      
 function getPageData (pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  } 

  function addFavoriteItem(id) {
        const list = JSON.parse(localStorage.getItem('favoriteUsers')) || []
        const user = data.find(item => item.id === Number(id))

        if (list.some(item => item.id === Number(id))) {
            alert(`${user.name} is alerady in your Like list.`)
        } else {
            list.push(user)
            alert(`added ${user.name} to your Like list.`)
        }
        localStorage.setItem('favoriteUsers', JSON.stringify(list))
    }

      
  
})()