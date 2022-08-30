export default class LocalStorage {
  storage: Storage;
  /**
   * LocalStorage constructor.
   *
   * @param string language
   */
  constructor() {
    // eslint-disable-next-line no-undef
    this.storage = window.localStorage;
  }

  /**
   * Load data from locale storage by key
   * @param {string} key
   */
  get(key) {
    try {
      const storedData = this.storage.getItem(key);
      const data = JSON.parse(storedData);

      if (data && typeof data === 'object') {
        return data;
      }
    } catch (error) {
      throw new Error(error);
    }

    return {};
  }

  /**
   * Store data in local storage
   * @param {string} key
   * @param {object} data
   */
  set(key, data) {
    const existingData = this.get(key);

    this.storage.setItem(key, JSON.stringify({...existingData, ...data}));

    return true;
  }
}
