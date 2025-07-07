import data from './data.js';

document.addEventListener('DOMContentLoaded', () => {
  
  const cartNos = document.querySelectorAll('.cart-no');
  const imageBorder = document.querySelectorAll('.image');
  const cartTexts = document.querySelectorAll('.cart-text');
  const cartIcons = document.querySelectorAll('.cart-image');
  const addCartButtons = document.querySelectorAll('.add-cart');
  const incrementIcons = document.querySelectorAll('.increment-quantity');
  const decrementIcons = document.querySelectorAll('.decrement-quantity');

  const overLay = document.querySelector('.over-lay');
  const emptyCart = document.querySelector('.empty-cart');
  const addCartNum = document.querySelector('.addCart-Num');
  const submitCart = document.querySelector('.submit-cart');
  const displayCart = document.querySelector('.display-cart');
  const emptyMessage = document.querySelector('.empty-message');
  const carbonNeutral = document.querySelector('.carbon-neutral');
  const confirmedCart = document.querySelector('.confirmed-cart');
  const cartTotalPrice = document.querySelector('.cart-totalPrice');
  const orderConfirmed = document.querySelector('.display-confirmedOrder');


  let displayCount = 0;
  
  let globalCount = 0;

  const response = JSON.parse(data);


  // Add the Grand total
  const updateGrandTotal = () => {
    const totalItemPrice = document.querySelectorAll('.total-item-price');
    let grandTotal = 0;

    totalItemPrice.forEach((item) => {
      const priceText = item.textContent.replace('$', '')
      grandTotal += parseFloat(priceText)
    })

    const grandAmount = document.querySelector('.total');
    let confirmedAmount = document.querySelector('.confirmed-total');
    grandAmount.textContent = `$${grandTotal.toFixed(2)}`
    confirmedAmount.textContent = `$${grandTotal.toFixed(2)}`
  }


  // HTML template for displaying cart
  const displayAddedCart = (index) => {
    const product = response[index];
    const price = product.price.toFixed(2);
    const name = product.name;

    let html = `
      <div class ="display-container">
        <li class="display-cart-name">${name}</li>
        <div class="display-price-container">
          <div class="grouped">
            <span class="display-cartCount1"><span class="display-cartCount">1</span>x</span>
            <li class="display-price">@ $${price}</li>
            <li class="display-price total-item-price">$${price}</li>
          </div>
          <img src ="./assets/images/icon-remove-item.svg" class = "delete-icon">
        </div>
      </div>
      `
    displayCart.innerHTML += html;
    updateGrandTotal()
  }


  {/* HTML template for displaying cart */}
  const popUpCart = (index) => {

    if (response) {
      const price = response[index].price.toFixed(2);
      const name = response[index].name;
      const image = response[index].image.thumbnail;

      let html1 = `
      <div class ="popUp-container">
        <div class ="group-3">
          <img src =${image} class = "image-thumbnail">
        </div>
        <div class="confirmed-price-container">
          <li class="confirmed-cart-name">${name}</li>
          <div class="grouped">
            <span class="display-cartCount1"><span class="confirmed-cartCount">1</span>x</span>
            <li class="display-price">@ $${price}</li>
            <li class="display-price total-item-price1">$${price}</li>
          </div>
        </div>
      </div>
      `
      orderConfirmed.innerHTML += html1;
      
      updateGrandTotal()

      carbonNeutral.style.display = 'flex'
      confirmedCart.style.display = 'block'

      console.log(response); // Log response directly
    } else {
      console.error("Invalid response structure: response is undefined");
    }
  }


  submitCart.addEventListener('click', () => {
    overLay.style.display = "flex";
  })


  overLay.addEventListener('click', (e) => {
    if (e.target === overLay){
      overLay.style.display = "none";
    }
  })


  // This is listen to click in "start ove button" and clear everything
  confirmedCart.addEventListener('click', () => {
    overLay.style.display = "none";

    addCartButtons.forEach((button,index) => {
      changeToCart(index);

      const cartItem1 = [...document.querySelectorAll('.confirmed-cart-name')].find(el => el.textContent === response[index].name);
    
      if (cartItem1) {
        const popUpContainer = cartItem1.closest('.popUp-container');
        if (popUpContainer) {
          popUpContainer.remove(); // Only remove if it exists
          updateGrandTotal()
        }
      }

    })

    displayCart.innerHTML = ''; // clear cart
    addCartNum.innerHTML = '0'; // reset cart count
    globalCount = 0;
    
    if (globalCount === 0) {
      emptyCart.style.display = 'block';
      emptyMessage.style.display = 'block';
      cartTotalPrice.style.display = 'none';
      carbonNeutral.style.display = 'none';
      submitCart.style.display = 'none';
    }
  })


  // delete cart
  displayCart.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-icon')) {
      const container = e.target.closest('.display-container');
      
      //1. Find the product name in cart UI
      const name = container.querySelector('.display-cart-name')?.textContent;

      //2. Find its position in the original product list
      const index = response.findIndex((item) => {
          return item.name === name;
      });

      // 3. Get the current quantity from the cart UI
      const quantity = Number(cartNos[index].value) || 0;

      // 4. Subtract this quantity from the global cart count
      globalCount -= quantity;
      addCartNum.innerHTML = globalCount;

     // 5. Reset UI for that product
      changeToCart(index);

      // 6. Remove the item from cart display
      container.remove();

      // Remove the item from confirmed container
      const cartItem1 = [...document.querySelectorAll('.confirmed-cart-name')].find(el => el.textContent === response[index].name);

      const popUpContainer = cartItem1.closest('.popUp-container');
      popUpContainer.remove();

      // It reduce the price as the globalCount changes
      const itemTotal = container.querySelector('.display-price:last-child');
      if (itemTotal) {
        const unitPrice = response[index].price;
        itemTotal.textContent = `$${(quantity * unitPrice).toFixed(2)}`;
      }

      if (globalCount === 0) {
        emptyCart.style.display = 'block';
        emptyMessage.style.display = 'block';
        cartTotalPrice.style.display = 'none';
        carbonNeutral.style.display = 'none';
        submitCart.style.display = 'none';
      }

      updateGrandTotal()
    }
  })


  // This  add to cart at first click
  addCartButtons.forEach((button, index) => {

    button.addEventListener('click', (e) => {
      e.stopPropagation();

      let count = Number(cartNos[index].value) || 0;
      if (count > 0){
        return;
      }
      
      popUpCart(index);
    
      cartNos[index].style.visibility = 'visible';
      cartNos[index].value = 1;

      cartIcons[index].style.display = 'none';
      cartTexts[index].style.display = 'none';

      incrementIcons[index].style.display = 'block';
      decrementIcons[index].style.display = 'block';
      button.classList.add("active");

      globalCount += 1;
      addCartNum.innerHTML =  globalCount;

      displayAddedCart(index);
      
      emptyCart.style.display = 'none';
      emptyMessage.style.display = 'none';
      cartTotalPrice.style.display = 'flex'
      carbonNeutral.style.display = 'flex'
      submitCart.style.display = 'block'

     
     imageBorder[index].classList.add("selected")
    });

  })

  const changeToCart = (index) => {
    
    cartNos[index].style.visibility = 'hidden';
    cartNos[index].value = '';
    cartIcons[index].style.display = 'block';
    cartTexts[index].style.display = 'block';
    incrementIcons[index].style.display = 'none';
    decrementIcons[index].style.display = 'none';
    addCartButtons[index].classList.remove("active");
    imageBorder[index].classList.remove("selected")
    addCartButtons[index].disabled = false;  
  }


    // Increment action
  incrementIcons.forEach((icon, index) => {

    icon.addEventListener('click', e => {

      e.stopPropagation();

      let countNo = Number(cartNos[index].value) || 0;

      countNo += 1;

      cartNos[index].value = countNo;

      globalCount += 1;
      addCartNum.innerHTML = globalCount;

      displayCount = countNo;

      const cartItem = [...document.querySelectorAll('.display-cart-name')]
                        .find(el => el.textContent === response[index].name);

      const cartItem1 = [...document.querySelectorAll('.confirmed-cart-name')].find(el => el.textContent === response[index].name);

      if (cartItem) {
        const countSpan = cartItem.closest('.display-container').querySelector('.display-cartCount'); 
        const itemTotal = cartItem.closest('.display-container').querySelector('.total-item-price');

        if (countSpan) {
          countSpan.textContent = displayCount;
        }

        if (itemTotal) {
          const unitPrice = response[index].price;
          itemTotal.textContent = `$${(unitPrice * countNo).toFixed(2)}`;
          updateGrandTotal()
        }
      }
      
      // statement for confirmed container
      if (cartItem1) {
        const countSpan1 = cartItem1.closest('.popUp-container').querySelector('.confirmed-cartCount'); 
        console.log(countSpan1)
        const itemTotal1 = cartItem1.closest('.popUp-container').querySelector('.total-item-price1');

        if (countSpan1) {
          countSpan1.textContent = displayCount;
        }

        if (itemTotal1) {
          const unitPrice = response[index].price;
          itemTotal1.textContent = `$${(unitPrice * countNo).toFixed(2)}`;
          updateGrandTotal()
        }
      }
    })
  })


  // Decrement action
  decrementIcons.forEach((icon, index) => {

    icon.addEventListener('click',(e) => {

      e.stopPropagation()

      let countNo = Number(cartNos[index].value) || 0;

      const cartItem = [...document.querySelectorAll('.display-cart-name')].find(el => el.textContent === response[index].name);

      const cartItem1 = [...document.querySelectorAll('.confirmed-cart-name')].find(el => el.textContent === response[index].name);

      if(countNo > 0 ){

        countNo -= 1;
    
        cartNos[index].value = countNo;


        globalCount -= 1;
        addCartNum.innerHTML = globalCount;
      } 
      
      if(countNo === 0 || globalCount === 0){
          const displayContainer = cartItem.closest('.display-container')
          const popUpContainer = cartItem1.closest('.popUp-container');
          popUpContainer.remove();
          displayContainer.remove();
          changeToCart(index);
        }

      if (globalCount === 0 ) {
        emptyCart.style.display = 'block';
        emptyMessage.style.display = 'block';
        cartTotalPrice.style.display = 'none';
        carbonNeutral.style.display = 'none';
        submitCart.style.display = 'none';
      }

      if (cartItem) {
        const countSpan = cartItem.closest('.display-container').querySelector('.display-cartCount');
        const itemTotal = cartItem.closest('.display-container').querySelector('.total-item-price');

        if (countSpan) {
          countSpan.textContent = countNo;
        }

        if (itemTotal) {
          const unitPrice = response[index].price;
          itemTotal.textContent = `$${(countNo * unitPrice).toFixed(2)}`;
          updateGrandTotal()

        }
      }
    })
  })
});

