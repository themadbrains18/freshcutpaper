import Element from './Element';
import CLASS_NAMES from '../constants/classes';

export default class Preloader extends Element {
  preloader: HTMLElement;

  constructor() {
    super();
    this.createPreloader();
  }

  createPreloader() {
    this.preloader = this.createDiv();

    for (let index = 1; index <= 10; index++) {
      const div = this.createDiv();

      this.preloader.appendChild(div);
    }

    this.setClass(this.preloader, [CLASS_NAMES.PRELOADER]);
  }

  /**
   * Append preloader html node to body
   */
  show() {
    this.appendToBody(this.preloader);
  }

  /**
   * Destroy popup html node
   */
  hide() {
    this.preloader.remove();
  }

  /**
   * Return Preloader HTMLElement
   * @return {HTMLElement}
   */
  getElement(): HTMLElement {
    return this.preloader;
  }
}