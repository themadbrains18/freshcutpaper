import Request from "./Request";

const client = new Request();

export default {
  fetchAll(page = 1) {
    return client.request.get(`/cards?page=${page}`);
  },
  fetchSingle(id) {
    return client.request.get(`/cards/${id}`);
  },
  save(card) {
    return client.request.post(`/cards`, card);
  },
  update(id, card) {
    return client.request.patch(`/cards/${id}`, card);
  },
  delete(id) {
    return client.request.delete(`/cards/${id}`);
  },
}