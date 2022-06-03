'use strict'

let gDesc = -1

function init() {
  renderFilterByQueryStringParams()
  renderBooks()
}

// handle add/remove/update book events
function onRemoveBook(bookId) {
  // Model
  removeBook(bookId)

  // DOM
  renderBooks()
}

function onAddBook(ev) {
  ev.preventDefault()

  const title = document.querySelector('[name="title"]').value
  const price = document.querySelector('[name="price"]').value

  // returns when no title input (price will generate randomaly)
  if (!title) return

  // Model
  addBook(title, price)

  // DOM
  onToggleAddModal()
  renderBooks()
}

// Show/hide custom prompts to user functions
function onToggleAddModal() {
  const elInput = document.querySelector('.add-book')

  elInput.classList.toggle('open')
}

function onOpenUpdateModal(bookId) {
  const elInput = document.querySelector('.update-book')
  const book = getBookById(bookId)

  document.querySelector('[name="id"]').value = bookId
  document.querySelector('[name="new-price"]').value = book.price

  elInput.classList.add('open')
}

function closeUpdateModal() {
  const elInput = document.querySelector('.update-book')
  elInput.classList.remove('open')

  document.querySelector('[name="id"]').value = ''
  document.querySelector('[name="new-price"]').value = ''
}

function onUpdateBook(ev) {
  ev.preventDefault()

  const bookId = document.querySelector('[name="id"]').value
  const bookPrice = document.querySelector('[name="new-price"]').value
  const book = getBookById(bookId)

  closeUpdateModal()

  if (book.price === bookPrice || !bookPrice) return

  // Model
  updateBook(bookId, bookPrice)

  // DOM
  renderBooks()
}

function onUpdateRate(diff) {
  const elModal = document.querySelector('.modal')
  const elRate = elModal.querySelector('.book-rate')
  const bookId = elModal.dataset.id
  const book = getBookById(bookId)

  if ((book.rate === 0 && diff === -1) || (book.rate === 10 && diff === 1)) {
    return
  }

  // Model
  updateRate(bookId, diff)

  // DOM
  elRate.innerText = book.rate
}

// Handle sort and filter events
function onSetFilterBy(filterBy) {
  filterBy = setBookFilter(filterBy)

  renderBooks()

  setQueryStringParams()
}

function onSetSortBy() {
  const prop = document.querySelector('.sort-by').value
  const isDesc = document.querySelector('.sort-desc').checked

  const sortBy = {}
  sortBy[prop] = isDesc ? -1 : 1

  setBookSort(sortBy)
  renderBooks()
}

function onSetSortByClick(elHead) {
  const prop = elHead.dataset.sort

  gDesc *= -1

  const sortBy = {
    [prop]: gDesc,
  }

  elHead.querySelector('span').innerText = gDesc === 1 ? '↑' : '↓'

  setBookSort(sortBy)
  renderBooks()
}

// Handle description Modal
function onReadBook(bookId) {
  const book = getBookById(bookId)
  const elModal = document.querySelector('.modal')

  // Set id as data(for updating rate later)
  elModal.dataset.id = book.id

  // Update DOM accordinly
  elModal.querySelector('.book-id').innerText = book.id
  elModal.querySelector('.book-rate').innerText = book.rate
  elModal.querySelector('.book-title').innerText = book.title
  elModal.querySelector('.book-price').innerText = book.price
  elModal.querySelector('.book-desc').innerText = book.desc

  elModal.classList.add('open')

  setQueryStringParams(bookId)
}

function onCloseModal() {
  const elModal = document.querySelector('.modal')
  elModal.classList.remove('open')

  setQueryStringParams()
}

// Handle pages events
function onChangePage(diff) {
  const elBtnPrev = document.querySelector('.btn-prev')
  const elBtnNext = document.querySelector('.btn-next')

  elBtnNext.disabled = false
  elBtnPrev.disabled = false

  // Get curr page and num of pages
  const pageIdx = getPageIdx()
  const pages = getPagesNum()

  // if there is only 1 page do nothing
  if (
    !pages ||
    (diff === 1 && pageIdx === pages) ||
    (diff === -1 && !pageIdx)
  ) {
    return
  }

  // Change curr page
  changePage(diff)

  renderBooks()
}

function onSetPage(page) {
  setPage(page)

  renderBooks()
}
