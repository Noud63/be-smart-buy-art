
let cartOpen = false;
let likesOpen = false;
let likes = [];

//Scroll to products
const productsListEl = document.querySelector(".products-list");
const seeMoreBtn = document.querySelector(".see-more-btn");
seeMoreBtn.addEventListener('click', () => {
    productsListEl.scrollIntoView({ behavior: "smooth" });
});


// Scrool to main page and close cart or likes list
const mainPage = document.querySelector(".content");
const seeLess = document.querySelector(".btn-home");
seeLess.addEventListener('click', () => {
    mainPage.scrollIntoView({ behavior: "smooth" });
    if (cartOpen === true) {
        document.querySelector('.cart').classList.remove('show')
        document.querySelector('.products').classList.remove('productsSmall')
        cartOpen = false
    };

    if (likesOpen === true) {
        document.querySelector('.likes-list').classList.remove('showLikes')
        document.querySelector('.products').classList.remove('productsSmall')
        likesOpen = false
    };

    //seeLess.disabled = true
});


//Render products
const productEl = document.querySelector('.products');
const cartItemsEl = document.querySelector('.cart-items');

function renderProducts() {
    products.forEach(product => {
        productEl.innerHTML += `
        <div class="item"  id="${product.id}">
                <div class="item-container">
                    <div class="item-img">
                        <img src=${product.imgSrc} alt=${product.name} class="paintingPic">
                    </div>
                    <div class="desc">
                    <p>
                        Title: ${product.name}<br>
                        Price: <small>\u20AC</small>\u00A0${product.price},-<br>
                        
                           Size: 270 x 170cm<br>
                        </p>
                    </div>
                    <div class="itemFooter">#${product.id}</div>
                    <div class="add-to-wishlist" onclick="like(${product.id}, event)">
                        <img src="./icons/heart.png" alt="add to wish list" class="addToWishList">
                    </div>
                    <div class="add-to-cart" onclick="addToCart(${product.id})">
                        <img src="./icons/bag-plus.png" alt="add to cart">
                    </div>
                </div>
            </div>
        `
    });
};

renderProducts();


//Add to cart
let cart = JSON.parse(localStorage.getItem('CART')) || [];
updateCart();

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
};


// Remove item from cart
function removeItemFromCart(id) {
    cart = cart.filter(item => {
        return item.id !== id
    })
    updateCart()
};


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
};


// Update cart
function updateCart() {
    renderCartItems()
    renderSubtotal()
    localStorage.setItem('CART', JSON.stringify(cart))
};


// Calculate totals
function renderSubtotal() {
    let totalPrice = 0
    let totalItems = 0;

    cart.forEach(item => {
        totalItems += item.numberOfUnits
        totalPrice += item.price * item.numberOfUnits
    })
    document.querySelector('.subtotal').innerHTML = `Subtotal (${totalItems} items): \u20AC ${totalPrice.toFixed(2)}`
    document.querySelector(".total-items-in-cart").innerHTML = totalItems
};


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
                        <small>\u20AC</small>\u00A0${item.price},-
                    </div>
                    <div class="units">
                        <div class="btn minus" onclick="changeNumberOfUnits('minus', ${item.id})"><img src="${'../icons/minus.png'}"/></div>
                        <div class="number">${item.numberOfUnits}</div>
                        <div class="btn plus" onclick="changeNumberOfUnits('plus', ${item.id})"><img src="${'../icons/plus.png'}"/></div>
                    </div>
                </div>`
    })
};


//Toggel cart 
const btn = document.querySelector('.bagItems')
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
};


// Render likes list
const likesItems = document.querySelector('.likes-items')
function renderLikesList() {
    likesItems.innerHTML = ""
    likes.forEach(item => {
        likesItems.innerHTML += `
        <div class="like-item" onclick="removeItemFromLikeslist(${item.id})">
                    <div class="like-info">
                        <img src=${item.imgSrc} alt=${item.name} class="picInCart">
                        <h5>${item.name}</h5>
                    </div>
                    <div class="like-price">
                        <small>\u20AC</small>\u00A0${item.price},-
                    </div>
                </div>`
    })
};


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
    document.querySelector('.noLikes').style.display = "none"
    likedItems()
    renderLikesList()
};


//likes counter in likes list footer
function likedItems() {
    let numberOfItems = likes.length
    document.querySelector('.like-subtotal').textContent = `You like ${numberOfItems} item(s)`
};


//Toggle likes list
const likesIcon = document.querySelector('.heart');
likesIcon.addEventListener('click', toggleLikesList)
function toggleLikesList(e) {

    if (e.target && cartOpen === true) {
        toggleCart(e)
    }

    if (e.target) {
        document.querySelector('.likes-list').classList.toggle('showLikes')
        document.querySelector('.products').classList.toggle('productsSmall')
        productsListEl.scrollIntoView({ behavior: "smooth" })
        likesOpen = !likesOpen
        console.log('LikesOpen = ' + likesOpen)
    }
};


//Remove item from likes list
let list = [...document.querySelectorAll('.add-to-wishlist')]
function removeItemFromLikeslist(id, e) {
    likes = likes.filter(item => {
        return item.id !== id
    })

    if (likes.length === 0) {
        document.querySelector('.noLikes').style.display = "flex"
        document.querySelector('.heart').innerHTML = `<img src=${'../icons/heartgrey.png'} />`;
        list.forEach(el => {
            el.classList.remove('colorToggle');
        })
    }
    likedItems()
    removeRedHeart(id)
    renderLikesList()
};


//remove red heart from product when item deleted from likes list
function removeRedHeart(id) {
    products.find(product => {
        if (product.id === id) {
            document.getElementById(product.id).firstChild.nextSibling.children[3].classList.remove('colorToggle');
        }
    })
};


//Cart checkout button show overlay and modal 
const checkoutButton = document.querySelector('.checkout')
checkoutButton.addEventListener('click', showOverlay)
function showOverlay(e) {
    if (cart.length === 0) {
        document.querySelector('.cart').classList.remove('show')
        document.querySelector('.products').classList.remove('productsSmall')
        cartOpen = false
    } else {
        toggleCart(e)
        document.querySelector('.overlay').classList.add('showIt')
        document.querySelector('.orderedWorks').innerHTML = ""
        addToShoppinglist()
    }
}


//Close overlay and modal, scroll to top
const closeButton = [...document.querySelectorAll('.closeButton')]
closeButton.forEach(btn => {
    btn.addEventListener('click', closeOverlay)
})
function closeOverlay() {
    document.querySelector('.overlay').classList.remove('showIt');
    document.querySelector('.overlay2').classList.remove('showIt')
    mainPage.scrollIntoView({ behavior: "smooth" });
}


//Add items to shopping list
function addToShoppinglist() {
    cart.forEach( item => {
        let totalOrdered = cart.length * item.price
        const html = `<div class="painting">Painting No #${item.id + 1}, Title: ${item.name} <span class="orderedPrice">Price: \u20AC ${item.price}</span></div>`
        document.querySelector('.totalOrdered').innerHTML = `<span>Total: </span><span>Price \u20AC ${totalOrdered}</span>`
        document.querySelector('.orderedWorks').insertAdjacentHTML('beforeend', html)
    
    })
}   
    

//Form action 
function thanksAndGoodbye() {
    document.querySelector('.overlay').classList.remove('showIt');
    document.querySelector('.overlay2').classList.add('showIt');
    cart.length = 0;
    updateCart();
}
