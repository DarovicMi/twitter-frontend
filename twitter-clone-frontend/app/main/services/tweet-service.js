"use strict";

import { API_URL, getLoggedInUser, getUserToken } from "./authentication.js";
import {
  handleEllipsis,
  checkIfEdited,
  handleYesBtnClick,
  handleNoBtnClick,
  handleDeleteBtnClick,
  handleEditButtonClick,
  handleCancelBtnClick,
  handleSaveBtnClick,
} from "../templates/tweet/shared.js";

import { fetchCommentCountByTweetId } from "./comment-service.js";
import { likeTweet } from "./like-service.js";

const tweetTextarea = document.querySelector(".tweet-textarea");
const tweetsContainer = document.querySelector(".tweets-container");

export async function getTweets() {
  try {
    const response = await fetch(`${API_URL}/tweets`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to get tweets");
    }

    const tweets = await response.json();
    tweetsContainer.innerHTML = "";

    tweets.forEach(async (tweet) => {
      const tweetElement = createTweetElement(tweet);
      tweetsContainer.appendChild(tweetElement);
      const commentCount = await fetchCommentCountByTweetId(tweet.id);
      const commentCountElement = document.getElementById(
        `comment-count-${tweet.id}`
      );
      commentCountElement.textContent = commentCount;

      const likeIcon = tweetElement.querySelector(".like");

      const storedLikes = localStorage.getItem(`tweet-${tweet.id}-likes`);
      tweet.likes = storedLikes ? JSON.parse(storedLikes) : [];

      const loggedInUserId = getLoggedInUserId();
      tweet.likedByCurrentUser = tweet.likes.includes(loggedInUserId);

      if (tweet.likedByCurrentUser) {
        likeIcon.classList.add("liked");
        likeIcon.name = "heart";
      } else {
        likeIcon.classList.remove("liked");
        likeIcon.name = "heart-outline";
      }

      const likeCount = tweetElement.querySelector(".like-count");
      likeCount.textContent = tweet.likeCount;
    });
  } catch (error) {
    console.error(error);
  }
}

export async function createTweet() {
  const message = tweetTextarea.value.trim();

  if (message === "") {
    return;
  }

  try {
    const user = await getLoggedInUser();
    const tweet = await createNewTweet(message, user);

    addTweetToPage(tweet);
    tweetTextarea.value = "";
  } catch (error) {
    console.error(error);
  }
}

export async function createNewTweet(message, user) {
  const response = await fetch(`${API_URL}/tweet`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
    body: JSON.stringify({ message, user }),
  });

  if (!response.ok) {
    throw new Error("Unable to create tweet");
  }

  const responseData = await response.json();

  return {
    id: responseData.id,
    message: responseData.message,
    user: responseData.user,
    createdAt: new Date(responseData.createdAt),
    likes: [],
    likeCount: 0,
  };
}

export function addTweetToPage(tweet) {
  const newTweetElement = createTweetElement(tweet);
  tweetsContainer.prepend(newTweetElement);
}

function createTweetHeader(
  userInformation,
  timestampContainer,
  editedContainer,
  tweetEllipsis
) {
  const header = document.createElement("div");
  header.classList.add("tweet-header");
  header.appendChild(userInformation);
  header.appendChild(timestampContainer);
  header.appendChild(editedContainer);
  header.appendChild(tweetEllipsis);
  return header;
}
function createTweetBody(
  tweet,
  header,
  tweetMessageContainer,
  tweetEditForm,
  tweetIcons,
  tweetSaveCancelContainer
) {
  const tweetEl = document.createElement("div");
  tweetEl.classList.add("tweet-body", `tweet-${tweet}`);
  tweetEl.appendChild(header);
  tweetEl.appendChild(tweetMessageContainer);
  tweetEl.appendChild(tweetEditForm);
  tweetEl.appendChild(tweetSaveCancelContainer);
  tweetEl.appendChild(tweetIcons);
  return tweetEl;
}
function createUserInformation(userImage, userProfileLink, tweetUsername) {
  const userInfo = document.createElement("div");
  userInfo.classList.add("user-information");

  userProfileLink.appendChild(userImage);
  userInfo.appendChild(userProfileLink);
  userInfo.appendChild(tweetUsername);
  return userInfo;
}
function createUserProfileLink(tweet) {
  const userProfileLink = document.createElement("a");
  userProfileLink.href = `../profile/profile.html?username=${tweet.user.username}`;
  return userProfileLink;
}

function createUserImage(avatar) {
  const userImage = document.createElement("img");
  userImage.classList.add("tweet-user-image");
  userImage.src = `${avatar}`;
  userImage.alt = "User image";
  return userImage;
}
function createUsername(username) {
  const tweetUsername = document.createElement("span");
  tweetUsername.classList.add("tweet-username");
  tweetUsername.textContent = `${username}`;
  return tweetUsername;
}

