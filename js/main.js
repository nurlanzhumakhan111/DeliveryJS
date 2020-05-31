'use strict';
const BIRTHDAY = '10 march'
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const loginInput = document.querySelector('#login')
const buttonAuth = document.querySelector('.button-auth');
const modalAuth = document.querySelector('.modal-auth');
const closeModal = document.querySelector('.close-auth');
const loginForm = document.querySelector('#logInForm');
const userName = document.querySelector('.user-name');
const buttonOut = document.querySelector('.button-out');
const submitModal = document.querySelector('.button-login');
const cardsRestaurants = document.querySelector('.cards-restaurants');
const containerPromo = document.querySelector('.container-promo');
const restaurants = document.querySelector('.restaurants');
const menu = document.querySelector('.menu');
const logo = document.querySelector('.logo');
const cardsMenu = document.querySelector('.cards-menu');
const sectionHeading = document.querySelector('.section-heading')
const modalBody = document.querySelector('.modal-body');
const modalPrice = document.querySelector('.modal-pricetag')
const cart = [];
const clearCart = document.querySelector('.clear-cart')
let login = localStorage.getItem('glodelivery');

const getData = async function (url) {

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, 
      Статус ошибки ${response.status}!`)
  }

  return await response.json();
};
console.log(getData('./db/partners.json'));
console.log(getData('./db/tanuki.json'))
const toggleModal = function () {
  modal.classList.toggle("is-open");
}

function disableBtn() {
  submitModal.disabled = true;
  submitModal.classList.add('disabled');
  if (loginInput.value.length !== 0) {
    submitModal.disabled = false;
    submitModal.classList.remove('disabled');
  } else {
    submitModal.disabled = true;
    submitModal.classList.add('disabled');
  }
}

const toggleModalAuth = function () {
  modalAuth.classList.toggle('is-open');
}


function authorized() {
  function logOut() {
    login = null;
    localStorage.removeItem('glodelivery')
    buttonAuth.style.display = '';
    userName.style.display = "";
    buttonOut.style.display = "";
    buttonOut.style.display = "";
    buttonOut.removeEventListener('click', logOut);
    checkAuth();
    disableBtn();
  }

  console.log('Авторизован');

  userName.textContent = login;

  buttonAuth.style.display = 'none';
  userName.style.display = "inline";
  buttonOut.style.display = "flex";
  cartButton.style.display = "flex";

  buttonOut.addEventListener('click', logOut)
}

function notautorized() {
  console.log('Не авторизован')

  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    localStorage.setItem('glodelivery', login)

    buttonAuth.removeEventListener('click', toggleModalAuth);
    closeModal.removeEventListener('click', toggleModalAuth);
    loginForm.removeEventListener('submit', logIn);
    toggleModalAuth();
    loginForm.reset();
    checkAuth();
  }

  loginInput.addEventListener('change', disableBtn);
  buttonAuth.addEventListener('click', toggleModalAuth);
  closeModal.addEventListener('click', toggleModalAuth);
  loginForm.addEventListener('submit', logIn);
}

function checkAuth() {
  if (login) {
    authorized();

  } else {
    notautorized();
    notautorizedmodal();
  }
}

function notautorizedmodal() {
  if (login !== true) {
    alert('Вы не авторизованы');
    toggleModalAuth();
  } else {
    authorized();
  }
}
console.log()

function createCardRestaurant({
  image,
  kitchen,
  name,
  price,
  stars,
  products,
  time_of_delivery: timeOfDelivery
}) {
  const card = `
    <a class="card card-restaurant" data-products= "${products}">
  		<img src="${image}" alt="image" class="card-image"/>
  		<div class="card-text">
  			<div class="card-heading">
  				<h3 class="card-title">${name}</h3>
  				<span class="card-tag tag">${timeOfDelivery} мин</span>
  			</div>
  			<div class="card-info">
  				<div class="rating">
  					${stars}
  				</div>
  				<div class="price">От ${price} ₽</div>
  				<div class="category">${kitchen}</div>
  			</div>
  		</div>
  	</a>
  `;
  cardsRestaurants.insertAdjacentHTML('beforeend', card)


}

function createCardGood({
  description,
  image,
  name,
  price,
  id
}) {

  const card = document.createElement('div');
  card.className = 'card';
  card.insertAdjacentHTML('beforeend', `
    <img src="${image}" alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <!-- /.card-heading -->
      <div class="card-info">
        <div class="ingredients">${description}
        </div>
      </div>
      <!-- /.card-info -->
      <div class="card-buttons">
        <button class="button button-primary button-add-cart" id="${id}">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price card-price-bold">${price} ₽</strong>
      </div>
    </div>
  `);
  cardsMenu.insertAdjacentElement('beforeend', card)
}

function openGoods(event) {
  console.log(event);

  const target = event.target;

  const restaurant = target.closest('.card-restaurant');
  console.log('restaurant :', restaurant);
  if (restaurant && !!login) {
    console.log(restaurant.dataset.products);
    cardsMenu.textContent = '';
    containerPromo.classList.add('hide');
    restaurants.classList.add('hide');
    menu.classList.remove('hide');
    getData(`./db/${restaurant.dataset.products}`).then(function (data) {
      data.forEach(createCardGood);
    });
  } else {
    toggleModalAuth()
  }
};




function addToCart(event) {

  const target = event.target;

  const buttonAddToCart = target.closest('.button-add-cart')

  if(buttonAddToCart) {
    const card = target.closest('.card');
    const title = card.querySelector('.card-title-reg').textContent;
    const cost = card.querySelector('.card-price').textContent;
    const id = buttonAddToCart.id;

    const food = cart.find(function(item) {
      return item.id === id;
    })

    if (food) {
      food.count += 1
    } else {
      cart.push({
        id,
        title,
        cost,
        count: 1
      });
    }
  }
}

function renderCart() {
  modalBody.textContent = '';

  cart.forEach(function({ id, title, cost, count }) {
    const itemCart = `
        <div class="food-row">
					<span class="food-name">${title}</span>
					<strong class="food-price">${cost}</strong>
					<div class="food-counter">
						<button class="counter-button counter-minus" data-id=${id}>-</button>
						<span class="counter">${count}</span>
						<button class="counter-button counter-plus" data-id=${id}>+</button>
					</div>
				</div>
    `;

    modalBody.insertAdjacentHTML('afterBegin', itemCart)
  })

  const totalPrice = cart.reduce(function(result, item) {
    return result + parseFloat(item.cost) * item.count;
  }, 0)

modalPrice.textContent = totalPrice + " ₽";

}

function changeCount(event) {
  const target = event.target;

  if (target.classList.contains('counter-button')) {
    const food = cart.find(function(item) {
      return item.id === target.dataset.id
    });
    if (target.classList.contains('counter-minus')) {
      food.count--; 
      if (food.count === 0) {
        cart.splice(cart.indexOf(food), 1);
      }
    }
  
    if (target.classList.contains('counter-plus')) {
      food.count++;
    }
    renderCart();
  }

}

function init() {

  getData('./db/partners.json').then(function (data) {
    data.forEach(createCardRestaurant);
  });


  cartButton.addEventListener("click", function() {
    renderCart();
    toggleModal();
  });

clearCart.addEventListener('click', function() {
  cart.length = 0;
  renderCart();
})

  modalBody.addEventListener('click', changeCount)

  cardsMenu.addEventListener('click', addToCart)

  close.addEventListener("click", toggleModal);

  cardsRestaurants.addEventListener('click', openGoods, createCardGood);

  logo.addEventListener('click', () => {
    containerPromo.classList.remove('hide');
    restaurants.classList.remove('hide');
    menu.classList.add('hide');
  })

  disableBtn();

  checkAuth();

  new Swiper('.swiper-container', {
    sliderPerView: 1,
    speed: 1500,
    loop:true,
    autoplay: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },

  })
}
init();