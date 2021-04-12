document.addEventListener("DOMContentLoaded", () => {
    getBooks()
});

// Global variables
const myUser = {"id":1, "username":"pouros"}
const showPanel = document.getElementById('show-panel')

// Get list of books
const getBooks = () => {
    fetch('http://localhost:3000/books')
    .then(resp => resp.json())
    .then(books => books.forEach(renderList))
}

// Remove previous showing book
const removeChild = (list) => {
    let child = list.lastElementChild
    while (child) {
        list.removeChild(child)
        child = list.lastElementChild
    }
}

// Update list of likers
const updateLikers = (book) => {
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({
            'users': book.users    
        })
    })
    .then(resp => resp.json())
    .then(book => {
        let addUser = document.createElement('li')
        addUser.innerText = myUser.username
        
        const userID = document.getElementById('user-id')
        userID.append(addUser)
    })
}

// Render the book information
const renderList = (book) => {
    const listPanel = document.getElementById('list-panel')
    const list = document.getElementById('list')
    const booksli = document.createElement('li')
    booksli.innerText = book.title
    booksli.setAttribute('id', book.id)
    list.append(booksli)

    booksli.addEventListener('click', event => {
        fetch(`http://localhost:3000/books/${book.id}`)
        .then(resp => resp.json())
        .then(renderBook)
        removeChild(showPanel)
    })
}

const renderBook = (book) => {
    // render book thumbnail   
    const thumbnail = document.createElement('img')
    thumbnail.src = book.img_url

    // render book title
    const title = document.createElement('h2')
    title.innerText = book.title

    // render book subtitle
    const subtitle = document.createElement('h3')
    subtitle.innerText = book.subtitle

    // render book desc
    const description = document.createElement('p')
    description.innerText = book.description

    // render like button
    const likeButton = document.createElement('button')
    likeButton.innerText = 'Like'

    likeButton.addEventListener('click', event => {
        if (book.users.map(user => user.username).includes(myUser.username)){
            alert('You have liked this book already!')
        } else {
            book.users.push(myUser)
            updateLikers(book)
        }
    })

    const userHeader = document.createElement('h4')
    userHeader.innerText = 'Users who liked this post:'
    showPanel.append(userHeader)

    //const userID = document.createElement('p')
    //userID.setAttribute('id', 'user-id')

    // render users who liked the book
    const users = document.createElement('ul')
    book.users.forEach(user => {
        const liker = document.createElement('li')
        liker.innerText = user.username
        liker.setAttribute('id', 'user-id')
        users.appendChild(liker)
    })

    // apend to elements
    showPanel.append(thumbnail, title, subtitle, description, userHeader, users, likeButton)
}