function createTimestampContainer(tweetTimestamp) {
  const timestampContainer = document.createElement("div");
  timestampContainer.appendChild(tweetTimestamp);
  return timestampContainer;
}

function createTweetTimestamp(timestamp) {
  const tweetTimestamp = document.createElement("p");
  tweetTimestamp.classList.add("tweet-timestamp");
  tweetTimestamp.textContent = `${timestamp}`;
  return tweetTimestamp;
}

function createEditedText() {
  const editedText = document.createElement("span");
  editedText.classList.add("edited");
  editedText.innerHTML = "<em>(edited)</em>";
  return editedText;
}

function createTweetEllipsis(tweetBtnsContainer, ellipsisIcon) {
  const tweetEllipsis = document.createElement("div");
  tweetEllipsis.classList.add("tweet-ellipsis");
  tweetEllipsis.appendChild(tweetBtnsContainer);
  tweetEllipsis.appendChild(ellipsisIcon);
  return tweetEllipsis;
}
function createEditedContainer(editedText) {
  const editedContainer = document.createElement("div");
  editedContainer.appendChild(editedText);
  return editedContainer;
}
function createEditButton() {
  const editBtn = document.createElement("button");
  editBtn.classList.add("tweet-btn-edit", "edit-btn");
  editBtn.textContent = "Edit";
  return editBtn;
}

function createDeleteButton() {
  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("tweet-btn-delete", "delete-btn");
  deleteBtn.textContent = "Delete";
  return deleteBtn;
}

function createEllipsisIcon() {
  const ellipsisIcon = document.createElement("ion-icon");
  ellipsisIcon.classList.add("tweet-body-icon", "elipse");
  ellipsisIcon.name = "ellipsis-vertical-outline";
  return ellipsisIcon;
}

function createTweetMessageContainer(message) {
  const tweetMessageContainer = document.createElement("p");
  tweetMessageContainer.classList.add("tweet-message");
  tweetMessageContainer.textContent = `${message}`;
  return tweetMessageContainer;
}

function createTweetEditForm(tweetEditInput, modal, warning) {
  const tweetEditForm = document.createElement("form");
  tweetEditForm.classList.add("tweet-edit-form");

  tweetEditForm.appendChild(tweetEditInput);
  tweetEditForm.appendChild(warning);
  tweetEditForm.appendChild(modal);

  return tweetEditForm;
}
function createTweetEditInput() {
  const tweetEditInput = document.createElement("textarea");
  tweetEditInput.classList.add("tweet-edit-input");
  tweetEditInput.maxLength = 255;
  return tweetEditInput;
}
function createTweetBtnsContainer(editBtn, deleteBtn) {
  const tweetBtnsContainer = document.createElement("div");
  tweetBtnsContainer.classList.add("tweet-btns-container");
  tweetBtnsContainer.appendChild(editBtn);
  tweetBtnsContainer.appendChild(deleteBtn);

  return tweetBtnsContainer;
}

function createSaveButton() {
  const saveButton = document.createElement("button");
  saveButton.type = "button";
  saveButton.classList.add("tweet-save-btn");
  saveButton.textContent = "Save";
  return saveButton;
}
function createCancelButton() {
  const cancelButton = document.createElement("button");
  cancelButton.type = "button";
  cancelButton.classList.add("tweet-cancel-btn");
  cancelButton.textContent = "Cancel";
  return cancelButton;
}

function createTweetSaveCancelContainer(saveButton, cancelButton) {
  const tweetSaveCancelContainer = document.createElement("div");
  tweetSaveCancelContainer.classList.add("tweet-save-cancel-container");
  tweetSaveCancelContainer.appendChild(saveButton);
  tweetSaveCancelContainer.appendChild(cancelButton);
  return tweetSaveCancelContainer;
}

function createModal(modalContent) {
  const modal = document.createElement("div");
  modal.id = "myModal";
  modal.classList.add("modal");
  modal.appendChild(modalContent);
  return modal;
}

function createModalContent(modalHeading, modalBtns) {
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  modalContent.appendChild(modalHeading);
  modalContent.appendChild(modalBtns);
  return modalContent;
}

function createModalHeading(heading) {
  const modalHeading = document.createElement("h2");
  modalHeading.textContent = heading;
  return modalHeading;
}
function createModalBtnsContainer(yesBtn, noBtn) {
  const modalBtns = document.createElement("div");
  modalBtns.classList.add("modal-btns");
  modalBtns.appendChild(yesBtn);
  modalBtns.appendChild(noBtn);
  return modalBtns;
}

function createYesBtn() {
  const yesBtn = document.createElement("button");
  yesBtn.classList.add("modal-btn");
  yesBtn.id = "yesBtn";
  yesBtn.textContent = "Yes";
  return yesBtn;
}

