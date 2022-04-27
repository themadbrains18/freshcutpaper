import Request from "./Request";

const client = new Request();

export default {
  fetchAll() {
    return client.request.get(`/fonts`);
  },
  update(fonts) {
    return client.request.post(`/fonts`, {fonts});
  },
}
