import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import { ANIMATION_TIME_MS } from '../constants/globals';
import NotificationOptions from '../interfaces/NotificationOptions';
import { addClass, removeClass } from '../helpers/utils';

const DEFAULT_OPTIONS = {
  timeout: 5000,
  autoClose: true,
}

export default class Notification extends Element {
  notification: HTMLElement;
  options: NotificationOptions;
  title: HTMLElement;
  message: HTMLElement;
  notificationBody: HTMLElement;

  constructor(options: NotificationOptions) {
    super();
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);

    this.createNotification();
  }
  /**
   * Create notification element
   */
  createNotification(): void {
    const { title, message } = this.options;

    // Notification container
    this.notification = this.createDiv();

    this.setClass(this.notification, [CLASS_NAMES.NOTIFICATION, CLASS_NAMES.ANIMATED, CLASS_NAMES.ANIMATION_FADE_IN_UP, CLASS_NAMES.POSITION_TOP_RIGHT]);

    // Notification container
    this.notificationBody = this.createDiv();
    
    this.setClass(this.notificationBody, [CLASS_NAMES.NOTIFICATION_BODY]);

    // Title
    this.title = this.createDiv();
    
    this.setClass(this.title, [CLASS_NAMES.NOTIFICATION_TITLE]);

    this.setContent(this.title, title);

    // Message
    this.message = this.createDiv();

    this.setClass(this.message, [CLASS_NAMES.NOTIFICATION_MESSAGE]);

    this.setContent(this.message, message);

    this.notificationBody.appendChild(this.title);

    this.notificationBody.appendChild(this.message);

    this.notification.appendChild(this.notificationBody);

    this.setClickEvent(this.notification, () => this.hide())
  }

  /**
   * Show notification
   */
  show(): void {
    const { autoClose } = this.options;

    // Append To body
    this.appendToBody(this.notification);

    // Auto-close
    if (autoClose) {
      setTimeout(() => this.hide(), this.options.timeout)
    }
  }

  /**
 * Hide notification
 */
  hide(): void {
    removeClass(this.notification, [CLASS_NAMES.ANIMATION_FADE_IN_UP]);
    addClass(this.notification, [CLASS_NAMES.ANIMATION_FADE_OUT_DOWN])

    setTimeout(() => this.destroy(), ANIMATION_TIME_MS)
  }

  /**
   * Destroy html node
   */
  destroy(): void {
    this.notification.remove();
  }
}