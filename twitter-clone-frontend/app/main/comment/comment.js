import { getLoggedInUser } from "../services/authentication.js";
import { findTweetById } from "../services/tweet-service.js";
import { updateComment } from "../services/comment-service.js";

const queryParams = new URLSearchParams(window.location.search);
const tweetId = queryParams.get("tweetId");

const user = getLoggedInUser();
user.then((user) => {
  const commentImg = document.querySelector(".comment-img");
  commentImg.src = user.imageUrl;
  commentImg.alt = `${user.username} Image`;
});

findTweetById(tweetId)
  .then((tweet) => {
    const replyTo = document.querySelector(".replying-to");
    const tweetUser = document.querySelector(".tweet-user");
    replyTo.textContent = `Replying to `;
    replyTo.appendChild(tweetUser);
    tweetUser.textContent = `@${tweet.user.username}`;
  })
  .catch((error) => new Notify("Error", error.message, "error"));

export function handleEllipsisCommentContainer(ellipsis, dropdown) {
  document.addEventListener("click", (event) => {
    if (!ellipsis.contains(event.target) && !dropdown.contains(event.target)) {
      dropdown.classList.remove("dropdown-container-visible");
    }
  });
}

export function handleModal(modal, value) {
  modal.style.display = value;
}

export function handleCommentEllipsis(event, dropdown, editBtn, deleteBtn) {
  dropdown.classList.toggle("dropdown-container-visible");
  if (dropdown.classList.contains("dropdown-container-visible")) {
    editBtn.style.display = "block";
    deleteBtn.style.display = "block";
  } else {
    editBtn.style.display = "none";
    deleteBtn.style.display = "none";
  }
  event.stopPropagation();
}
export function handleEditCommentButton(
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
) {
  dropdown.classList.remove("dropdown-container-visible");
  formTextarea.value = comment.text;
  editBtn.style.display = "none";
  deleteBtn.style.display = "none";
  commentText.style.display = "none";
  commentForm.style.display = "block";
  formTextarea.style.width = "100%";
  actionBtns.style.display = "flex";
  saveButton.style.display = "block";
  cancelButton.style.display = "block";
  formTextarea.focus();
  event.stopPropagation();
}

export async function handleSaveCommentButton(
  commentText,
  comment,
  formTextarea,
  actionBtns,
  commentForm,
  edited
) {
  await updateComment(comment.id, {
    text: formTextarea.value,
  });

  commentText.textContent = formTextarea.value;
  commentText.style.display = "block";
  actionBtns.style.display = "none";
  comment.text = formTextarea.value;
  commentForm.style.display = "none";
  edited.style.display = "block";
}

export function handleCancelCommentButton(
  commentForm,
  commentText,
  actionBtns
) {
  commentForm.style.display = "none";
  commentText.style.display = "block";
  actionBtns.style.display = "none";
}
