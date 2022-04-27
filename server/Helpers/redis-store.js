// Import the Session type from the library, along with the Node redis package, and `promisify` from Node
import {Session} from '@shopify/shopify-api/dist/auth/session';
import redis from 'redis';
import util from 'util';

let getAsync;
let setAsync;
let delAsync;
class RedisStore {

  constructor() {
    // Create a new redis client
    const client = redis.createClient();
    // Use Node's `promisify` to have redis return a promise from the client methods
    getAsync = util.promisify(client.get).bind(client);
    setAsync = util.promisify(client.set).bind(client);
    delAsync = util.promisify(client.del).bind(client);
  }

  /*
    The storeCallback takes in the Session, and sets a stringified version of it on the redis store
    This callback is used for BOTH saving new Sessions and updating existing Sessions.
    If the session can be stored, return true
    Otherwise, return false
  */
    async storeCallback(Session) {

    try {
      // Inside our try, we use the `setAsync` method to save our session.
      // This method returns a boolean (true if successful, false if not)
      return await setAsync(Session.id, JSON.stringify(Session));
    } catch (err) {
      // throw errors, and handle them gracefully in your application
      throw new Error(err);
    }
  };

  /*
    The loadCallback takes in the id, and uses the getAsync method to access the session data
     If a stored session exists, it's parsed and returned
     Otherwise, return undefined
  */
  async loadCallback(id) {
    try {

      // Inside our try, we use `getAsync` to access the method by id
      // If we receive data back, we parse and return it
      // If not, we return `undefined`
      let reply = await getAsync(id);
      if (reply) {
        return JSON.parse(reply);
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  /*
    The deleteCallback takes in the id, and uses the redis `del` method to delete it from the store
    If the session can be deleted, return true
    Otherwise, return false
  */
  async deleteCallback(id){
    try {
      // Inside our try, we use the `delAsync` method to delete our session.
      // This method returns a boolean (true if successful, false if not)
      return await delAsync(id);
    } catch (err) {
      throw new Error(err);
    }
  };
}

// Export the class
export default RedisStore;