function createNoBtn() {
  const noBtn = document.createElement("button");
  noBtn.classList.add("modal-btn");
  noBtn.id = "noBtn";
  noBtn.textContent = "No";
  return noBtn;
}

function createTweetIconsContainer(commentIcon, shareIcon, likeIcon) {
  const tweetIcons = document.createElement("div");
  tweetIcons.classList.add("tweet-icons");
  tweetIcons.appendChild(commentIcon);
  tweetIcons.appendChild(shareIcon);
  tweetIcons.appendChild(likeIcon);
  return tweetIcons;
}

function createCommentIcon(onClick) {
  const commentIcon = document.createElement("ion-icon");
  commentIcon.classList.add("tweet-body-icon", "comment");
  commentIcon.name = "chatbubble-outline";
  commentIcon.addEventListener("click", onClick);

  return commentIcon;
}

function createShareIcon() {
  const shareIcon = document.createElement("ion-icon");
  shareIcon.classList.add("tweet-body-icon", "share");
  shareIcon.name = "arrow-redo-outline";
  return shareIcon;
}

function createLikeIcon(tweet) {
  const likeIcon = document.createElement("ion-icon");
  likeIcon.classList.add("tweet-body-icon", "like");
  likeIcon.id = `like-icon-${tweet.id}`;
  likeIcon.name = "heart-outline";
  return likeIcon;
}

function createTextareaWarning() {
  const warning = document.createElement("p");
  warning.classList.add("warning");
  return warning;
}

function createNumberOfLikes(tweet) {
  const likeCount = document.createElement("span");
  likeCount.classList.add("like-count");
  likeCount.textContent = tweet.likeCount;
  return likeCount;
}

function createNumberOfComments(tweet) {
  const commentCount = document.createElement("span");
  commentCount.classList.add("comment-number");
  commentCount.setAttribute("id", `comment-count-${tweet.id}`);
  commentCount.textContent = "0";
  return commentCount;
}

function createTweetElement(tweet) {
  const { message, user, createdAt, edited } = tweet;
  const timestamp = formatTimestamp(createdAt);
  const avatar = user.imageUrl;
  const username = `${user.username}`;

  const userProfileLink = createUserProfileLink(tweet);
  const userImage = createUserImage(avatar);
  const tweetUsername = createUsername(username);
  const userInformation = createUserInformation(
    userImage,
    userProfileLink,
    tweetUsername
  );
  const tweetTimestamp = createTweetTimestamp(timestamp);
  const timestampContainer = createTimestampContainer(tweetTimestamp);

  const editedText = createEditedText();
  const editedContainer = createEditedContainer(editedText);

  const editBtn = createEditButton();
  const deleteBtn = createDeleteButton();
  const tweetBtnsContainer = createTweetBtnsContainer(editBtn, deleteBtn);
  const ellipsisIcon = createEllipsisIcon();
  const tweetEllipsis = createTweetEllipsis(tweetBtnsContainer, ellipsisIcon);

  const tweetHeader = createTweetHeader(
    userInformation,
    timestampContainer,
    editedContainer,
    tweetEllipsis
  );

  const tweetMessageContainer = createTweetMessageContainer(message);

  const noBtn = createNoBtn();
  const yesBtn = createYesBtn();
  const modalHeading = createModalHeading("Are you sure?");
  const modalBtns = createModalBtnsContainer(yesBtn, noBtn);
  const modalContent = createModalContent(modalHeading, modalBtns);
  const modal = createModal(modalContent);

  const tweetEditInput = createTweetEditInput();
  const saveButton = createSaveButton();
  const cancelButton = createCancelButton();
  const textareaWarning = createTextareaWarning();
  const tweetEditForm = createTweetEditForm(
    tweetEditInput,
    modal,
    textareaWarning
  );
  const tweetSaveCancelContainer = createTweetSaveCancelContainer(
    saveButton,
    cancelButton
  );

  const commentIcon = createCommentIcon(() => {});

  const shareIcon = createShareIcon();
  const likeIcon = createLikeIcon(tweet);
  const tweetIcons = createTweetIconsContainer(
    commentIcon,
    shareIcon,
    likeIcon
  );

  const likeCount = createNumberOfLikes(tweet);
  tweetIcons.appendChild(likeCount);

  likeIcon.addEventListener("click", async (event) => {
    handleTweetLikes(event, likeIcon, tweet, likeCount);
  });

  const commentCount = createNumberOfComments(tweet);
  tweetIcons.appendChild(commentCount);

  const tweetElement = createTweetBody(
    tweet.id,
    tweetHeader,
    tweetMessageContainer,
    tweetEditForm,
    tweetIcons,
    tweetSaveCancelContainer
  );

  let openElipsis = false;
  handleEllipsis(openElipsis, ellipsisIcon, user, tweetBtnsContainer);

  checkIfEdited(edited, editedText);

  let openEdit = false;
  editBtn.addEventListener("click", (event) => {
    handleEditButtonClick(
      openEdit,
      tweetEditInput,
      tweet,
      tweetBtnsContainer,
      tweetMessageContainer,
      cancelButton,
      saveButton,
      textareaWarning
    );
    event.stopPropagation();
  });

  cancelButton.addEventListener("click", (event) => {
    handleCancelBtnClick(
      event,
      tweetEditInput,
      tweetMessageContainer,
      tweetBtnsContainer,
      cancelButton,
      saveButton,
      textareaWarning
    );
    event.stopPropagation();
  });

  saveButton.addEventListener("click", (event) => {
    handleSaveBtnClick(
      event,
      tweet,
      tweetEditInput,
      cancelButton,
      saveButton,
      tweetBtnsContainer,
      tweetMessageContainer,
      editedText,
      textareaWarning
    );
    event.stopPropagation();
  });

  userProfileLink.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  tweetEditForm.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  tweetEditInput.addEventListener("click", function (event) {
    event.stopPropagation();
  });

  deleteBtn.addEventListener("click", (event) =>
    handleDeleteBtnClick(event, modal)
  );
  noBtn.addEventListener("click", (event) => handleNoBtnClick(event, modal));
  yesBtn.addEventListener("click", (event) =>
    handleYesBtnClick(event, tweet, modal)
  );

  tweetElement.addEventListener("click", () => {
    redirectToTweetPage(tweet);
  });

  return tweetElement;
}

