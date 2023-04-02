import { API_URL, getUserToken } from "./authentication.js";

export async function likeTweet(tweetId) {
  const response = await fetch(`${API_URL}/like/tweet/${tweetId}`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
      Authorization: getUserToken(),
    },
  });
  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`An error occured: ${errorMessage}`);
  }
  return response.status;
}

export async function unlikeTweet(tweetId) {
  const response = await fetch(`${API_URL}/like/tweet/${tweetId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(
      "An unexpected error has happend (delete), please try again!"
    );
  }
  return await response.json();
}
