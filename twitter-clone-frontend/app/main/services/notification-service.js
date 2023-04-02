import { API_URL, getUserToken } from "./authentication.js";

export async function getNotifications() {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: getUserToken(),
      },
    });
    if (!response.ok) {
      throw new Error("An unexpected error has happend");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function markNotificationsAsRead() {
  const response = await fetch(`${API_URL}/notifications/mark-as-read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: getUserToken(),
    },
  });

  if (response.ok) {
    new Notify("Successful Read", "Notifications marked as read", "info");
  } else {
    new Notify("Unable to read", "Could not read notifications", "error");
  }
}
