import axios from "axios";

export const bridgeApi = axios.create({
  baseURL: "https://9vtaan8ux4.execute-api.us-east-1.amazonaws.com/",
});
