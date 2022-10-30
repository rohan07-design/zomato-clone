import axios from 'axios'
import Noty from 'noty'
const moment = require('moment')

export function initAdmin() {
    const orderTableBody = document.querySelector('#orderTableBody')
    let orders = []

    let markup

    axios.get('/admin/orders', {
        headers : {
            "X-Requested-With": "XMLHttpRequest"
        }
    }).then(res => {
        orders = res.data
        markup = generateMarkup(orders)
        orderTableBody.innerHTML = markup
    }).catch(err => {
        console.log(err)
    })

    function renderItems(items) {
        let parsedItems = Object.values(items)
        return parsedItems.map((menuItem) => {
            return `
                <p>${ menuItem.item.foodname} - ${ menuItem.qty} pcs </p>
            `
        }).join('')
    }

    function generateMarkup(orders) {
        return orders.map(order => {
            return `
                <tr>
                    <td>
                        <p>${ order._id }</p>
                        <div>${ renderItems(order.items) }</div>
                    </td>
                    <td>${ order.customerId.name }</td>
                    <td>${ order.address }</td>
                    <td>
                    <div>
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${order._id}">
                            <select name="status" class="form-select" style="width:auto;" onchange="this.form.submit()">
                                <option value="order_placed"
                                ${ order.status === 'order_placed' ? 'selected' :''}>
                                Placed</option>
                                <option value="confirmed"
                                ${ order.status === 'confirmed' ? 'selected' :''}>
                                Confirmed</option>
                                <option value="prepared"
                                ${ order.status === 'prepared' ? 'selected' :''}>
                                Prepared</option>
                                <option value="delivered"
                                ${ order.status === 'delivered' ? 'selected' :''}>
                                Delivered</option>
                                <option value="completed"
                                ${ order.status === 'completed' ? 'selected' :''}>
                                Completed</option>
                            </select>
                        </form>
                    </div>
                    </td>
                    <td> ${ moment(order.createdAt).format('hh:mm A')}</td>
                </tr>
            `
        }).join('')
    }

    let socket = io() 
    socket.on('orderPlaced',(order) => {
        orders.unshift(order)
        orderTableBody.innerHTML = ""
        orderTableBody.innerHTML = generateMarkup(orders)
    })
}   

// module.exports = initAdmin
