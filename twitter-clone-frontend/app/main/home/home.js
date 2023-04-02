"use strict";
import { isUserLoggedIn, getLoggedInUser } from "../services/authentication.js";

import { getTweets, createTweet } from "../services/tweet-service.js";
import {
  getNotifications,
  markNotificationsAsRead,
} from "../services/notification-service.js";
import {
  displayPageAfterUserLogin,
  handleTextareaInput,
  updateWarningBasedOnTextareaValue,
} from "../templates/tweet/shared.js";

const header = document.querySelector(".header");

async function checkNewNotifications() {
  const notifications = await getNotifications();

  const newNotifications = notifications.filter(
    (notification) => !notification.read
  );
  if (newNotifications.length > 0) {
    showNotificationMessage(newNotifications.length);
  }
  showNotificationSymbol();
}

checkNewNotifications();

function showNotificationSymbol() {
  const notifySymbol = document.createElement("ion-icon");
  notifySymbol.name = "notifications-outline";
  notifySymbol.classList.add("notify-img");
  document.body.appendChild(notifySymbol);
}

function showNotificationMessage(newNotificationsCount) {
  const notifyMessage = document.createElement("div");
  notifyMessage.classList.add("notify-message");
  notifyMessage.textContent = `You have ${newNotificationsCount} new notifications!`;
  const notifyCount = document.createElement("span");
  notifyCount.classList.add("notify-count");
  if (newNotificationsCount > 0) {
    document.body.appendChild(notifyCount);
    notifyCount.textContent = newNotificationsCount;
    document.body.appendChild(notifyMessage);
    setTimeout(() => {
      document.body.removeChild(notifyMessage);
    }, 5000);
  } else {
    notifyCount.textContent = "";
  }
}

async function loadNavbar() {
  const response = await fetch("../templates/navbar/navbar.html");
  const data = await response.text();

  const temporaryElement = document.createElement("div");
  temporaryElement.innerHTML = data;
  const sidebarList = temporaryElement.querySelector(".sidebar-list");
  const profileBtn = temporaryElement.querySelector("#profile-link");
  const notificationLink = temporaryElement.querySelector(".notification-link");
  notificationLink.addEventListener("click", async () => {
    await markNotificationsAsRead();
  });
  profileBtn.addEventListener("click", () => {
    const currentLoggedInUsername = localStorage.getItem("authenticatedUser");
    if (currentLoggedInUsername !== null) {
      window.location.href = `../profile/profile.html?username=${currentLoggedInUsername}`;
    }
  });

  if (sidebarList) {
    sidebarList.firstElementChild.firstElementChild.classList.add("active");
  }

  if (!isUserLoggedIn()) {
    hideSidebarElements(sidebarList);
  }
  while (temporaryElement.firstChild) {
    header.appendChild(temporaryElement.firstChild);
  }
  return sidebarList;
}

const profileLink = document.querySelector(".profile-link");
const currentLoggedInUsername = localStorage.getItem("authenticatedUser");
profileLink.href = `../profile/profile.html?username=${currentLoggedInUsername}`;
const feedImg = document.querySelector(".feed-img");
const userUsername = document.querySelector(".username");
const sectionCta = document.querySelector(".section-cta");
const searchBarBeforeLogin = document.querySelector(".search-section");
const tweetTextarea = document.querySelector(".tweet-textarea");
const warning = document.querySelector(".warning");

handleTextareaInput(tweetTextarea, warning);
updateWarningBasedOnTextareaValue(tweetTextarea, warning);

function hideSidebarElements(sidebarList) {
  const sidebarChild = sidebarList.children;
  for (let i = 2; i < sidebarChild.length; i++) {
    sidebarChild[i].style.display = "none";
  }
}

async function initialize() {
  displayPageAfterUserLogin();

  if (isUserLoggedIn()) {
    sectionCta.style.display = "none";
    searchBarBeforeLogin.style.display = "none";
    insertUserData().then((user) => {
      feedImg.src = user.imageUrl;
      userUsername.textContent = user.username;
    });
  }

  async function insertUserData() {
    try {
      const { username, imageUrl } = await getLoggedInUser();
      return { username, imageUrl };
    } catch (error) {
      new Notify("Error", error.message, "error");
    }
  }

  getTweets();

  const tweetBtn = document.querySelector(".tweet-btn");

  tweetBtn.addEventListener("click", createTweet);
}

loadNavbar().then((sidebarList) => {
  initialize();
});
