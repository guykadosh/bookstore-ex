'use strict'

const STORAGE_KEY = 'bookDB'
const PRICE_RANGE = 5
const PAGE_SIZE = 6

// global variables
let gBooks
let gPageIdx = 0
let gPages = 0
let gFilterBy = {
  txt: '',
  price: 0,
  rate: 0,
}

// Initialize books
_createBooks()

// Send books to render to the controller
function getBooks() {
  let books = _booksFilter()

  gPages = Math.floor(books.length / PAGE_SIZE)

  const startIdx = gPageIdx * PAGE_SIZE

  books = books.slice(startIdx, startIdx + PAGE_SIZE)

  return books
}

// Handle Pages
function changePage(diff) {
  gPageIdx += diff
}

function setPage(page) {
  gPageIdx = page
}

// Add/Remove/Update book functions
function addBook(title, price) {
  const book = _createBook(title, price)

  gBooks.push(book)

  _saveBooksToStorage()
}

function removeBook(bookId) {
  const books = gBooks
  const idx = books.findIndex(book => book.id === bookId)

  books.splice(idx, 1)

  _saveBooksToStorage()
}

function updateBook(bookId, bookPrice) {
  const book = getBookById(bookId)

  book.price = bookPrice

  _saveBooksToStorage()
}

function updateRate(bookId, diff) {
  const book = getBookById(bookId)

  book.rate += diff

  _saveBooksToStorage()
}

// Set filters and sort functions
function setBookFilter(filterBy) {
  if (filterBy.price !== undefined) gFilterBy.price = filterBy.price
  if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt
  if (filterBy.rate !== undefined) gFilterBy.rate = filterBy.rate

  // When filtering return to first page
  gPageIdx = 0

  return gFilterBy
}

function setBookSort(sortBy) {
  if (sortBy.price !== undefined) {
    gBooks.sort((b1, b2) => (b1.price - b2.price) * sortBy.price)
  }

  if (sortBy.title !== undefined) {
    gBooks.sort((b1, b2) => b1.title.localeCompare(b2.title) * sortBy.title)
  }

  // When sorting return first page
  gPageIdx = 0
}

// Get service functions
function getBookById(bookId) {
  return gBooks.find(book => book.id === bookId)
}

function getFilterBy() {
  return gFilterBy
}

function getBooksLength() {
  return _booksFilter().length
}

function getPageIdx() {
  return gPageIdx
}

function getPagesNum() {
  return gPages
}

// Private functions
function _booksFilter() {
  let books = gBooks.filter(book => book.title.includes(gFilterBy.txt))

  if (gFilterBy.price) {
    books = books.filter(book => book.price < gFilterBy.price)
  }

  if (gFilterBy.rate) {
    books = books.filter(book => book.rate >= gFilterBy.rate)
  }

  return books
}

function _createBook(title, price = getRandomFloatInclusive(1, 15).toFixed(2)) {
  return {
    id: makeId(4),
    title,
    price,
    desc: makeLorem(50),
    rate: 0,
  }
}

function _createBooks() {
  let books = loadFromStorage(STORAGE_KEY)

  if (books && books.length !== 0) {
    gBooks = books
    return
  }

  books = []
  for (let i = 0; i < 21; i++) {
    books.push(_createBook(generateName()))
  }

  gBooks = books
  _saveBooksToStorage()
}

function _saveBooksToStorage() {
  saveToStorage(STORAGE_KEY, gBooks)
}
