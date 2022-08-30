import isMobile from 'ismobilejs';
import DEFAULT_POPUP_OPTIONS from './constants/defaults';
import WIDGET_SELECTORS from './constants/selectors';
import { DEBUG_MODE, LOCAL_STORAGE_KEY, ANIMATION_TIME_MS } from './constants/globals';
import { WidgetOptions } from './interfaces/WidgetOptions';
import LocalStorage from './LocalStorage';
import Notification from './elements/Notification';
import merge from 'lodash.merge';
import Client from './models/Client';

import { getOrderByName } from './services/ApiRequest';


import Popup from './elements/Popup';

export default class Widget {
  options: WidgetOptions;
  popup: Popup;
  storage: LocalStorage;
  client: any;

  /**
   * Launch Giftcard widget with custom options
   * @param  {json} options
   */
  constructor(options: WidgetOptions) {
    this.options = merge(DEFAULT_POPUP_OPTIONS, options);
    this.storage = new LocalStorage();
    this.client = null;
    this.init();
  }

  storedOptions() {
    return this.storage.get(LOCAL_STORAGE_KEY);
  }

  async init() {
    const orderPage = document.querySelector(".template-customers-order");
    let attributes = {
      isAccountPage: false
    };

    if(orderPage){
      const orderName = document.querySelector(".order-table").getAttribute("data-order-name");
      let getAttributes = await getOrderByName(orderName);
      let orderId = getAttributes.data.orderId;
      attributes = getAttributes.data.payload;
      attributes["orderId"] = orderId;
      attributes["isAccountPage"] = true;
    }

    this.showGiftCardPopup(attributes);
  }

  showGiftCardPopup(orderAttribute): void {
    this.popup = new Popup(orderAttribute, this.options.popup, this.options.cards, this.options.quotes, this.options.fonts, this.options.theme, this.options.occasions,this.options.settings, this.options.enviroment, {
      onClose: this.onPopupClose.bind(this),
      onSubmit: this.onSubmit.bind(this)
    });
  }


  /**
   * Topbar close event callback
   * @returns void
   */
  onTopBarClose():void {

  }

  /**
   * Popup close event callback
   * @returns void
   */
  onPopupClose():void {
    this.saveDismissedState();
  }

  /**
   * SmartPopup close event callback
   * @returns void
   */
  onSmartPopupClose(): void {
    this.saveDismissedState();
  }

  /**
   * Save dismissed state in local storage
   * @returns void
   */
  saveDismissedState() {
    this.storage.set(LOCAL_STORAGE_KEY, { dismissed: (new Date()).valueOf() + 1})
  }

  /**
   * Update coupon code state in local storage
   * @returns void
   */
  updateCouponCode(code, disable = false): void {
    this.storage.set(LOCAL_STORAGE_KEY, { discount: {
      code,
      enabled_timestamp: (new Date()).valueOf(),
      disabled_timestamp: disable ? (new Date()).valueOf() : null
    } })
  }

  /**
   * Popup close event callback
   * @returns void
   */
  onSubmit({ client }):void {
    const { title, message } = this.options.popup.confirmation;

    this.storage.set(LOCAL_STORAGE_KEY, { client, dismissed: (new Date()).valueOf() + 30 });

    (new Notification({ title, message })).show()
  }
}
