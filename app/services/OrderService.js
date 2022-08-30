import Request from "./Request";

const client = new Request();

export default {
  fetchAll(page = 1, sort = "status_unfulfilled") {
    return client.request.get(`/orders?page=${page}&sort=${sort}`);
  },
  fetchSingle(id) {
    return client.request.get(`/orders/${id}`);
  },
  printCard(orders,isPdficon){
    return client.request.get(`/orders/print?orders=${orders}&isPdficon=${isPdficon}`);
  },
  printPackagingSlips(orders){
    return client.request.get(`/orders/print-slips?orders=${orders}`);
  },
  update(id, order) {
    return client.request.patch(`/orders/${id}`, order);
  },
  // iconPrintCard(orders){
  //   console.log('orders','===0',orders);
  //   return client.request.get(`/orders/print-pdf?order=${orders}`);
  // },
}