function redirectToTweetPage(tweet) {
  const username = tweet.user.username;
  const tweetId = tweet.id;
  window.location.href = `http://127.0.0.1:5500/app/main/tweet/tweet.html?username=${username}&tweetId=${tweetId}`;
}

function getLoggedInUserId() {
  return localStorage.getItem("userId");
}

export async function handleTweetLikes(event, likeIcon, tweet, likeCount) {
  event.stopPropagation();
  const loggedInUserId = getLoggedInUserId();
  const responseStatus = await likeTweet(tweet.id);

  tweet.likedByCurrentUser = !tweet.likedByCurrentUser;

  if (tweet.likedByCurrentUser && responseStatus === 201) {
    tweet.likeCount++;
    tweet.likes.push(loggedInUserId);
  } else {
    tweet.likeCount--;
    tweet.likes = tweet.likes.filter((userId) => userId !== loggedInUserId);
  }

  if (tweet.likedByCurrentUser) {
    likeIcon.classList.add("liked");
    likeIcon.name = "heart";
  } else {
    likeIcon.classList.remove("liked");
    likeIcon.name = "heart-outline";
  }

  likeCount.textContent = tweet.likeCount;
  localStorage.setItem(`tweet-${tweet.id}-likes`, JSON.stringify(tweet.likes));
}

export async function updateTweet(tweetId, message) {
  const tweet = { message: message };
  try {
    const response = await fetch(`${API_URL}/tweet/${tweetId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
      body: JSON.stringify(tweet),
    });

    if (response.status === 500 || !response.ok) {
      throw new Error("You need to provide a value for the tweet");
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export function deleteTweet(tweetId) {
  fetch(`${API_URL}/tweet/${tweetId}`, {
    method: "DELETE",
    headers: {
      Authorization: getUserToken(),
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "An unexpected error has happend while trying to delete the tweet"
        );
      }
      new Notify("Success", "Tweet deleted successfully", "success", {
        vAlign: "top",
        hAlign: "left",
        autoClose: true,
        autoCloseDuration: 2000,
        closeOnCrossClick: true,
        closeOnNotifyClick: false,
      });
      return response.text();
    })
    .catch((error) => {
      new Notify("Error", error.message, "error");
    });
}

export function findTweetById(tweetId) {
  return fetch(`${API_URL}/tweet/${tweetId}`, {
    method: "GET",
    headers: {
      Authorization: getUserToken(),
    },
  })
    .then((response) => {
      if (!response.ok) {
        setTimeout(() => {
          window.location.href = "../home/home.html";
        }, 2000);
        throw new Error(
          `Error while fetching the tweet\n The tweet does not exist anymore`
        );
      }
      return response.json();
    })
    .catch(
      (error) =>
        new Notify("Error", error.message, "error", {
          vAlign: "top",
          hAlign: "left",
          autoClose: true,
          autoCloseDuration: 2000,
          closeOnCrossClick: true,
          closeOnNotifyClick: false,
        })
    );
}

export function formatTimestamp(timestamp) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  return new Date(timestamp).toLocaleString("en-US", options);
}
