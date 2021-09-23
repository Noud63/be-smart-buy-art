
//Scroll to products
const productsListEl = document.querySelector(".products-list");
const seeMoreBtn = document.querySelector(".see-more-btn");

seeMoreBtn.addEventListener('click', () => {
    productsListEl.scrollIntoView({ behavior: "smooth" })
});


// Scrool to main page and close cart
const mainPage = document.querySelector(".content");
const seeLess = document.querySelector(".btn-home");
seeLess.addEventListener('click', () => {
    mainPage.scrollIntoView({ behavior: "smooth" })
    document.querySelector('.cart').classList.remove('show')
    document.querySelector('.likes-items').classList.remove('showLikes')
    document.querySelector('.products').classList.remove('productsSmall')
    seeLess.disabled = true
})


//Render products
const productEl = document.querySelector('.products')
const cartItemsEl = document.querySelector('.cart-items')

function renderProducts() {
    products.forEach(product => {
        productEl.innerHTML += `
        <div class="item">
                <div class="item-container">
                    <div class="item-img">
                        <img src=${product.imgSrc} alt=${product.name} class="paintingPic">
                    </div>
                    <div class="desc">
                    <p>
                        Title: ${product.name}<br>
                        Price: <small>\u20AC</small> ${product.price},-<br>
                        
                           Size: 270 x 170cm<br>
                        </p>
                    </div>
                    <div class="itemFooter">#${product.id}</div>

                    <div class="add-to-wishlist" onclick="like(${product.id}, event)">
                        <img src="./icons/heart.png" alt="add to wish list" class="addToWishList" >
                    </div>
                    <div class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="./icons/bag-plus.png" alt="add to cart">
                    </div>
                </div>
            </div>
        `
    })
}

renderProducts()


//Add to cart
let cart = JSON.parse(localStorage.getItem('CART')) || []
updateCart()

function addToCart(id) {
    if (cart.some(el => el.id === id)) {
        changeNumberOfUnits('plus', id)
    } else {
        const item = products.find(product => {
            return product.id === id
        })
        const numberOfUnits = item.numberOfUnits
        cart.push({ ...item, numberOfUnits: numberOfUnits })
        console.log(cart)
    }

    updateCart()
}


// Remove item from cart
function removeItemFromCart(id) {
    cart = cart.filter(item => {
        return item.id !== id
    })
    updateCart()
}


//change number of units
function changeNumberOfUnits(action, id) {

    cart = cart.map(el => {
        let numberOfUnits = el.numberOfUnits
        if (el.id === id) {
            if (action === 'plus' && el.numberOfUnits < el.instock) {
                numberOfUnits++
            } else if (action === 'minus' && el.numberOfUnits > 1) {
                numberOfUnits--
            }
        }
        return { ...el, numberOfUnits: numberOfUnits }
    })
    updateCart()   // after changing the array update the cart UI
}


// Update cart
function updateCart() {
    renderCartItems()
    renderSubtotal()
    localStorage.setItem('CART', JSON.stringify(cart))
}


// Calculate totals
function renderSubtotal() {
    let totalPrice = 0
    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.numberOfUnits
        totalPrice += item.price * item.numberOfUnits
    })
    document.querySelector('.subtotal').innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(2)}`
    document.querySelector(".total-items-in-cart").innerHTML = totalItems
}


// render cart items
function renderCartItems() {
    cartItemsEl.innerHTML = ""
    cart.forEach(item => {
        cartItemsEl.innerHTML += `
        <div class="cart-item">
                    <div class="item-info" onclick="removeItemFromCart(${item.id})">
                        <img src=${item.imgSrc} alt=${item.name} class="picInCart">
                        <h5>${item.name}</h5>
                    </div>
                    <div class="unit-price">
                        <small>$</small>${item.price}
                    </div>
                    <div class="units">
                        <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})"><img src="${'../icons/minus.png'}"/></div>
                        <div class="number">${item.numberOfUnits}</div>
                        <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})"><img src="${'../icons/plus.png'}"/></div>
                    </div>
                </div>`
    })
}


//Toggel cart 
let cartOpen = false
let likesOpen = false

const btn = document.querySelector('.shopping-bag')
btn.addEventListener('click', toggleCart)
function toggleCart(e) {

    if (e.target && likesOpen === true) {
        toggleLikesList(e)
    }

    if (e.target) {
        document.querySelector('.cart').classList.toggle('show')
        document.querySelector('.products').classList.toggle('productsSmall')
        productsListEl.scrollIntoView({ behavior: "smooth" })
        cartOpen = !cartOpen
        console.log('cartOpen = ' + cartOpen)
    }
}

// Add likes to likeslist and render to UI
let likes = []

// Render likes list
const likesItems = document.querySelector('.likes-items')
function renderLikesList() {
    likesItems.innerHTML = ""
    likes.forEach(item => {
        likesItems.innerHTML += `
        <div class="cart-item" onclick="removeItemFromLikeslist(${item.id})">
                    <div class="item-info">
                        <img src=${item.imgSrc} alt=${item.name} class="picInCart">
                        <h5>${item.name}</h5>
                    </div>
                    <div class="unit-price">
                        <small>$</small>${item.price}
                    </div>
                </div>`
    })

}


// Click green heart to add to likeslist
function like(id, event) {
    const element = event.target.parentNode
    if (likes.some(el => el.id === id)) {
        alert('You like that one already!')
        return
    }
    let item = products.find(item => item.id === id)
    likes.push(item)
    document.querySelector('.heart').innerHTML = `<img src=${'../icons/heartred.png'} />`
    if (element) {
        element.classList.toggle('colorToggle')
    }
    renderLikesList()
}


//Toggle likes list
const likesIcon = document.querySelector('.likes');
likesIcon.addEventListener('click', toggleLikesList)
function toggleLikesList(e) {

    if (likes.length === 0) return

    if (e.target && cartOpen === true) {
        toggleCart(e)
    }

    if (e.target) {
        document.querySelector('.likes-items').classList.toggle('showLikes')
        document.querySelector('.products').classList.toggle('productsSmall')
        productsListEl.scrollIntoView({ behavior: "smooth" })
        likesOpen = !likesOpen
        console.log('LikesOpen = ' + likesOpen)
    }
}


//Remove item from likes list
function removeItemFromLikeslist(id) {
    likes = likes.filter(item => {
        return item.id !== id
    })

    if (likes.length === 0) {
        document.querySelector('.products').classList.remove('productsSmall');
    }
    renderLikesList()
    // noLikes()

}


// //if likes array is empty
// function noLikes(){
//          let list = [...document.querySelectorAll('.add-to-wishlist')]
//     if (likes.length === 0) {
//         document.querySelector('.heart').innerHTML = `<img src=${'../icons/heartgrey.png'} />`;
//         document.querySelector('.products').classList.toggle('productsSmall');
//         list.forEach(el => {
//             el.classList.remove('colorToggle')
//         })
//         likesOpen = !likesOpen
//         console.log('LikesOpen = ' + likesOpen)
//     }


// }


