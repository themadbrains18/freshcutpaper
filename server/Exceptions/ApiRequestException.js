export default class ApiRequestException extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiRequestException";
  }
}
