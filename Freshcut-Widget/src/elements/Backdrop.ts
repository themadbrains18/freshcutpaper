import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import { ANIMATION_TIME_MS } from '../constants/globals';
import { addClass, removeClass } from '../helpers/utils';

export default class BackDrop extends Element {
  backDrop: HTMLElement;
  constructor() {
    super();
    this.createBackdrop();
  }

  createBackdrop() {
    this.backDrop = this.createDiv();
    this.setClass(this.backDrop, [CLASS_NAMES.BACKDROP])
  }

  /**
   * Show backdrop
   */
  show() {
    // Append To body
    this.appendToBody(this.backDrop);
  }

  /**
 * Hide backdrop
 */
  hide() {
    this.destroy();
  }

  /**
   * Destroy popup html node
   */
  destroy() {
    this.backDrop.remove();
  }
}
