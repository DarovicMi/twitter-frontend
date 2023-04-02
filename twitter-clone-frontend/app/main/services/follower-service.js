import { API_URL, getUserToken } from "./authentication.js";
export async function toggleFollow(userId) {
  try {
    if (userId === null && userId === 0) {
      throw new Error("Wrong user id");
    }
    const response = await fetch(`${API_URL}/follow/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function isUserFollowing(profileUserId) {
  try {
    if (profileUserId === null && profileUserId === 0) {
      throw new Error("Wrong user id");
    }
    const response = await fetch(`${API_URL}/isFollowing/${profileUserId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getNumberOfFollowers(userId) {
  try {
    const response = await fetch(`${API_URL}/followers/count/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

export async function getNumberOfFollowings(userId) {
  try {
    const response = await fetch(`${API_URL}/followings/count/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}
