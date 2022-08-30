import {fetch as fetchPolyfill} from 'whatwg-fetch';
import { BACKEND_API } from '../constants/globals';
import axios from 'axios/dist/axios';

export function getOrderByName(orderName: String) {
  return new Promise(function(resolve, reject) {
    axios({
      method: 'get',
      url: `${BACKEND_API}/widget/${orderName}`,
    })
    .then(function (response) {
      resolve(response);
    });
  });

}
