import axios from 'axios'
import { initAdmin } from './admin'

let addToCart = document.querySelectorAll("#addToCart")
let cartCounter = document.querySelector('#cartUpdateNumber')


function updateCart(food) {
    axios.post('/update-cart',food).then(res => {
        toastr.success('Items are added succesfully to cart..!!')
        cartCounter.innerText = res.data.totalQty
    }).catch(err => {
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
    })
})

//Remove the alert message for order page
const alrtmsg = document.querySelector('#alert')
if(alrtmsg) {
    setTimeout(() => {
        alrtmsg.remove()
    },2000)
}

initAdmin()


