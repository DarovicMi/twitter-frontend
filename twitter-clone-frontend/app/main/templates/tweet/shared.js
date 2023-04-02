import {
  showLoggedInUser,
  isUserLoggedIn,
  logout,
} from "../../services/authentication.js";
import { deleteTweet, updateTweet } from "../../services/tweet-service.js";

// const profileLink = document.querySelector(".profile-link");
// console.log(profileLink);
// const authenticatedUser = localStorage.getItem("authenticatedUser");
// profileLink.href = `../profile/profile.html?username=${authenticatedUser}`;

export function handleEllipsis(
  openElipsis,
  ellipsisIcon,
  user,
  tweetBtnsContainer
) {
  if (ellipsisIcon && showLoggedInUser() === user.username) {
    ellipsisIcon.style.display = "block";
    ellipsisIcon.addEventListener("click", (event) => {
      event.stopPropagation();
    });

    ellipsisIcon.addEventListener("click", function () {
      toggleTweetBtnsContainer(openElipsis, tweetBtnsContainer);
    });

    document.addEventListener("click", function (event) {
      closeTweetBtnsContainer(event, tweetBtnsContainer, ellipsisIcon);
    });
  }
}

function toggleTweetBtnsContainer(openElipsis, tweetBtnsContainer) {
  openElipsis = !openElipsis;
  if (openElipsis) {
    tweetBtnsContainer.classList.add("open");
    tweetBtnsContainer.classList.remove("close");
    setTimeout(() => {
      tweetBtnsContainer.style.display = "block";
    }, 150);
  } else {
    tweetBtnsContainer.classList.add("close");
    tweetBtnsContainer.classList.remove("open");
    setTimeout(() => {
      tweetBtnsContainer.style.display = "none";
    }, 300);
  }
}

function closeTweetBtnsContainer(event, tweetBtnsContainer, ellipsisIcon) {
  if (
    !tweetBtnsContainer.contains(event.target) &&
    !ellipsisIcon.contains(event.target)
  ) {
    tweetBtnsContainer.style.display = "none";
    document.removeEventListener("click", function () {
      closeTweetBtnsContainer(event, tweetBtnsContainer, ellipsisIcon);
    });
  }
}

export function checkIfEdited(edited, editedText) {
  if (edited) {
    editedText.style.display = "block";
  }
}

export function handleDeleteBtnClick(event, modal) {
  modal.style.display = "block";
  event.stopPropagation();
}

export function handleNoBtnClick(event, modal) {
  event.preventDefault();
  modal.style.display = "none";
  event.stopPropagation();
}

export function handleYesBtnClick(event, tweet, modal) {
  if (tweet) {
    event.preventDefault();
    deleteTweet(tweet.id);
    const tweetEl = document.querySelector(`.tweet-${tweet.id}`);
    modal.style.display = "none";
    tweetEl.remove();
    event.stopPropagation();
  }
}

export function handleEditButtonClick(
  openEdit,
  tweetEditInput,
  tweet,
  tweetBtnsContainer,
  tweetMessageContainer,
  cancelButton,
  saveButton,
  warning
) {
  if (!openEdit) {
    tweetEditInput.value = tweet.message;
    tweetEditInput.style.display = "block";
    tweetBtnsContainer.style.display = "none";
    tweetMessageContainer.style.display = "none";
    cancelButton.style.display = "block";
    saveButton.style.display = "block";
    tweetEditInput.focus();
    handleTextareaInput(tweetEditInput, warning);
    updateWarningBasedOnTextareaValue(tweetEditInput, warning);
  }
  if (tweetEditInput.value === null || tweetEditInput.value.trim() === "") {
    saveButton.setAttribute("disabled", "");
  }
  openEdit = !openEdit;
}

export function handleCancelBtnClick(
  event,
  tweetEditInput,
  tweetMessageContainer,
  tweetBtnsContainer,
  cancelButton,
  saveButton,
  warning
) {
  event.preventDefault();
  tweetEditInput.style.display = "none";
  tweetMessageContainer.style.display = "block";
  tweetBtnsContainer.style.display = "block";
  cancelButton.style.display = "none";
  saveButton.style.display = "none";
  warning.style.display = "none";
}

export async function handleSaveBtnClick(
  event,
  tweet,
  tweetEditInput,
  cancelButton,
  saveButton,
  tweetBtnsContainer,
  tweetMessageContainer,
  editedText,
  warning
) {
  event.preventDefault();
  if (typeof updateTweet === "function") {
    const result = await updateTweet(tweet.id, tweetEditInput.value);

    if (result.success) {
      new Notify("Success", "Tweet updated successfully", "success", {
        vAlign: "top",
        hAlign: "left",
        autoClose: true,
        autoCloseDuration: 2000,
        closeOnCrossClick: true,
        closeOnNotifyClick: false,
      });
      tweetEditInput.style.display = "none";
      cancelButton.style.display = "none";
      saveButton.style.display = "none";
      tweetBtnsContainer.style.display = "block";
      tweetMessageContainer.textContent = tweetEditInput.value;
      tweetMessageContainer.style.display = "block";
      editedText.style.display = "block";
      tweet.message = tweetEditInput.value;
      warning.style.display = "none";
    } else {
      new Notify("Error", result.message, "error");
    }
  }
}

function createLogoutButton() {
  const logoutBtn = document.createElement("a");
  logoutBtn.href = "../login/login.html";
  logoutBtn.classList.add("btn-logout");
  logoutBtn.textContent = "Logout";
  return logoutBtn;
}

export function displayPageAfterUserLogin() {
  const footerHeading = document.querySelector(".heading-secondary");
  const footerDescription = document.querySelector(".footer-description");
  const footerContainerBtn = document.querySelector(".footer-btn");
  const searchBarAfterLogin = document.querySelector(
    ".search-section-loggedin"
  );
  const sectionTweet = document.querySelector(".section-tweet");
  const ctaBtns = document.querySelectorAll(".cta-btn");

  if (isUserLoggedIn()) {
    footerHeading.textContent = "Welcome to Twitter";
    footerDescription.textContent =
      "Find out the most exciting news happening in the world";

    const logoutBtn = createLogoutButton();
    footerContainerBtn.appendChild(logoutBtn);

    searchBarAfterLogin.style.display = "block";
    sectionTweet.style.display = "block";

    if (logoutBtn) {
      ctaBtns.forEach((el) => (el.style.display = "none"));
      logoutBtn.addEventListener("click", logout);
    }
  }
}

export function handleTextareaInput(
  tweetEditInput,
  warning,
  message = "Max character limit reached"
) {
  tweetEditInput.addEventListener("input", function () {
    updateWarningBasedOnTextareaValue(tweetEditInput, warning, message);
  });
}

export function updateWarningBasedOnTextareaValue(
  tweetEditInput,
  warning,
  message = "Max character limit reached"
) {
  const maxLength = parseInt(tweetEditInput.getAttribute("maxlength"));
  warning.textContent = message;
  if (tweetEditInput.value.length === maxLength) {
    warning.style.display = "block";
  } else {
    warning.style.display = "none";
  }
}
