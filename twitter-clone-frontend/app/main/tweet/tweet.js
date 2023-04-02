"use strict";

import {
  isUserLoggedIn,
  showLoggedInUser,
} from "../services/authentication.js";
import {
  autoResizeTextarea,
  checkTextareaInput,
  createComment,
  deleteComment,
  getTweetComments,
  postReply,
  getRepliesForComment,
  fetchCommentCountByTweetId,
} from "../services/comment-service.js";
import { likeTweet } from "../services/like-service.js";
import { getLoggedInUserId } from "../services/user-service.js";

import {
  handleCancelCommentButton,
  handleCommentEllipsis,
  handleEditCommentButton,
  handleEllipsisCommentContainer,
  handleModal,
  handleSaveCommentButton,
} from "../comment/comment.js";
import { formatTimestamp, findTweetById } from "../services/tweet-service.js";

import {
  handleEllipsis,
  checkIfEdited,
  handleCancelBtnClick,
  handleDeleteBtnClick,
  handleEditButtonClick,
  handleNoBtnClick,
  handleSaveBtnClick,
  handleYesBtnClick,
  displayPageAfterUserLogin,
} from "../templates/tweet/shared.js";

const queryParams = new URLSearchParams(window.location.search);
const tweetId = queryParams.get("tweetId");

const arrowIcon = document.querySelector(".arrow-back-icon");
arrowIcon.addEventListener("click", () => {
  window.location.href = "../home/home.html";
});

const main = document.querySelector(".main");
const insertSectionTweet = fetch("../templates/tweet/shared.html");

