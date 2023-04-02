"use strict";
import {
  initPasswordService,
  validatePasswords,
} from "../services/password-service.js";

import { registerUser } from "../services/user-service.js";

const password = document.querySelector(".password-input");
const repeatPassword = document.querySelector(".repeat-password");
const eyeIcon = document.querySelector(".password-toggle");
const passwordInput = document.getElementById("password");
const repeatPasswordInput = document.getElementById("repeat-password");
const passwordMatchError = document.getElementById("password-match-error");

initPasswordService({
  password: password,
  repeatPassword: repeatPassword,
  eyeIcon: eyeIcon,
});

validatePasswords({
  passwordInput: passwordInput,
  repeatPasswordInput: repeatPasswordInput,
  error: passwordMatchError,
});

const form = document.querySelector(".form");
const submitBtn = document.querySelector(".submit-btn");

form.addEventListener("input", () => {
  if (
    form.checkValidity() &&
    passwordInput.value === repeatPasswordInput.value
  ) {
    submitBtn.removeAttribute("disabled");
  } else {
    submitBtn.setAttribute("disabled", "");
  }
});

function getUserData() {
  const accountTypeInput = document.getElementsByName("account-type");
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const emailInput = document.getElementById("email");
  const dobInput = document.getElementById("dob");

  let accountType;
  for (let i = 0; i < accountTypeInput.length; i++) {
    if (accountTypeInput[i].checked) {
      accountType = accountTypeInput[i].value;
      break;
    }
  }

  return {
    username: usernameInput.value,
    password: passwordInput.value,
    email: emailInput.value,
    dateOfBirth: new Date(dobInput.value).toLocaleDateString(),
    accountType: accountType,
  };
}

function onSubmit(event) {
  event.preventDefault();
  const userData = getUserData();
  registerUser(userData)
    .then((response) => {
      if (response.ok) {
        handleRegistrationSuccess();
      } else {
        throw new Error(
          "Registration failed\n An account with this username or email already exists!"
        );
      }
    })
    .catch((error) => {
      handleRegistrationError(error.message);
    });
}

window.onSubmit = onSubmit;

function handleRegistrationSuccess() {
  setTimeout(() => {
    new Notify(
      "Success!",
      "Your account has been sucessfully created, you will be redirected to the main page",
      "success",
      {
        vAlign: "top",
        hAlign: "right",
        autoClose: true,
        autoCloseDuration: 7000,
        closeOnCrossClick: true,
        closeOnNotifyClick: false,
      }
    );
    setTimeout(() => {
      new Notify(
        "Important!",
        "A link to verify your account has been sent on the email" +
          " you have provided, please check your inbox and activate your account in order to log in!",
        "warning",
        {
          vAlign: "top",
          hAlign: "right",
          autoClose: true,
          autoCloseDuration: 8000,
          closeOnCrossClick: true,
          closeOnNotifyClick: false,
        }
      );
      setTimeout(() => {
        new Notify(
          "Info!",
          "You will be redirected to the login page in 2 seconds",
          "info",
          {
            vAlign: "top",
            hAlign: "right",
            autoClose: true,
            autoCloseDuration: 9000,
            closeOnCrossClick: true,
            closeOnNotifyClick: false,
          }
        );
      }, 750);
    }, 500);
  }, 250);

  setTimeout(() => {
    window.location.href = "../home/home.html";
  }, 10000);
}

function handleRegistrationError(message) {
  setTimeout(() => {
    new Notify("Warning!", message, "error", {
      vAlign: "top",
      hAlign: "right",
      autoClose: true,
      autoCloseDuration: 4000,
      closeOnCrossClick: true,
      closeOnNotifyClick: false,
    });
  }, 1000);
}
