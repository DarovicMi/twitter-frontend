"use strict";
import { HttpInterceptor } from "./http-interceptor.js";

export const USER_NAME_SESSION = "authenticatedUser";
export const API_URL = "http://localhost:8080";

export function createBasicAuthToken(username, password) {
  if (!username || !password) {
    throw new Error("Username and password cannot be empty");
  }
  const token = "Basic " + window.btoa(username + ":" + password);
  localStorage.setItem("token", token);
  return token;
}

export async function authenticateUser(username, password) {
  try {
    const authenticationToken = createBasicAuthToken(username, password);
    const headers = new Headers({
      Authorization: authenticationToken,
    });
    const url = fetch(`${API_URL}/login`, { headers });
    const response = await url;
    if (!response.ok) {
      throw new Error("Invalid Credentials");
    }
    const userResponse = await response.json();

    if (userResponse.accountStatus === "ACTIVE") {
      registerLogin(username, password);
      showSuccessNotification();
    } else {
      showErrorNotification();
      setTimeout(() => {
        window.open(
          `${API_URL}/resendVerifyToken?token=${userResponse.oldToken}`,
          "_blank",
          "noopener,noreferrer"
        );
      }, 4000);
    }
  } catch (error) {
    new Notify("Error!", error.message, "error", {
      vAlign: "top",
      hAlign: "right",
      autoClose: true,
      autoCloseDuration: 4000,
      closeOnCrossClick: true,
      closeOnNotifyClick: false,
    });
  }
}

export function registerLogin(username, password) {
  localStorage.setItem(USER_NAME_SESSION, username);
}

export function registerUserId(userId) {
  localStorage.setItem("userId", userId);
}

export function logout() {
  localStorage.removeItem(USER_NAME_SESSION);
  localStorage.removeItem("token");
}
export function isUserLoggedIn() {
  return !!localStorage.getItem(USER_NAME_SESSION);
}

export function getUserToken() {
  return localStorage.getItem("token");
}

export function showLoggedInUser() {
  return localStorage.getItem(USER_NAME_SESSION) || "";
}

export async function getLoggedInUser() {
  const username = localStorage.getItem(USER_NAME_SESSION);
  if (!username) {
    throw new Error("User is not logged in");
  }
  const response = await HttpInterceptor(
    `${API_URL}/user/username/${username}`
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch user data: ${response.status} ${response.statusText}`
    );
  }
  const data = await response.json();
  registerUserId(data.id);
  return data;
}

export async function getLoggedInUserDetails() {
  return await getLoggedInUser();
}

function showSuccessNotification() {
  setTimeout(() => {
    new Notify("Success!", "Login Successful", "success", {
      vAlign: "top",
      hAlign: "right",
      autoClose: true,
      autoCloseDuration: 1500,
      closeOnCrossClick: true,
      closeOnNotifyClick: false,
    });
    setTimeout(() => {
      window.location.href = "../home/home.html";
    }, 1200);
  }, 500);
}

function showErrorNotification() {
  setTimeout(() => {
    new Notify(
      "Warning!",
      "Your account status is INACTIVE, please check your mail inbox and activate your account, a new link is going to be provided in a few seconds...",
      "error",
      {
        vAlign: "top",
        hAlign: "right",
        autoClose: true,
        autoCloseDuration: 7000,
        closeOnCrossClick: true,
        closeOnNotifyClick: false,
      }
    );
  }, 500);
}
