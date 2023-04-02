"use strict";
import { API_URL, getUserToken } from "./authentication.js";

export function changePassword(oldPassword, newPassword, repeatNewPassword) {
  return fetch(`${API_URL}/changePassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    body: JSON.stringify({ oldPassword, newPassword, repeatNewPassword }),
  });
}

export function initPasswordService({ password, repeatPassword, eyeIcon }) {
  let hide = false;

  eyeIcon.addEventListener("click", function () {
    if (!hide) {
      this.setAttribute("name", "eye-outline");
      password.setAttribute("type", "text");
      repeatPassword.setAttribute("type", "text");
    } else {
      this.setAttribute("name", "eye-off-outline");
      password.setAttribute("type", "password");
      repeatPassword.setAttribute("type", "password");
    }
    hide = !hide;
  });
}

export function validatePasswords({
  passwordInput,
  repeatPasswordInput,
  error,
}) {
  function checkPasswords() {
    if (passwordInput.value !== repeatPasswordInput.value) {
      error.style.display = "block";
    } else {
      error.style.display = "none";
    }
  }

  passwordInput.addEventListener("input", checkPasswords);
  repeatPasswordInput.addEventListener("input", checkPasswords);
}

export function savePassword(token, password) {
  fetch(`${API_URL}/savePassword?token=${token}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(password),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to change password, try again");
      }
      return response.text();
    })
    .then((data) => {
      new Notify("Success!", `${data}\n Redirecting to login ...`, "success", {
        vAlign: "top",
        hAlign: "right",
        autoClose: true,
        autoCloseDuration: 3000,
        closeOnCrossClick: true,
        closeOnNotifyClick: false,
      });
      setTimeout(() => {
        window.location.href = "../login/login.html";
      }, 2500);
    })
    .catch((error) => {
      new Notify("Warning!", error.message, "error", {
        vAlign: "top",
        hAlign: "right",
        autoClose: true,
        autoCloseDuration: 3000,
        closeOnCrossClick: true,
        closeOnNotifyClick: false,
      });
    });
}

export function resetPassword(email) {
  fetch(`${API_URL}/resetPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(email),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "The email provided does not belong to any user in our database"
        );
      }
      setTimeout(() => {
        new Notify(
          "Success!",
          "An email containing a link to reset your password has been sent to your email, please check your inbox",
          "success",
          {
            vAlign: "top",
            hAlign: "right",
            autoClose: true,
            autoCloseDuration: 4500,
            closeOnCrossClick: true,
            closeOnNotifyClick: false,
          }
        );
      }, 0);
      return response.text();
    })
    .catch((error) =>
      setTimeout(() => {
        new Notify("Warning!", `${error.message}`, "error", {
          vAlign: "top",
          hAlign: "right",
          autoClose: true,
          autoCloseDuration: 4500,
          closeOnCrossClick: true,
          closeOnNotifyClick: false,
        });
      }, 300)
    );
}
