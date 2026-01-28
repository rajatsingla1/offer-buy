import axios from "axios";

const instance = (baseURL: string) =>
  axios.create({
    baseURL,
  });

const client = {
  // root: instance("https://api.publicdomain.co.in"),
  root: instance("http://localhost:8000"),
};

export default client;
