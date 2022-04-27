import Request from "./Request";

const client = new Request();

export default {
  fetch() {
    return client.request.get(`/shop`);
  },

};