insertSectionTweet
  .then((response) => response.text())
  .then((data) => {
    const content = document.createElement("div");
    content.innerHTML = data;
    main.appendChild(content);
    const elements = {
      head: document.querySelector("head"),
      title: document.querySelector("title"),
      header: document.querySelector(".header"),
      ellipsisIcon: document.querySelector(".elipse"),
      tweetBtnsContainer: document.querySelector(".tweet-btns-container"),
      tweetEditInput: document.querySelector(".tweet-edit-input"),
      warning: document.querySelector(".warning"),
      tweetMessageContainer: document.querySelector(".tweet-message"),
      tweetUsername: document.querySelector(".tweet-username"),
      tweetUserImage: document.querySelector(".tweet-user-image"),
      tweetTimestamp: document.querySelector(".tweet-timestamp"),
      cancelButton: document.querySelector(".tweet-cancel-btn"),
      saveButton: document.querySelector(".tweet-save-btn"),
      editBtn: document.querySelector(".tweet-btn-edit"),
      deleteBtn: document.querySelector(".tweet-btn-delete"),
      editedText: document.querySelector(".edited"),
      modal: document.getElementById("myModal"),
      tweetBody: document.querySelector(".tweet-body"),
      searchBar: document.querySelector(".search-section-loggedin"),
      arrowIcon: document.querySelector(".arrow-back-icon"),
      footer: document.querySelector(".footer"),
      commentIcon: document.querySelector(".tweet-icons"),
      likeIcon: document.querySelector(".like"),
    };
    const likeCount = createNumberOfLikes();
    elements.commentIcon.appendChild(likeCount);

    function createNumberOfLikes() {
      const likeCount = document.createElement("span");
      likeCount.classList.add("like-count");
      likeCount.textContent = "0";
      return likeCount;
    }

    displayCommentCount(tweetId, elements.commentIcon);

    if (isUserLoggedIn()) {
      elements.searchBar.style.display = "block";
    }

    function loadNavbar() {
      fetch("../templates/navbar/navbar.html")
        .then((response) => response.text())
        .then((data) => {
          elements.header.innerHTML = data;
          const profileLink = elements.header.querySelector("#profile-link");
          profileLink.addEventListener("click", () => {
            const authenticatedUser = localStorage.getItem("authenticatedUser");
            window.location.href = `../profile/profile.html?username=${authenticatedUser}`;
          });
        });
    }
    loadNavbar();

    function loadSearchBar() {
      fetch("../templates/search-bar/search-bar.html")
        .then((response) => response.text())
        .then((data) => {
          elements.searchBar.innerHTML = data;
        });
    }

    loadSearchBar();

    function loadFooter(callback) {
      fetch("../templates/footer/footer.html")
        .then((response) => response.text())
        .then((data) => {
          elements.footer.innerHTML = data;

          if (callback) {
            callback();
          }
        });
    }

    loadFooter(displayPageAfterUserLogin);

    findTweetById(tweetId)
      .then(displayTweetData)
      .catch((error) => new Notify("Error", error.message, "error"));

    function displayTweetData(data) {
      const { message, user, createdAt, edited } = data;
      elements.tweetBody.classList.add(`tweet-${data.id}`);
      elements.tweetUsername.textContent = user.username;
      elements.tweetTimestamp.textContent = formatTimestamp(createdAt);
      elements.tweetMessageContainer.textContent = message;
      elements.tweetUserImage.src = user.imageUrl;
      elements.tweetUserImage.alt = `Photo of ${user.username}`;
      elements.title.textContent = `${user.username} on Twitter: "${message}"`;
      elements.head.appendChild(elements.title);
      const profileLink = elements.tweetBody.querySelector(".profile-link");
      const authenticatedUser = localStorage.getItem("authenticatedUser");
      profileLink.href = `../profile/profile.html?username=${data.user.username}`;

      const storedLikes = localStorage.getItem(`tweet-${data.id}-likes`);
      data.likes = storedLikes ? JSON.parse(storedLikes) : [];
      const loggedInUserId = getLoggedInUserId();
      data.likedByCurrentUser = data.likes.includes(loggedInUserId);

      if (data.likedByCurrentUser) {
        elements.likeIcon.classList.add("liked");
        elements.likeIcon.name = "heart";
      } else {
        elements.likeIcon.classList.remove("liked");
        elements.likeIcon.name = "heart-outline";
      }

      const likeCountEl = document.querySelector(".like-count");
      likeCountEl.textContent = data.likes.length;

      elements.likeIcon.addEventListener("click", async (event) => {
        event.stopPropagation();
        const loggedInUserId = getLoggedInUserId();
        const responseStatus = await likeTweet(data.id);

        data.likedByCurrentUser = !data.likedByCurrentUser;

        if (data.likedByCurrentUser && responseStatus === 201) {
          data.likeCount++;
          data.likes.push(loggedInUserId);
        } else {
          data.likeCount--;
          data.likes = data.likes.filter((userId) => userId !== loggedInUserId);
        }

        if (data.likedByCurrentUser) {
          elements.likeIcon.classList.add("liked");
          elements.likeIcon.name = "heart";
        } else {
          elements.likeIcon.classList.remove("liked");
          elements.likeIcon.name = "heart-outline";
        }

        likeCountEl.textContent = data.likes.length;
        localStorage.setItem(
          `tweet-${data.id}-likes`,
          JSON.stringify(data.likes)
        );
      });

      let openElipsis = false;
      let openEdit = false;

      handleEllipsis(
        openElipsis,
        elements.ellipsisIcon,
        user,
        elements.tweetBtnsContainer
      );
      checkIfEdited(edited, elements.editedText);

      elements.editBtn.addEventListener("click", () => {
        handleEditButtonClick(
          openEdit,
          elements.tweetEditInput,
          data,
          elements.tweetBtnsContainer,
          elements.tweetMessageContainer,
          elements.cancelButton,
          elements.saveButton,
          elements.warning
        );
      });
      elements.cancelButton.addEventListener("click", (event) => {
        handleCancelBtnClick(
          event,
          elements.tweetEditInput,
          elements.tweetMessageContainer,
          elements.tweetBtnsContainer,
          elements.cancelButton,
          elements.saveButton,
          elements.warning
        );
      });

      elements.saveButton.addEventListener("click", (event) => {
        handleSaveBtnClick(
          event,
          data,
          elements.tweetEditInput,
          elements.cancelButton,
          elements.saveButton,
          elements.tweetBtnsContainer,
          elements.tweetMessageContainer,
          elements.editedText,
          elements.warning
        );
      });
      elements.deleteBtn.addEventListener("click", (event) =>
        handleDeleteBtnClick(event, elements.modal)
      );

      noBtn.addEventListener("click", (event) =>
        handleNoBtnClick(event, elements.modal)
      );

      yesBtn.addEventListener("click", (event) => {
        handleYesBtnClick(event, data, elements.modal);
        window.location.href = "../home/home.html";
      });
    }
  });

