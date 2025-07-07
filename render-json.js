
import data from "./data.js";

document.addEventListener('DOMContentLoaded', () => {
  
  const imagesContainer = document.querySelectorAll('.image-container');
  const contentContainer = document.querySelectorAll('.content-container');

  const responses = JSON.parse(data)
  console.log(responses)


  responses.forEach((response, index) => {

    // Display the images
    const images = response.image.desktop;
    const html1 = `
        <img src = "${images}" class = "image">
      `
    imagesContainer[index].innerHTML += html1;

    // Display the categories
    const categories = response.category;
    const html2 = `
        <h3 class = "name">${categories}</h3>
      `
    contentContainer[index].innerHTML += html2;

    // Display the names
    const names = response.name;
    const html3 = `
        <p class = "name">${names}</p>
      `
    contentContainer[index].innerHTML += html3;

    // Display the prices
    const price = (response.price).toFixed(2);
    const html4 = `
        <h6 class = "price">$${price}</h6>
      `
    contentContainer[index].innerHTML += html4;
  })
});

