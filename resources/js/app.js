import axios from 'axios'
import moment from 'moment'
import { initAdmin } from './admin'

let addToCart = document.querySelectorAll("#addToCart")
let cartCounter = document.querySelector('#cartUpdateNumber')


function updateCart(food) {
    axios.post('/update-cart', food).then(res => {
        toastr.success('Items are added succesfully to cart..!!')
        cartCounter.innerText = res.data.totalQty
    }).catch(err => {
    })
}


addToCart.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
    })
})

//Remove the alert message for order page
const alrtmsg = document.querySelector('#alert')
if (alrtmsg) {
    setTimeout(() => {
        alrtmsg.remove()
    }, 2000)
}

initAdmin()

//Chnage order status
const statuses = document.querySelectorAll(".list")

const order = document.querySelector('#hidden-input') ? document.querySelector('#hidden-input')
    .value : null

const getorder = JSON.parse(order)

const time = document.createElement('small')

function updateStatus(order) {
    let statusComplete = true;
    statuses.forEach((status) => {
        let dataProperty = status.dataset.status

        if (statusComplete) {
            status.classList.add('status-complete')
        }

        if (dataProperty === getorder.status) {
            statusComplete = false
            time.innerText = moment(getorder.updatedAt).format('hh:mm A')
            status.appendChild(time)
            if (status.nextElementSibling) {
                status.nextElementSibling.classList.add('current-status')
            }
        }
    })
}

updateStatus(getorder)


//socket
let socket = io()
//join
if(order) {
    socket.emit('join',`order_${getorder._id}`)
}