async function displayCommentCount(tweetId, commentContainer) {
  const commentCount = await fetchCommentCountByTweetId(tweetId);
  const commentCountElement = document.createElement("span");
  commentCountElement.classList.add("comment-number");
  commentCountElement.textContent = `${commentCount}`;
  commentContainer.appendChild(commentCountElement);
}

// Comments

async function loadComment() {
  try {
    const response = await fetch("../comment/comment.html");
    const data = await response.text();
    createCommentUI(data);
  } catch (error) {
    new Notify("Error", error.message, "error");
  }
}

async function createCommentUI(html) {
  const createCommentContainer = document.createElement("div");
  createCommentContainer.classList.add("create-comment-container");
  createCommentContainer.innerHTML = html;
  main.appendChild(createCommentContainer);
  const textarea = document.querySelector(".comment-textarea");
  autoResizeTextarea(textarea);
  const commentBtn = document.querySelector(".comment-btn");
  checkTextareaInput(textarea, commentBtn);

  const sectionComments = document.querySelector(".section-comments");
  sectionComments.innerHTML = "";
  commentBtn.addEventListener("click", async () => {
    await handleCommentCreation(tweetId, textarea.value);
    const commentCountElement = document.querySelector(`.comment-number`);
    const updatedCommentCount =
      parseInt(commentCountElement.textContent, 10) + 1;
    commentCountElement.textContent = updatedCommentCount;
    textarea.value = "";
  });

  await getComments(tweetId, sectionComments);
}

async function handleCommentCreation(tweetId, commentText) {
  try {
    await createComment(tweetId, { text: commentText });
    const sectionComments = document.querySelector(".section-comments");
    displayCommentDynamically(tweetId, sectionComments);
  } catch (error) {
    new Notify("Error", error.message, "error");
  }
}

function createCommentHTML(comment, tweet, loggedInUser) {
  const showEllipsis =
    loggedInUser === comment.user.username ? "block" : "none";
  return `
    <div class="comments comment-${comment.id} comment">
      <div class="comment-header space-between p-small">
        <div>
          <a href="#" class="comment-link">
            <img
              class="comment-img fix"
              src="${comment.user.imageUrl}"
              alt="${comment.user.username} Photo"
            />
          </a>
          <div class="comment-reply">
            <span class="replying-to m-left-sm">
              Replying to
              <span class="tweet-user">@${tweet.user.username}</span>
            </span>
          </div>
          <p class="comment-username m-left-sm">@${comment.user.username}</p>
        </div>
        <p class="timestamp">${formatTimestamp(comment.createdAt)}</p>
        <span class="edited"><em>(edited)</em></span>
        <div class="ellipsis-container" style="display:${showEllipsis};">
          <span class="comment-ellipsis">⋮</span>
          <div class="dropdown-container">
            <button class="edit-comment-btn edit-btn">Edit</button>
            <button class="delete-comment-btn delete-btn">Delete</button>
          </div>
        </div>
      </div>
      <div id="confirmationModal" class="modal">
  <div class="modal-content">
    <div class="modal-header">
      <span class="close">&times;</span>
    </div>
    <div class="modal-body">
      <h3>Are you sure?</h3>
      <p class="warning">This action cannot be undone</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn" id="yesBtn">Yes</button>
      <button type="button" class="btn" id="noBtn">No</button>
    </div>
  </div>
</div>
      <div>
      <p class="comment-text">
      ${comment.text}
      </p>
      <form class="comment-form">
        <textarea class="comment-textarea form-textarea"></textarea>
      </form>
      <div class="edit-action-btns">
        <button class="save-btn">Save</button>
        <button class="cancel-btn">Cancel</button>
      </div>
      </div>
        <div class="reply-form-container">
          <form class="reply-form">
            <textarea placeholder="Write your reply..." class="comment-textarea reply-textarea"></textarea>
            <div class="post-reply-container">
            <button type="submit" disabled class="comment-btn submit-reply-btn">Post Reply</button>
            </div>
          </form>
        </div>
        <div class="replies-container">
        </div>
        <div class="show-replies">
        <button type="button" class="show-replies-btn">Show comment replies &darr;</button>
        <button style="display:none;" type="button" class="hide-replies-btn">Hide comment replies &uarr;</button>
      </div>
      </div>

  `;
}

