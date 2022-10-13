import axios from 'axios'


let addToCart = document.querySelectorAll("#addToCart")
let cartCounter = document.querySelector('#cartUpdateNumber')

function updateCart(food) {
    axios.post('/update-cart',food).then(res => {
        toastr.success('Items are added succesfully to cart..!!')
        cartCounter.innerText = res.data.totalQty
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
    })
})