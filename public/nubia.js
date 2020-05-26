
//Remove items from cart
var removeCartButtons = document.getElementsByClassName('btn-danger');
for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener('click', removeCart)
}

function removeCart(e) {
    var buttonClicked = e.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}


//Update cart total
function updateCartTotal() {
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartRows = cartItems.getElementsByClassName('cart-row');
    var total = 0;
    for (var i = 0; i < cartRows.length; i++) {
        var cartRow = cartRows[i];
        var cartPrice = cartRow.getElementsByClassName('cart-price')[0];
        var cartQty = cartRow.getElementsByClassName('cart-quantity-input')[0];

        var price = parseFloat(cartPrice.innerText.replace('$', '').replace(',', ''))
        var qty = cartQty.value;
        total += (price * qty);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('cart-total-price')[0].innerText = '$' + total;
}

//Update cart quantity total price 
var cartQtys = document.getElementsByClassName('cart-quantity-input');
for (let i = 0; i < cartQtys.length; i++) {
    var cartQty = cartQtys[i];
    cartQty.addEventListener('change', cartQtyUpdate)
}

function cartQtyUpdate(e) {
    var qtyChanged = e.target;
    if (qtyChanged.value == isNaN || qtyChanged.value <= 0) {
        qtyChanged.value = 1
    }
    updateCartTotal();
}

//Add to cart buttons
var addToCartButtons = document.getElementsByClassName('btn-primary');
for (var i = 0; i < addToCartButtons.length; i++) {
    var addToCartButton = addToCartButtons[i];
    addToCartButton.addEventListener('click', addToCart)
}

function addToCart(e) {
    var addToCartButton = e.target;
    var cartItem = addToCartButton.parentElement.parentElement.parentElement;
    var img = cartItem.getElementsByClassName('card-img-top')[0].src;
    var title = cartItem.getElementsByClassName('album-title')[0].innerText;
    var price = cartItem.getElementsByClassName('album-price')[0].innerText;
    var id = cartItem.dataset.itemId;
    itemToCart(title, price, img, id);
    updateCartTotal();
}


//adding row to cart
function itemToCart(title, price, img, id) {
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row'); //styling row
    cartRow.dataset.itemId = id;
    var cartItems = document.getElementsByClassName('cart-items')[0]

    var itemSelected = cartItems.getElementsByClassName('cart-item-title')
    for (var i = 0; i < itemSelected.length; i++) {
        if (itemSelected[i].innerText == title) {
            alert('Item already added to cart!\n Please select multiple purchase from the cart.')
            return
        }
    }
    var cartRowContents = `
    <div class="cart-item cart-column">
    <img class="cart-item-image" src="${img}" height="100" width="100">
    <span class="cart-item-title">${title}</span>
</div>
<span class="cart-price cart-column">${price}</span>
<div class="cart-quantity cart-column">
    <input class="cart-quantity-input" type='number' value='1'>
    <button role='button' class="btn btn-danger">REMOVE</button>
</div>
    `
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);

    var removeButtton = cartRow.getElementsByClassName('btn-danger')[0];
    removeButtton.addEventListener('click', removeCart)

    var qtyUpdate = cartRow.getElementsByClassName('cart-quantity-input')[0];
    qtyUpdate.addEventListener('change', cartQtyUpdate)
}

//Purchase button
var purchaseButton = document.getElementsByClassName('purchase')[0]
purchaseButton.addEventListener('click', purchaseItem)

var stripeHandler = StripeCheckout.configure({
    key: stripePublicKey,
    locale: 'en',
    token: function (token) {
        var items = [];
        var cartItemContainer = document.getElementsByClassName('cart-items')[0];
        var cartRows = cartItemContainer.getElementsByClassName('cart-row');
        for (var i = 0; i < cartRows.length; i++) {
            var cartRow = cartRows[i];
            var qtyElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
            var qty = qtyElement.value;
            var id = cartRow.dataset.itemId;
            items.push({
                id: id,
                quantity: qty
            })
        }

        fetch('/purchase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                stripeTokenId: token.id,
                items: items
            })
        }).then(function(res) {
            return res.json()
        }).then(function(data) {
            alert(data.message)
            var cartItems = document.getElementsByClassName('cart-items')[0];
            while (cartItems.hasChildNodes()) {
                cartItems.removeChild(cartItems.firstChild);
            }
            updateCartTotal();
        }).catch(function(error) {
            console.error(error)
        })
    }
})

function purchaseItem() {
    // alert('Thank you!\nYou have successfully purchased your items.')
    var priceElement = document.getElementsByClassName('cart-total-price')[0];
    var price = parseFloat(priceElement.innerText.replace('$', '')) * 100;
    // console.log(price);
    stripeHandler.open({
        amount: price
    })
}
