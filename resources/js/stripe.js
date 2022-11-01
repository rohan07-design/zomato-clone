import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import Noty from 'noty'

export async function initStripe() {
    const stripe = await loadStripe('pk_live_51LE33ASIT3dowHOXO0fZrIisVJUnbKorfbASayzoGMH28L3u7zZN6M0ggNlf3n5xrpLTDUAYiYjdxxzzzCMOw38r00rN11rWbj')
    const payment = document.querySelector('#payment')
    const showPayment = document.querySelector('#elementId')
    console.log(payment)
    let card = null;
    payment.addEventListener('change', (e) => {
        console.log(e.target.value === "card")
        if (e.target.value === "card") {
            showPayment.style.visibility = 'visible';
            const elements = stripe.elements()
            card = elements.create('card', { style: {}, hidePostalCode: true })
            card.mount('#elementId')
        } else {
            showPayment.style.visibility = 'hidden';
            card.destroy()
        }
    })

    //Ajax call
    const paymentForm = document.querySelector('#paymentOnline')
    if (paymentForm) {
        paymentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let formData = new FormData(paymentForm)
            let formObject = {}

            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }

            if(!card) {
                axios.post('/orders', formObject).then((res) => {
                    
                    // notification for order successful
                    new Noty ({
                        text: res.data.message
                    }).show()
                    window.location.href = '/customer/orders'
                }).catch((err) => {
                    console.log(err)
                })
                return;
            }

            //verify the card
            stripe.createToken(card).then((result) => {
                console.log(result)
            }).catch((err) => {
                console.log(err)
            })

        })
    }
}