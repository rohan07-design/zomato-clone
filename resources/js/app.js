import axios from 'axios'


let addToCart = document.querySelectorAll("#addToCart")
let cartCounter = document.querySelector('#cartUpdateNumber')

function updateCart(food) {
    axios.post('/update-cart',food).then(res => {
        toastr.success('Items are added succesfully to cart..!!')
        cartCounter.innerText = res.data.totalQty
    }).catch(err => {
        toastr.success('Items are added succesfully to cart..!!')
    })
}

addToCart.forEach((btn) => {
    btn.addEventListener('click',(e) => {
        let food = JSON.parse(btn.dataset.food)
        updateCart(food)
    })
})

// function formerror() {
//     var formError = document.querySelectorAll('.formerror')
//     for(let items of formError) {
//         formError.innerHTML = ""
//     }
// }

// function setError(id,error) {
//     let element = document.getElementById(id)
//     element.getElementsByClassName('formerror')[0].innerHTML = error
// }

// document.getElementById('form').addEventListener('submit',(e) => {
//     formerror();
//     var name = document.getElementById('exampleInputText1').value
//     if(name.length == 0) {
//         setError("name","**Please Enter the name");
//         setTimeout(() => {
//             let element = document.getElementById("name")
//             element.getElementsByClassName('formerror')[0].innerHTML = ""
//         },3000)
//     }

//     var email = document.getElementById('exampleInputEmail1').value
//     if(email.length == 0) {
//         setError("email","**Please Enter the email")
//         setTimeout(() => {
//             let element = document.getElementById("email")
//             element.getElementsByClassName('formerror')[0].innerHTML = ""
//         },3000)
//     }
  
//     var password = document.getElementById('exampleInputPassword1').value
//     if(password.length == 0) {
//         setError("password","**Please Enter the password")
//         setTimeout(() => {
//             let element = document.getElementById("password")
//             element.getElementsByClassName('formerror')[0].innerHTML = ""
//         },3000)
//     }
//     e.preventDefault()
// })

