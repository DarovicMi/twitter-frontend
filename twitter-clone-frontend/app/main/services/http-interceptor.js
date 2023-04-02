"use strict";
import { getUserToken } from "./authentication.js";

export const HttpInterceptor = async (url, options = {}) => {
  try {
    const authToken = getUserToken();

    if (authToken) {
      options.headers = {
        ...options.headers,
        Authorization: `${authToken}`,
      };
    }

    const response = await fetch(url, options);

    if (response.status === 401) {
      setTimeout(() => {
        window.location.href = "../login/login.html";
        setTimeout(() => {
          handleErrorMessage("Unauthorized");
        }, 0);
      }, 2000);
    }

    if (!response.ok) {
      throw new Error(
        "An unexpected network error has occured\n Could not fetch any data"
      );
    }
    return response;
  } catch (error) {
    handleErrorMessage(error.message);
  }
};

function handleErrorMessage(message) {
  new Notify("error", message, "error");
}
