"use strict";
import {
  initPasswordService,
  validatePasswords,
  savePassword,
} from "../services/password-service.js";

const newPassword = document.querySelector("#new-password");
const repeatNewPassword = document.querySelector("#repeat-password");
const eyeIcon = document.querySelector(".password-toggle");
const form = document.querySelector("form");
const passwordMatchError = document.querySelector("#password-match-error");

initPasswordService({
  password: newPassword,
  repeatPassword: repeatNewPassword,
  eyeIcon: eyeIcon,
});

validatePasswords({
  passwordInput: newPassword,
  repeatPasswordInput: repeatNewPassword,
  error: passwordMatchError,
});

const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get("token");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  savePassword(token, newPassword.value);
});