async function getComments(tweetId, comments) {
  try {
    const data = await getTweetComments(tweetId);
    const tweet = await findTweetById(tweetId);
    const loggedInUser = showLoggedInUser();
    data.forEach((comment) => {
      if (comment.replies !== null) {
        const commentHTML = createCommentHTML(comment, tweet, loggedInUser);
        comments.insertAdjacentHTML("beforeend", commentHTML);
        const commentElement = comments.lastElementChild;
        const isEdited = comment.edited ? true : false;
        handleCommentFlow(commentElement, comment, isEdited);
        handleCommentReplies(commentElement, comment);
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function handleCommentFlow(commentElement, comment, edited) {
  const ellipsis = commentElement.querySelector(".comment-ellipsis");
  const dropdown = commentElement.querySelector(".dropdown-container");
  const editBtn = commentElement.querySelector(".edit-comment-btn");
  const deleteBtn = commentElement.querySelector(".delete-comment-btn");
  const commentText = commentElement.querySelector(".comment-text");
  const commentForm = commentElement.querySelector(".comment-form");
  const formTextarea = commentElement.querySelector(".form-textarea");
  const actionBtns = commentElement.querySelector(".edit-action-btns");
  const saveButton = commentElement.querySelector(".save-btn");
  const cancelButton = commentElement.querySelector(".cancel-btn");
  const modal = commentElement.querySelector(".modal");
  const yesBtn = commentElement.querySelector("#yesBtn");
  const noBtn = commentElement.querySelector("#noBtn");
  const editedText = commentElement.querySelector(".edited");

  ellipsis.addEventListener("click", (event) => {
    handleCommentEllipsis(event, dropdown, editBtn, deleteBtn);
  });
  handleEllipsisCommentContainer(ellipsis, dropdown);

  editBtn.addEventListener("click", (event) => {
    handleEditCommentButton(
      event,
      dropdown,
      editBtn,
      deleteBtn,
      commentText,
      formTextarea,
      comment,
      commentForm,
      actionBtns,
      saveButton,
      cancelButton
    );
  });

  deleteBtn.addEventListener("click", (event) => {
    handleModal(modal, "block");
    event.stopPropagation();
  });

  yesBtn.addEventListener("click", async () => {
    const currentComment = document.querySelector(`.comment-${comment.id}`);
    await deleteComment(comment.id);
    handleModal(modal, "none");
    currentComment.remove();
  });

  noBtn.addEventListener("click", () => {
    handleModal(modal, "none");
  });

  saveButton.addEventListener("click", () => {
    handleSaveCommentButton(
      commentText,
      comment,
      formTextarea,
      actionBtns,
      commentForm,
      editedText
    );
  });

  checkIfEdited(edited, editedText);

  cancelButton.addEventListener("click", () => {
    handleCancelCommentButton(commentForm, commentText, actionBtns);
  });
}

function handleCommentReplies(commentElement, comment) {
  const replyForm = commentElement.querySelector(".reply-form");
  const replyButton = commentElement.querySelector(".submit-reply-btn");
  const repliesContainer = commentElement.querySelector(".replies-container");
  const showRepliesBtn = commentElement.querySelector(".show-replies-btn");
  const hideRepliesBtn = commentElement.querySelector(".hide-replies-btn");
  const textarea = replyForm.querySelector(".reply-textarea");

  checkTextareaInput(textarea, replyButton);

  replyForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });

  showRepliesBtn.addEventListener("click", async () => {
    replyForm.style.display = "block";
    repliesContainer.style.display = "block";
    hideRepliesBtn.style.display = "block";
    showRepliesBtn.style.display = "none";

    await fetchAndRenderReplies(comment.id, commentElement, comment);
  });

  hideRepliesBtn.addEventListener("click", () => {
    replyForm.style.display = "none";
    repliesContainer.style.display = "none";
    showRepliesBtn.style.display = "block";
    hideRepliesBtn.style.display = "none";
  });

  replyButton.addEventListener("click", async (event) => {
    event.stopPropagation();
    const replyText = replyForm.querySelector(".reply-textarea").value;
    if (replyText) {
      try {
        const reply = await postReply(comment.id, replyText);
        const replyElement = createReplyElement(reply, comment);
        const repliesContainer =
          commentElement.querySelector(".replies-container");
        repliesContainer.appendChild(replyElement);
        replyForm.querySelector(".reply-textarea").value = "";
        const commentCountElement = document.querySelector(`.comment-number`);
        const updatedCommentCount =
          parseInt(commentCountElement.textContent, 10) + 1;
        commentCountElement.textContent = updatedCommentCount;
      } catch (error) {
        console.error(error);
      }
    }
  });
}

async function displayCommentDynamically(tweetId, sectionComments) {
  sectionComments.innerHTML = "";
  await getComments(tweetId, sectionComments);
}

async function fetchAndRenderReplies(commentId, commentElement, comment) {
  if (commentElement.classList.contains("replies-rendered")) {
    return;
  }
  const replies = await getRepliesForComment(commentId);

  const repliesContainer = commentElement.querySelector(".replies-container");
  replies.forEach((reply) => {
    const existingReplyElement = repliesContainer.querySelector(
      `.reply-element[data-reply-id="${reply.id}"]`
    );
    if (!existingReplyElement) {
      const replyElement = createReplyElement(reply, comment);
      replyElement.setAttribute("data-reply-id", reply.id);
      repliesContainer.appendChild(replyElement);
    }
  });
  commentElement.classList.add("replies-rendered");
}

function createReplyElementContainer() {
  const replyElement = document.createElement("div");
  replyElement.classList.add("reply-element");
  return replyElement;
}
function createReplyUserImage(reply) {
  const replyUserImage = document.createElement("img");
  replyUserImage.classList.add("comment-img");
  replyUserImage.src = reply.user.imageUrl;
  return replyUserImage;
}

function createReplyUserContainer() {
  const replyUserContainer = document.createElement("div");
  replyUserContainer.classList.add("reply-user-container");
  return replyUserContainer;
}

function userPlusImgDiv() {
  const userAndImgDiv = document.createElement("div");
  userAndImgDiv.classList.add("user-img-div");
  return userAndImgDiv;
}

function createReplyToSpan() {
  const replyTo = document.createElement("span");
  replyTo.classList.add("replying-to");
  replyTo.textContent = "Replying to: ";
  return replyTo;
}

function createCurrentCommentUser(comment) {
  const tweetUser = document.createElement("span");
  tweetUser.classList.add("reply-user-tweet");
  tweetUser.textContent = `@${comment.user.username}`;
  return tweetUser;
}

function createReplyAndUsername() {
  const replyAndUsername = document.createElement("div");
  replyAndUsername.classList.add("text");
  return replyAndUsername;
}

function createReplyUser(reply) {
  const replyUser = document.createElement("p");
  replyUser.classList.add("reply-user");
  replyUser.textContent = `@${reply.user.username}`;
  return replyUser;
}

function createLink() {
  const link = document.createElement("a");
  return link;
}

function createReplyElement(reply, comment) {
  const replyElement = createReplyElementContainer();
  replyElement.classList.add("reply-element");
  replyElement.setAttribute("data-reply-id", reply.id);

  const replyUserImage = createReplyUserImage(reply);
  const replyUserContainer = createReplyUserContainer();
  const userAndImgDiv = userPlusImgDiv();
  const replyTo = createReplyToSpan();
  const tweetUser = createCurrentCommentUser(comment);
  const replyAndUsername = createReplyAndUsername();
  const replyUser = createReplyUser(reply);
  const link = createLink();

  replyTo.appendChild(tweetUser);
  replyAndUsername.appendChild(replyTo);
  link.appendChild(replyUserImage);
  userAndImgDiv.appendChild(link);

  replyAndUsername.appendChild(replyUser);
  userAndImgDiv.appendChild(replyAndUsername);
  replyUserContainer.appendChild(userAndImgDiv);
  replyElement.appendChild(replyUserContainer);

  const timestamp = createTimestamp(reply);
  const timestampContainer = createTimestampContainer();

  timestampContainer.appendChild(timestamp);
  replyUserContainer.appendChild(timestampContainer);

  const replyText = createReplyText(reply);
  replyElement.appendChild(replyText);

  return replyElement;
}

function createReplyText(reply) {
  const text = document.createElement("p");
  text.classList.add("reply-text");
  text.textContent = reply.text;
  return text;
}

function createTimestampContainer() {
  return document.createElement("div");
}

function createTimestamp(reply) {
  const timestamp = document.createElement("p");
  timestamp.classList.add("timestamp");
  timestamp.textContent = formatTimestamp(reply.createdAt);
  return timestamp;
}

loadComment();
