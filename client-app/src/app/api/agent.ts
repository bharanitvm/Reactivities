import { IUser, IUserFormValues } from "./../models/user";
import { history } from "./../../index";
import { IActivitiesEnvelope, IActivity } from "./../models/activity";
import axios, { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { IProfile, IPhoto } from "../models/profile";

//axios.defaults.baseURL = "http://localhost:5000/api";
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

axios.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem("jwt");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(undefined, (error) => {
  if (error.message === "Network Error" && !error.response) {
    toast.error("Network error - make sure API is running!");
  }
  const { status, data, config, headers } = error.response;
  if (status === 404) history.push("notfound");
  if (
    status === 401 &&
    headers["www-authenticate"].substring(0, 66) ===
      'Bearer error="invalid_token", error_description="The token expired'
  ) {
    window.localStorage.removeItem("jwt");
    history.push("/");
    toast.info("Your session has expired, please login again");
    //console.log(error.response);
  }
  if (
    status === 400 &&
    config.method === "get" &&
    data.errors.hasOwnProperty("id")
  ) {
    history.push("/notfound");
  }
  if (status === 500) {
    toast.error("Server error - check the terminal for more info!");
  }
  throw error.response;
});

const responseBody = (response: AxiosResponse) => response.data;

/*
const sleep = (ms: number) => (response: AxiosResponse) =>
  new Promise<AxiosResponse>((resolve) =>
    setTimeout(() => resolve(response), ms)
  );
*/

const request = {
  get: (url: string) =>
    axios
      .get(url) /*.then(sleep(1000))*/
      .then(responseBody),
  post: (url: string, body: {}) =>
    axios
      .post(url, body) /*.then(sleep(1000))*/
      .then(responseBody),
  put: (url: string, body: {}) =>
    axios
      .put(url, body) /*.then(sleep(1000))*/
      .then(responseBody),
  del: (url: string) =>
    axios
      .delete(url) /*.then(sleep(1000))*/
      .then(responseBody),
  postForm: (url: string, file: Blob) => {
    let formData = new FormData();
    formData.append("File", file);
    return axios
      .post(url, formData, {
        headers: { "Content-type": "multipart/form-data" },
      })
      .then(responseBody);
  },
};

const Activities = {
  list: (params: URLSearchParams): Promise<IActivitiesEnvelope> =>
    //request.get(`/activities?limit=${limit}&offset=${page ? page * limit! : 0}`), //
    axios
      .get("/activities", { params: params })
      /*.then(sleep(1000))*/
      .then(responseBody),
  details: (id: string) => request.get(`/activities/${id}`),
  create: (activity: IActivity) => request.post("/activities", activity),
  update: (activity: IActivity) =>
    request.put(`/activities/${activity.id}`, activity),
  delete: (id: string) => request.del(`/activities/${id}`),
  attend: (id: string) => request.post(`/activities/${id}/attend`, {}),
  unattend: (id: string) => request.del(`/activities/${id}/attend`),
};

const User = {
  Current: (): Promise<IUser> => request.get("/user"),
  login: (user: IUserFormValues): Promise<IUser> =>
    request.post("/user/login", user),
  register: (user: IUserFormValues): Promise<IUser> =>
    request.post("/user/register", user),
};

const Profiles = {
  get: (username: string): Promise<IProfile> =>
    request.get(`/profiles/${username}`),
  uploadPhoto: (photo: Blob): Promise<IPhoto> =>
    request.postForm(`/photos`, photo),
  setMainPhoto: (id: string) => request.post(`/photos/${id}/setMain`, {}),
  deletePhoto: (id: string) => request.del(`/photos/${id}`),

  follow: (username: string) =>
    request.post(`/profiles/${username}/follow`, {}),
  unfollow: (username: string) => request.del(`/profiles/${username}/follow`),
  listFollowings: (username: string, predicate: string) =>
    request.get(`/profiles/${username}/follow?predicate=${predicate}`),
  listActivities: (username: string, predicate: string) =>
    request.get(`/profiles/${username}/activities?predicate=${predicate}`),
};

export default {
  Activities,
  User,
  Profiles,
};
