const quantityInput = document.getElementById("quantity");

const decreaseButton = document.querySelector(".decrease-btn");
const increaseButton = document.querySelector(".increase-btn");

decreaseButton.addEventListener("click", () => {
  const currentValue = parseInt(quantityInput.value);

  if (currentValue > 1) {
    quantityInput.value = currentValue - 1;
  }
});

increaseButton.addEventListener("click", () => {
  const currentValue = parseInt(quantityInput.value);

  if (currentValue < 99) {
    quantityInput.value = currentValue + 1;
  }
});
