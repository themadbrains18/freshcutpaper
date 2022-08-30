import LocalStorage from '../LocalStorage';
import { LOCAL_STORAGE_KEY } from '../constants/globals';

export default class Client {
  /**
   * Class User constructor
   * @param {string} uid
   */
  constructor(uid) {
    this.uid = uid;
  }
}
