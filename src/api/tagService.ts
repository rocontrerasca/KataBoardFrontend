import api from "./axios";

export const getTags = () =>
  api.get(`tags`).then(res => res.data);