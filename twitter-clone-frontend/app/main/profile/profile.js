"use strict";
import { API_URL, logout, getUserToken } from "../services/authentication.js";

import { deleteUser, updateUser } from "../services/user-service.js";
import {
  changePassword,
  initPasswordService,
  validatePasswords,
} from "../services/password-service.js";
import {
  toggleFollow,
  isUserFollowing,
  getNumberOfFollowers,
  getNumberOfFollowings,
} from "../services/follower-service.js";

const insertUserData = async function (username) {
  // try {
  //   const {
  //     username,
  //     email,
  //     creationDate,
  //     dateOfBirth,
  //     imageUrl,
  //     accountType,
  //     accountStatus,
  //   } = await getLoggedInUserDetails();
  //   return {
  //     username,
  //     email,
  //     creationDate,
  //     dateOfBirth,
  //     imageUrl,
  //     accountType,
  //     accountStatus,
  //   };
  try {
    const response = await fetch(`${API_URL}/user/username/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error(error);
  }
};

const header = document.querySelector(".header");
const navbar = "../templates/navbar/navbar.html";
fetch(navbar)
  .then((response) => response.text())
  .then((data) => {
    const temporaryElement = document.createElement("div");
    temporaryElement.innerHTML = data;
    const sidebarList = temporaryElement.querySelector(".sidebar-list");
    if (sidebarList) {
      const children = sidebarList.children;
      for (let i = 4; i < children.length - 1; i++) {
        children[i].firstElementChild.classList.add("active");
      }
    }
    header.appendChild(temporaryElement);
  });

const modalContainer = document.querySelector(".modal-container");
const editBtnsContainer = document.querySelector(".edit-btns-container");
const profileEditBtn = document.querySelector(".profile-edit-btn");
const currentLoggedInUsername = localStorage.getItem("authenticatedUser");
const followContainer = document.querySelector(".follow-container");
const followBtn = document.querySelector(".follow-btn");
const followersCountElement = document.querySelector(".followers-count");
const followingsCountElement = document.querySelector(".following-count");

async function updateFollowerFollowingsCounts() {
  const userProfileName = getUsernameFromUrl();
  const user = await insertUserData(userProfileName);
  const followersCount = await getNumberOfFollowers(user.id);
  const followingsCount = await getNumberOfFollowings(user.id);

  followersCountElement.textContent = followersCount;
  followingsCountElement.textContent = followingsCount;
  setTimeout(() => {
    updateFollowerFollowingsCounts();
  }, 50);
}

updateFollowerFollowingsCounts();

async function updateFollowButton(followStatus) {
  const userProfileName = getUsernameFromUrl();
  const user = await insertUserData(userProfileName);
  const isFollowing = await isUserFollowing(user.id);
  followStatus = isFollowing;
  if (followStatus) {
    followBtn.textContent = "Unfollow";
  } else {
    followBtn.textContent = "Follow";
  }
}
function handleFollowAndUnfollow(user, followStatus) {
  if (followStatus) {
    new Notify("Following", `You are now following @${user.username}`, "info");
  } else {
    new Notify(
      "Unfollowing",
      `You are now unfollowing @${user.username}`,
      "info"
    );
  }
}

updateFollowButton();

followBtn.addEventListener("click", async () => {
  const userProfileName = getUsernameFromUrl();
  const user = await insertUserData(userProfileName);
  const followStatus = await toggleFollow(user.id);
  handleFollowAndUnfollow(user, followStatus);
  updateFollowButton(followStatus);
});

if (getUsernameFromUrl() === currentLoggedInUsername) {
  followContainer.style.display = "none";
}
if (getUsernameFromUrl() === currentLoggedInUsername) {
  editBtnsContainer.style.display = "block";
} else {
  editBtnsContainer.style.display = "none";
}
const modalCloseBtn = document.querySelector(".modal-close-btn");
const modalCancelBtn = document.querySelector(".modal-cancel-btn");
profileEditBtn.addEventListener("click", () => {
  modalContainer.classList.add("modal-open");
});

modalCloseBtn.addEventListener("click", () => {
  modalContainer.classList.remove("modal-open");
});

modalContainer.addEventListener("click", (event) => {
  if (event.target === modalContainer) {
    modalContainer.classList.remove("modal-open");
  }
});

modalCancelBtn.addEventListener("click", () => {
  modalContainer.classList.remove("modal-open");
});

function getUsernameFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("username");
}

const username = document.querySelector(".username");
const accountStatusValue = document.querySelector(".status-value");
const accountTypeValue = document.querySelector(".type-value");
const creationDate = document.querySelector(".date-value");
const dateOfBirth = document.querySelector(".dob-value");
const emailValue = document.querySelector(".email-value");
const imageUrl = document.querySelector(".avatar");

const getUsernameInputValue = document.getElementById("username");
const getEmailInputValue = document.getElementById("email");
const getAccountTypeInputValue = document.getElementById("account-type");
const accountTypeOptions = getAccountTypeInputValue.children;

const usernameFromUrl = getUsernameFromUrl();

insertUserData(usernameFromUrl).then((response) => {
  username.textContent = response.username;
  accountStatusValue.textContent = response.accountStatus;
  accountTypeValue.textContent = response.accountType;
  creationDate.textContent = response.creationDate;
  dateOfBirth.textContent = response.dateOfBirth;
  emailValue.textContent = response.email;
  imageUrl.src = response.imageUrl;

  if (accountStatusValue.textContent === "ACTIVE") {
    accountStatusValue.style.color = "green";
    const iconElement = document.createElement("ion-icon");
    iconElement.setAttribute("name", "checkmark-circle-outline");
    iconElement.classList.add("verified");
    username.appendChild(iconElement);
  }
  getUsernameInputValue.setAttribute("value", username.textContent);
  getEmailInputValue.setAttribute("value", emailValue.textContent);
  for (let index = 0; index < accountTypeOptions.length; index++) {
    if (accountTypeOptions[index].value === "PRIVATE") {
      accountTypeOptions[index].setAttribute("selected", "");
    } else {
      accountTypeOptions[index].setAttribute("selected", "");
    }
  }
});

const saveChangesBtn = document.querySelector(".modal-save-btn");

saveChangesBtn.addEventListener("click", updateUser);

saveChangesBtn.addEventListener("click", () => {
  modalContainer.classList.remove("modal-open");
});

const token = getUserToken();
const decodedToken = atob(token.split(" ")[1]);
const [usernameNew, password] = decodedToken.split(":");

// Modal password

const changePasswordBtn = document.querySelector(".profile-edit-btn-password");
const changePasswordCancelBtn = document.querySelector(".cancel-btn");
const modalContainerPassword = document.querySelector(".modal-password");
const closeX = document.querySelector(".close");
changePasswordBtn.addEventListener("click", function () {
  modalContainerPassword.classList.add("modal-open-password");
});

changePasswordCancelBtn.addEventListener("click", function () {
  modalContainerPassword.classList.remove("modal-open-password");
});
closeX.addEventListener("click", function () {
  modalContainerPassword.classList.remove("modal-open-password");
});

modalContainerPassword.addEventListener("click", (event) => {
  if (event.target === modalContainerPassword) {
    modalContainerPassword.classList.remove("modal-open-password");
  }
});

const form = document.querySelector("form");
const passwordChange = document.querySelector(".password-input");
const repeatPasswordChange = document.querySelector(".repeat-password");
const eyeIcon = document.querySelector(".password-toggle");
const passwordInput = document.querySelector("#new-password");
const repeatPasswordInput = document.querySelector("#repeat-password");
const oldPasswordInput = document.querySelector("#old-password");
const passwordError = document.querySelector("#password-match-error");
const modalPasswordChangeBtn = document.querySelector(
  ".modal-change-password-btn"
);
const passwordFail = document.querySelector(".password-fail");
const passwordSuccess = document.querySelector(".password-success");

initPasswordService({
  password: passwordChange,
  repeatPassword: repeatPasswordChange,
  eyeIcon: eyeIcon,
});

validatePasswords({
  passwordInput: passwordInput,
  repeatPasswordInput: repeatPasswordInput,
  error: passwordError,
});

form.onsubmit = function (event) {
  event.preventDefault();
  const oldPassword = oldPasswordInput.value;
  const newPassword = passwordInput.value;
  const repeatNewPassword = repeatPasswordInput.value;

  changePassword(oldPassword, newPassword, repeatNewPassword)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to Change Password");
      }
      passwordSuccess.textContent =
        "Password was changed successfully, you will be redirected to the login page to authenticate with the new password";
      passwordSuccess.style.display = "block";
      setTimeout(() => {
        logout();
        window.location.href = "../login/login.html";
      }, 2500);
      return response.json();
    })
    .catch((error) => {
      passwordFail.textContent = error.message;
      passwordFail.style.display = "block";
    });
};

modalPasswordChangeBtn.addEventListener("click", () => {
  modalContainer.classList.remove("modal-open-password");
});

// Delete Account
const deleteBtn = document.querySelector(".modal-delete-btn");

const modalContainerConfirmation = document.querySelector(
  ".modal-confirmation"
);
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");
const closeModalBtn = document.querySelector(".close-modal-btn");

function openModal() {
  modalContainerConfirmation.style.display = "block";
}

function closeModal() {
  modalContainerConfirmation.style.display = "none";
}

closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", function (event) {
  if (event.target === modalContainerConfirmation) {
    closeModal();
  }
});

yesBtn.addEventListener("click", function () {
  closeModal();
});

noBtn.addEventListener("click", function () {
  closeModal();
});

deleteBtn.addEventListener("click", openModal);
yesBtn.addEventListener("click", deleteUser);
