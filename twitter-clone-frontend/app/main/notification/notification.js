import { getNotifications } from "../services/notification-service.js";

document.addEventListener("DOMContentLoaded", async () => {
  const notificationsList = document.querySelector(".notifications-list");
  const notifications = await getNotifications();

  notifications.forEach((notification) => {
    const listItem = document.createElement("li");
    listItem.classList.add("notification-item");

    const tweetUser = document.createElement("span");
    tweetUser.textContent = `@${notification.tweet.user.username}`;
    tweetUser.classList.add("tweet-user");

    const notificationText = document.createElement("span");
    notificationText.textContent = `New tweet from `;

    const tweetMessage = document.createElement("span");
    tweetMessage.textContent = `: '${notification.tweet.message}'`;

    listItem.appendChild(notificationText);
    listItem.appendChild(tweetUser);
    listItem.appendChild(tweetMessage);
    notificationsList.appendChild(listItem);
  });
});

const header = document.querySelector(".header");
const navbar = fetch("../templates/navbar/navbar.html");
navbar
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    header.innerHTML = data;
  });
