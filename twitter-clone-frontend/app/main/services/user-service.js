"use strict";
import { HttpInterceptor } from "../services/http-interceptor.js";
import {
  API_URL,
  getLoggedInUserDetails,
  logout,
  getUserToken,
} from "./authentication.js";

export function registerUser(userData) {
  return fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
}

export async function getUserId() {
  const { id } = await getLoggedInUserDetails();
  return id;
}

export async function getUserById(userId) {
  const response = await HttpInterceptor(`${API_URL}/user/${userId}`, {
    method: "GET",
  });
  return response.json();
}

export async function updateUserDetails(userId, userDetails) {
  const response = await HttpInterceptor(`${API_URL}/users/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    body: JSON.stringify(userDetails),
  });
  return response.json();
}

export async function getUsers() {
  const response = await fetch(`${API_URL}/users`, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}
export async function updateUser() {
  try {
    const usernameInput = document.getElementById("username").value;
    const emailInput = document.getElementById("email").value;
    const accountTypeInput = document.getElementById("account-type").value;
    const avatar = document.getElementById("avatar").files[0];
    const imageUrl = avatar ? `../../../assets/${avatar.name}` : "";

    const userId = await getUserId();
    const user = await getUserById(userId);
    const users = await getUsers();

    for (let user_all of users) {
      if (
        user_all.id !== userId &&
        (user_all.username === usernameInput || user_all.email === emailInput)
      ) {
        throw new Error(
          "There already exists an user with this username or email"
        );
      }
    }
    const updatedUser = {
      ...user,
      username: usernameInput || user.username,
      email: emailInput || user.email,
      accountType: accountTypeInput || user.accountType,
      imageUrl: imageUrl || user.imageUrl,
    };

    const data = await updateUserDetails(userId, updatedUser);

    const username = document.querySelector(".username");
    const email = document.querySelector(".email-value");
    const accountType = document.querySelector(".type-value");
    const avatarImage = document.querySelector(".avatar");
    username.textContent = data.username;
    email.textContent = data.email;
    accountType.textContent = data.accountType;
    avatarImage.src = data.imageUrl;

    localStorage.setItem("authenticatedUser", data.username.toLocaleString());
    const token = localStorage.getItem("token");
    const decodedToken = atob(token.split(" ")[1]);
    const [_, password] = decodedToken.split(":");
    localStorage.removeItem("token");
    localStorage.setItem(
      "token",
      `Basic ${btoa(data.username + ":" + password)}`
    );
  } catch (error) {
    new Notify("Error", error.message, "error");
  }
}

export async function deleteUser() {
  const userId = await getUserId();
  fetch(`${API_URL}/user/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: getUserToken(),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Something went wrong, could not delete user");
      }
      setTimeout(() => {
        logout();
        window.location.href = "../login/login.html";
      }, 750);
      return response.json();
    })
    .catch((error) => {
      new Notify("Error", error.message, "error");
    });
}

export function getLoggedInUserId() {
  return localStorage.getItem("userId");
}
