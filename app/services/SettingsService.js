import Request from "./Request";

const client = new Request();

export default {
  fetchAll() {
    return client.request.get(`/settings`);
  },
  update(settings) {
    return client.request.post(`/settings`, settings);
  }
}
