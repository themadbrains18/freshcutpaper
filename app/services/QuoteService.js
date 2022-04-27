import Request from "./Request";

const client = new Request();

export default {
  fetchAll(page = 1) {
    return client.request.get(`/quotes?page=${page}`);
  },
  fetchSingle(id) {
    return client.request.get(`/quotes/${id}`);
  },
  save(quote) {
    return client.request.post(`/quotes`, quote);
  },
  update(id, quote) {
    return client.request.patch(`/quotes/${id}`, quote);
  },
  delete(id) {
    return client.request.delete(`/quotes/${id}`);
  },
}