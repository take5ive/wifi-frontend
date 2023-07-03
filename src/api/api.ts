import axios from "axios";

const api = axios.create({
    baseURL: "http://ec2-54-89-140-79.compute-1.amazonaws.com:3001/"
})

export default api