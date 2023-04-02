import {
  API_URL,
  getUserToken,
  getLoggedInUserDetails,
  showLoggedInUser,
  isUserLoggedIn,
} from "./authentication.js";

export function autoResizeTextarea(textarea) {
  textarea.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = `${Math.max(
      this.scrollHeight,
      parseFloat(
        window.getComputedStyle(this, null).getPropertyValue("font-size")
      ) * 1.2
    )}px`;
  });

  const event = new Event("input", { bubbles: true });
  textarea.dispatchEvent(event);
}

export function checkTextareaInput(textarea, button) {
  textarea.addEventListener("input", function () {
    if (textarea.value.length > 0 && textarea.value.trim() !== "") {
      button.removeAttribute("disabled");
    } else {
      button.setAttribute("disabled", true);
    }
  });
}

export async function createComment(tweetId, comment) {
  try {
    const response = await fetch(`${API_URL}/tweet/${tweetId}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
      body: JSON.stringify(comment),
    });

    if (!response.ok || response.status === 500) {
      throw new Error(
        "An unexpected error happened while trying to reply to this tweet, please try again later"
      );
    }

    if (!response.status === 401) {
      throw new Error("You are unauthorized to edit this comment");
    }

    new Notify("Success", "Reply created successfully", "success");
    return response.json();
  } catch (error) {
    new Notify("error", error.message, "error");
  }
}

export async function getTweetComments(tweetId) {
  try {
    const response = await fetch(`${API_URL}/tweet/${tweetId}/comments`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(
        "An unexpected error happend\n Failed to fetch tweet \n Failed to fetch comments"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    new Notify("Error", error.message, "error");
  }
}
export async function updateComment(commentId, comment) {
  try {
    const response = await fetch(`${API_URL}/comment/${commentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) {
      throw new Error(
        "An unexpected error has happend while trying to update the comment, try again"
      );
    }
    const data = await response.text();
    if (data !== null) {
      new Notify("Success", "Comment was successfully updated", "success");
    }
    return data;
  } catch (error) {
    new Notify("Error", error.message, "error");
  }
}

export async function deleteComment(commentId) {
  try {
    const response = await fetch(`${API_URL}/comment/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(
        "An unexpected error has happend while trying to delete the comment, please try again"
      );
    }
    const data = await response.text();
    if (data !== null) {
      new Notify("Success", "Comment was sucessfully deleted", "success");
    }
    return data;
  } catch (error) {
    new Notify("Error", error.message, "error");
  }
}

export async function getRepliesForComment(commentId) {
  try {
    const response = await fetch(
      `${API_URL}/comment/${commentId}/replies?isReply=true`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: getUserToken(),
        },
      }
    );
    if (!response.ok) {
      throw new Error(
        "An error has occured while trying to display the replies"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function postReply(commentId, replyText) {
  try {
    const response = await fetch(`${API_URL}/comment/${commentId}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
      body: replyText,
    });
    if (!response.ok) {
      throw new Error("An error has occured when trying to post a reply");
    }
    const data = await response.json();
    if (data !== null) {
      new Notify("Success", "Reply posted", "success");
    }
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchCommentCountByTweetId(tweetId) {
  try {
    const response = await fetch(`${API_URL}/comment/count/${tweetId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(
        "An unexpected error happend while trying to fetch no. comments"
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
