// Render to user functions
function renderBooks() {
  const books = getBooks()

  const strHTMLs = books.map(
    book => `
          <tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.price}$</td>
            <td>
              <button 
              onclick="onReadBook('${book.id}')" 
              class="btn btn-read">Read</button>
              <button 
              onclick="onOpenUpdateModal('${book.id}')"  
              class="btn btn-update">Update</button>
              <button '
              onclick="onRemoveBook('${book.id}')" class="btn btn-delete">Delete</button>
            </td>
          </tr>`
  )

  const elBooks = document.querySelector('.books-list')
  elBooks.innerHTML = strHTMLs.join('')
  renderPagesBtns()
}

function renderPagesBtns() {
  // get current num of pages
  const pages = getPagesNum()

  let strHTMLs = ''
  for (let i = 0; i <= pages; i++) {
    strHTMLs += `<button class="btn btn-page" data-page="${i}" onclick="onSetPage(${i})">${
      i + 1
    }</button>`
  }

  document.querySelector('.btns-pages').innerHTML = strHTMLs

  // Render curr page
  const currPage = getPageIdx()

  document
    .querySelector(`[data-page="${currPage}"]`)
    .classList.add('selected-page')
}

function renderFilterByQueryStringParams() {
  // Retrieve data from the current query-params
  const queryStringParams = new URLSearchParams(window.location.search)

  const filterBy = {
    price: +queryStringParams.get('price') || 0,
    rate: +queryStringParams.get('rate') || 0,
    txt: queryStringParams.get('txt'),
  }

  // handle when modal was open on specific book by id
  const bookId = queryStringParams.get('id')
  if (bookId) onReadBook(bookId)

  // return if no filter needed
  if (!filterBy.price && !filterBy.rate && !filterBy.txt) {
    return
  }

  document.querySelector('.filter-price-select').value = filterBy.price
  document.querySelector('.filter-rate-select').value = filterBy.rate
  document.querySelector('.filter-txt-input').value = filterBy.txt

  setBookFilter(filterBy)
}
