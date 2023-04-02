"use strict";
import { authenticateUser } from "../services/authentication.js";
import { resetPassword } from "../services/password-service.js";
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const submitBtn = document.querySelector(".submit-btn");

function doLogin(event) {
  event.preventDefault();
  let usernameVal = usernameInput.value;
  let passwordVal = passwordInput.value;
  authenticateUser(usernameVal, passwordVal);
}

submitBtn.addEventListener("click", doLogin);

const forgotPasswordLink = document.querySelector(".forgot-password-link");
const modalContainer = document.querySelector(".modal");
const closeBtn = document.querySelector(".close");
const email = document.querySelector(".modal-input");
const submitBtnModal = document.querySelector(".submit-modal");

forgotPasswordLink.addEventListener("click", function () {
  modalContainer.classList.add("modal-open");
});

closeBtn.addEventListener("click", function () {
  modalContainer.classList.remove("modal-open");
});

submitBtnModal.addEventListener("click", function (event) {
  event.preventDefault();
  resetPassword(email.value);
});
submitBtnModal.addEventListener("click", function () {
  modalContainer.classList.remove("modal-open");
});
