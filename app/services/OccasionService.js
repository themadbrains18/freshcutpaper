import Request from "./Request";

const client = new Request();

export default {
  fetchAll() {
    return client.request.get(`/occasions`);
  },
  update(occasions) {
    return client.request.post(`/occasions`, {occasions});
  },
}
