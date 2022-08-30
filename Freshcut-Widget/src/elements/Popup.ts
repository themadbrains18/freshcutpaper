import Element from './Element';
import BackDrop from './Backdrop';
import EditorPreview from './EditorPreview';
import Preview from './Preview';
import DeliveryForm from './DeliveryForm';
import Options from './Options';
import CLASS_NAMES from '../constants/classes';
import PopupOptions from '../interfaces/PopupOptions';
import PreviewOptions from '../interfaces/PreviewOptions';
import CardSettings from '../interfaces/CardSettings';
import Cards from '../interfaces/Cards';
import Quotes from '../interfaces/Quotes';
import Fonts from '../interfaces/Fonts';
import Occasions from '../interfaces/Occasions';
import Settings from '../interfaces/Settings';
import Enviroment from '../interfaces/Enviroment';
import PopupCallbacks from '../interfaces/PopupCallbacks';

import { ThemeOptions } from '../interfaces/ThemeOptions';
import { addClass, removeClass } from '../helpers/utils';
import FontPicker from "font-picker";
import Swiper, { Navigation } from 'swiper';
// import Swiper and modules styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { EmojiButton } from '@joeattardi/emoji-button';

import customSelect from 'custom-select';
import datepicker from 'js-datepicker'

import { getOrderByName } from '../services/ApiRequest';

import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faPencilAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import emojiUnicode from 'emoji-unicode';

library.add(faPencilAlt);
library.add(faEnvelope);

import { GIFT_CARD_PRODUCT_ID } from '../constants/globals';
import { any } from 'core-js/fn/promise';

let stepSwiper;
let productObj;
export default class Popup extends Element {
  attributes: any;
  options: PopupOptions;
  previewOptions: PreviewOptions;
  callbacks: PopupCallbacks;
  backDrop: BackDrop;
  theme: ThemeOptions;
  cards: Cards;
  quotes: Quotes;
  occasions: Occasions;
  cardSettings: CardSettings;
  settings: Settings;
  enviroment: Enviroment;
  swiper: any;
  datePicker: any;
  fontPicker: any;

  // Elements
  popup: HTMLElement;
  popupHeader: HTMLElement;
  popupHeaderTitle: HTMLElement;
  closeContainer: HTMLElement;
  closeBtn: HTMLElement;
  popupBodyWrapper: HTMLElement;
  swiperWrapper: HTMLElement;
  popupBody: HTMLElement;
  popupOptions: HTMLElement;
  popupEditorPreview: HTMLElement;

  popupQuotes: HTMLElement;
  popupQuotesItem: HTMLElement;

  popupFontPicker: HTMLElement;

  // added for warning popup first case
  warningPopup:HTMLElement;
  warningPopupHeader: HTMLElement;
  warningPopupHeaderTitle: HTMLElement;
  warningPopBody: HTMLElement;
  buttonContainer: HTMLElement;
  warningPopupCountinueBtn:HTMLElement;
  warningPopupProductBtn:HTMLElement;


  // added for warning popup second case with child exist
  warningChildPopup:HTMLElement;
  warningChildPopupHeader: HTMLElement;
  warningChildPopupHeaderTitle: HTMLElement;
  warningChildPopBody: HTMLElement;
  buttonChildContainer: HTMLElement;
  warningChildPopupCountinueBtn:HTMLElement;
  warningChildPopupProductBtn:HTMLElement;

  preview: HTMLElement;
  deliveryForm: HTMLElement;

  persButton: HTMLElement;
  liItem: HTMLElement;

  editliItem:HTMLElement;
  editpersButton:HTMLElement;

  cardDesign: String;
  cardMessage: String;

  inputRow: HTMLElement;
  inputSpan: HTMLElement;
  inputRadio: HTMLElement;
  inputLabel: HTMLElement;
  inputText: HTMLElement;
  inputPrice: HTMLElement;

  editButton: HTMLElement;

  innerBackdrop : HTMLElement;

  // Swiper card design slides
  popupDesignsItem: HTMLElement;
  popupDesignsItemContent: HTMLElement;
  popupDesignsItemInput: HTMLElement;
  popupDesignsItemLabel: HTMLElement;
  popupDesignsItemImage: HTMLElement;

  constructor(orderAttribute, options: PopupOptions, cards: Array<Cards>, quotes: Array<Quotes>, fonts: Array<Fonts>,theme: ThemeOptions, occasions: Array<Occasions>, settings: Settings, enviroment: Enviroment, callbacks: PopupCallbacks = {}){
    super();
    this.attributes = orderAttribute;
    this.options = options;
    this.callbacks = callbacks;
    this.theme = theme;
    this.cards = cards;
    this.quotes = quotes;
    this.fonts = fonts;
    this.occasions = occasions;
    this.settings = settings;
    this.enviroment = enviroment;

    const collectionButtonText = document.querySelectorAll(".product-action-buttons-text");
    const collectionButtonSpinner = document.querySelectorAll(".product-action-buttons-spinner");
    if(collectionButtonText && collectionButtonSpinner){
      collectionButtonText.forEach(el => {
        el.classList.remove("hidden");
      })
      collectionButtonSpinner.forEach(el => {
        el.classList.add("hidden");
      })
    }
    this.createPopup();
    this.createWarningPopup();
    this.createWarningChildPopup();
    this.createBackdrop();
    this.initializeFontPicker();
    this.createPersonilizeButton();
    // this.initSwiper();
    this.handleDesignChange();
    this.handleTabChange();
    this.initCustomSelect();
    this.handleTextAreaChange();
    this.handleQuoteChange();
    this.handleMainTabChange();
    this.handleCountryChange();
    this.initDatepicker();
    
    this.createCartButton();
    this.acceptPreview();
    this.events();
    this.handleEmojiPopup();
    this.initPicker();
    this.createEditMessageButton();

  }

  createBackdrop(){
   this.backDrop = new BackDrop();
  }

  handleEmojiPopup(){
    const emojiimg = document.querySelector(".gcw-giftcard_generator-emojiimg");
    emojiimg.addEventListener("click", (val) => {
      const emojipopup:any = document.querySelector(".emoji-picker__wrapper");
      emojipopup.classList.add('emoji-picker_active');
    })
  }

  initPicker(){
    const picker = new EmojiButton();
    const emojipopup:any = document.querySelector(".emoji-picker__wrapper");
    emojipopup.style.display = 'block';
    picker.on('emoji', selection => {
      let textarea = document.querySelector('.gcw-giftcard_generator-options-textarea');

      let codepoint = emojiUnicode(selection.emoji)

      console.log('codepoint1','====',codepoint);

      const emoji = codepoint.split(' ').map((codePoint) => (
        String.fromCodePoint(`0x${codePoint}`)
      )).join('');

      console.log('emoji','====',emoji);

      var startPosition = textarea.selectionStart;

      let textBeforeCursorPosition = textarea.value.substring(0, startPosition);
      let textAfterCursorPosition = textarea.value.substring(startPosition, textarea.value.length);

      console.log('start Position','============',textBeforeCursorPosition)
      console.log('end Position','============',textAfterCursorPosition)

      textarea.value = textBeforeCursorPosition + selection.emoji + textAfterCursorPosition;

      // textarea.value +=  selection.emoji; 
    });

    picker.on('hidden', () => {
      const self = this;
      let textarea = document.querySelector('.gcw-giftcard_generator-options-textarea');
      var end = textarea.selectionEnd;
      textarea.setSelectionRange(end, end);
      textarea.focus();

      // add emoji in preview mode card
      const previewTextFinal = document.getElementById("previewTextFinal");
      let text = textarea.value;
      text.replace(/\n\r?/g, '<br />');
      this.cardMessage = text;
      previewTextFinal.textContent = text;

      emojipopup.style.display = 'none';
    });

    const emojiimg:any = document.querySelector(".gcw-giftcard_generator-emojiimg");

    emojiimg.addEventListener('click', () => 
      picker.togglePicker(emojiimg)
      // picker.showPicker(emojiimg)
    );
    
  }

  createWarningPopup(){
    // Create popup
    this.warningPopup = this.createDiv();
    this.setClass(this.warningPopup, [CLASS_NAMES.WARNINGPOPUP])
    this.warningPopup.style.display = 'none';

    this.innerBackdrop = this.createDiv();
    this.setClass(this.innerBackdrop, [CLASS_NAMES.WARNINGPOPUP_INNER_BACKDROP, CLASS_NAMES.VISSABILITY_HIDDEN]);
    this.warningPopup.appendChild(this.innerBackdrop);

    // Create popup header
    this.warningPopupHeader = this.createDiv();
    this.setClass(this.warningPopupHeader, [CLASS_NAMES.WARNINGPOPUP_HEADER]);
    this.warningPopup.appendChild(this.warningPopupHeader);

    this.warningPopupHeaderTitle = this.createP();
    this.setContent(this.warningPopupHeaderTitle, " Personalize ");
    this.setClass(this.warningPopupHeaderTitle, [CLASS_NAMES.WARNINGPOPUP_HEADER_TITLE]);
    this.warningPopupHeader.appendChild(this.warningPopupHeaderTitle);

    // Create close button
    this.closeContainer = this.createDiv();
    this.setClass(this.closeContainer, [CLASS_NAMES.WARNINGPOPUP_CLOSE_CONTAINER]);
    this.warningPopupHeader.appendChild(this.closeContainer);
    this.setClickEvent(this.closeContainer, this.dismiss.bind(this))

    this.closeBtn = this.createDiv();
    this.setClass(this.closeBtn, [CLASS_NAMES.WARNINGPOPUP_CLOSE_BTN]);
    this.closeContainer.appendChild(this.closeBtn);
    this.setClickEvent(this.closeBtn, this.dismiss.bind(this))

    this.popupBodyWrapper = this.createDiv();
    this.setClass(this.popupBodyWrapper, [CLASS_NAMES.WARNINGPOPUP_BODY_WRAPPER]);
    this.warningPopup.appendChild(this.popupBodyWrapper);

    this.warningPopBody=this.createDiv();
    this.setClass(this.warningPopBody, [CLASS_NAMES.WARNINGPOPUP_BODY]);
    this.setContent(this.warningPopBody, "The same personalized note will be added to the selected quantity. If you would like to add a unique note for each bouquet, please personalize and add to cart one at a time")
    this.popupBodyWrapper.appendChild(this.warningPopBody);

    this.buttonContainer = this.createDiv();
    this.setClass(this.buttonContainer, [CLASS_NAMES.WARNINGPOPUP_BUTTON_CONTAINER]);
    this.popupBodyWrapper.appendChild(this.buttonContainer);

    this.warningPopupCountinueBtn = this.createButton();
    this.setClass(this.warningPopupCountinueBtn, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON]);
    this.setContent(this.warningPopupCountinueBtn, "Continue");
    this.setID(this.warningPopupCountinueBtn, "countinueBtn");
    this.setClickEvent(this.warningPopupCountinueBtn, this.finalSubmit.bind(this));
    this.buttonContainer.appendChild(this.warningPopupCountinueBtn);

    this.warningPopupProductBtn = this.createA();
    this.setClass(this.warningPopupProductBtn, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON]);
    this.setContent(this.warningPopupProductBtn, "Product Page");
    this.setID(this.warningPopupProductBtn, "productBtn");
    this.setClickEvent(this.warningPopupProductBtn, this.redirectToProductPage.bind(this));
    this.buttonContainer.appendChild(this.warningPopupProductBtn);

    // Append To body
    this.appendTopBodyTop(this.warningPopup);

    
  }

  createWarningChildPopup(){
     // Create popup
     this.warningChildPopup = this.createDiv();
     this.setClass(this.warningChildPopup, [CLASS_NAMES.WARNINGCHILDPOPUP])
     this.warningChildPopup.style.display = 'none';
 
     this.innerBackdrop = this.createDiv();
     this.setClass(this.innerBackdrop, [CLASS_NAMES.WARNINGPOPUP_INNER_BACKDROP, CLASS_NAMES.VISSABILITY_HIDDEN]);
     this.warningChildPopup.appendChild(this.innerBackdrop);
 
     // Create popup header
     this.warningChildPopupHeader = this.createDiv();
     this.setClass(this.warningChildPopupHeader, [CLASS_NAMES.WARNINGPOPUP_HEADER]);
     this.warningChildPopup.appendChild(this.warningChildPopupHeader);
 
     this.warningChildPopupHeaderTitle = this.createP();
     this.setContent(this.warningChildPopupHeaderTitle, " Personalize ");
     this.setClass(this.warningChildPopupHeaderTitle, [CLASS_NAMES.WARNINGPOPUP_HEADER_TITLE]);
     this.warningChildPopupHeader.appendChild(this.warningChildPopupHeaderTitle);
 
     // Create close button
     this.closeContainer = this.createDiv();
     this.setClass(this.closeContainer, [CLASS_NAMES.WARNINGPOPUP_CLOSE_CONTAINER]);
     this.warningChildPopupHeader.appendChild(this.closeContainer);
     this.setClickEvent(this.closeContainer, this.dismissChildPopup.bind(this))
 
     this.closeBtn = this.createDiv();
     this.setClass(this.closeBtn, [CLASS_NAMES.WARNINGPOPUP_CLOSE_BTN]);
     this.closeContainer.appendChild(this.closeBtn);
     this.setClickEvent(this.closeBtn, this.dismissChildPopup.bind(this))
 
     this.popupBodyWrapper = this.createDiv();
     this.setClass(this.popupBodyWrapper, [CLASS_NAMES.WARNINGPOPUP_BODY_WRAPPER]);
     this.warningChildPopup.appendChild(this.popupBodyWrapper);
 
     this.warningPopBody=this.createDiv();
     this.setClass(this.warningPopBody, [CLASS_NAMES.WARNINGPOPUP_BODY]);
     this.setContent(this.warningPopBody, "The same personalized note will be added to the selected quantity. If you would like to add a unique note for each bouquet, please personalize and add to cart one at a time")
     this.popupBodyWrapper.appendChild(this.warningPopBody);
 
     this.buttonContainer = this.createDiv();
     this.setClass(this.buttonContainer, [CLASS_NAMES.WARNINGPOPUP_BUTTON_CONTAINER]);
     this.popupBodyWrapper.appendChild(this.buttonContainer);
 
     this.warningChildPopupCountinueBtn = this.createButton();
     this.setClass(this.warningChildPopupCountinueBtn, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON,'countinueChildBtn']);
     this.setContent(this.warningChildPopupCountinueBtn, "Continue");
     this.setID(this.warningChildPopupCountinueBtn, "countinueChildBtn");
     this.buttonContainer.appendChild(this.warningChildPopupCountinueBtn);
 
     this.warningChildPopupProductBtn = this.createA();
     this.setClass(this.warningChildPopupProductBtn, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON, 'productChildBtn']);
     this.setContent(this.warningChildPopupProductBtn, "Product Page");
     this.setID(this.warningChildPopupProductBtn, "productChildBtn");
     this.buttonContainer.appendChild(this.warningChildPopupProductBtn);
 
     // Append To body
     this.appendTopBodyTop(this.warningChildPopup);
  }

  redirectToProductPage(){
     let url= productObj.url;
     window.open(
      url,
      '_self' 
    );
  }

  /**
   * Create popup widget
   * @returns void
   */
   createPopup(): void {
    const { title } = this.options;
    const cards = this.cards;
    const quotes = this.quotes;
    const fonts = this.fonts;
    const occasions = this.occasions;
    const settings = this.settings;
    const enviroment = this.enviroment;

    // Create popup
    this.popup = this.createDiv();
    this.setClass(this.popup, [CLASS_NAMES.POPUP])
    this.popup.style.display = 'none';

    this.innerBackdrop = this.createDiv();
    this.setClass(this.innerBackdrop, [CLASS_NAMES.POPUP_INNER_BACKDROP, CLASS_NAMES.VISSABILITY_HIDDEN]);
    this.popup.appendChild(this.innerBackdrop);

    // Create popup header
    this.popupHeader = this.createDiv();
    this.setClass(this.popupHeader, [CLASS_NAMES.POPUP_HEADER]);
    this.popup.appendChild(this.popupHeader);

    // Create popup header title
    const editIcon = icon({ prefix: 'fas', iconName: 'pencil-alt' })
    this.popupHeaderTitle = this.createP();
    this.setContent(this.popupHeaderTitle, editIcon.html + " Personalize custom note card");
    this.setClass(this.popupHeaderTitle, [CLASS_NAMES.POPUP_HEADER_TITLE]);
    this.popupHeader.appendChild(this.popupHeaderTitle);

    // Create close button
    this.closeContainer = this.createDiv();
    this.setClass(this.closeContainer, [CLASS_NAMES.POPUP_CLOSE_CONTAINER]);
    this.popupHeader.appendChild(this.closeContainer);
    this.setClickEvent(this.closeContainer, this.dismiss.bind(this))

    this.closeBtn = this.createP();
    this.setContent(this.closeBtn, "Close")
    this.closeContainer.appendChild(this.closeBtn);

    this.closeBtn = this.createDiv();
    this.setClass(this.closeBtn, [CLASS_NAMES.POPUP_CLOSE_BTN]);
    this.closeContainer.appendChild(this.closeBtn);
    this.setClickEvent(this.closeBtn, this.dismiss.bind(this))

    this.popupBodyWrapper = this.createDiv();
    this.setClass(this.popupBodyWrapper, [CLASS_NAMES.POPUP_BODY_WRAPPER]);
    this.popup.appendChild(this.popupBodyWrapper);

    this.swiperWrapper = this.createDiv();
    this.setClass(this.swiperWrapper, ["swiper-wrapper"]);
    // this.popupBodyWrapper.appendChild(this.swiperWrapper);

    // Create popup body for editor
    this.popupBody = this.createDiv();
    this.setClass(this.popupBody, [CLASS_NAMES.POPUP_BODY]);
    this.setID(this.popupBody, "editor-tab");
    this.popupBodyWrapper.appendChild(this.popupBody);

    // Create Preview
    this.popupEditorPreview = (new EditorPreview({
      handleDesignChange : this.handleDesignChange.bind(this),
      handleOccasionChange : this.handleOccasionChange.bind(this)
    }, cards, enviroment, occasions, theme).getPreview());
    this.popupBody.appendChild(this.popupEditorPreview);

    // Create Options
    this.popupBody = this.createDiv();
    this.setClass(this.popupBody, [CLASS_NAMES.POPUP_BODY]);
    this.setID(this.popupBody, "options-tab");
    this.popupOptions = (new Options(quotes, fonts, occasions, this.attributes ).getOptions());
    this.popupBody.appendChild(this.popupOptions);
    this.popupBodyWrapper.appendChild(this.popupBody);

    // Create popup body for preview
    this.popupBody = this.createDiv();
    this.setClass(this.popupBody, [CLASS_NAMES.POPUP_BODY]);
    this.setID(this.popupBody, "preview-tab");
    this.popupBodyWrapper.appendChild(this.popupBody);

    this.preview = (new Preview(this.theme, this.attributes).getPreview());
    this.popupBody.appendChild(this.preview);

    // Create popup body for schedule form
    this.popupBody = this.createDiv();
    this.setClass(this.popupBody, [CLASS_NAMES.POPUP_BODY]);
    this.setID(this.popupBody, "schedule-tab");
    this.popupBodyWrapper.appendChild(this.popupBody);

    this.deliveryForm = (new DeliveryForm(this.theme, settings, this.attributes).getDeliveryForm());
    this.popupBody.appendChild(this.deliveryForm);

    // Append To body
    this.appendTopBodyTop(this.popup);
   }

   events(){
     const self = this;
      const collectionButton = document.querySelector(".collectionPersonlize");
      if(collectionButton){
        document.addEventListener("click", function(e){
          if(e.target.classList.contains("collectionPersonlize") ){
            e.preventDefault();
            self.theme.postType = "addFromCollection";
            self.theme.variantID = e.target.getAttribute("data-product-id");
            self.show(parseInt(e.target.getAttribute("data-product-id")), parseInt(e.target.getAttribute("data-id")));
          }
        });
      }

      const textarea = document.querySelector(".gcw-giftcard_generator-options-textarea");

      textarea.addEventListener("keyup", function(){
        self.validateTextarea(textarea)
      });

      // const lblmsg=document.querySelector('.msgLabel');
      // lblmsg.addEventListener('click',function(){
      //   let textarea = document.querySelector('.gcw-giftcard_generator-options-textarea');
      //   var end = textarea.selectionEnd;
      //   textarea.setSelectionRange(end, end);
      //   textarea.focus();
      // })

    }

   /**
  * Create personalize button in product page
  */
  createPersonilizeButton() {
    const self = this;
    const giftCardProductID = GIFT_CARD_PRODUCT_ID;
    // Add edit button in My Account page
    if(document.querySelector(".template-customers-order")){

      let orderPersProductAll = document.querySelectorAll(`tr[data-variant-id="${giftCardProductID}"]`);
      let countOrders = 0;
      let bdOrderStatus = 'unfulfilled';
      orderPersProductAll.forEach((orderPersProduct) => {
        if(orderPersProduct){
          const itemPropsDiv = orderPersProduct.querySelector(".item-props");
          itemPropsDiv.innerHTML = "";
          
          console.log('countOrders data','=======',this.attributes[countOrders]);
          Object.keys(this.attributes[countOrders]).forEach(function(key){
            if(key == 'status'){
              bdOrderStatus = self.attributes[countOrders][key];
            }
            if(key == 'status' || key == 'printPdf')
            {
              return
            }
            else{
              let prop = document.createElement("span");
              prop.classList.add("item-props__property");
              if(key == "_id" || key == "shop" || key == "orderId" || key == "designId" || key == "__v" || key == "isAccountPage"){return}
              if(self.attributes[countOrders][key] == null){
                return;
              }
  
              prop.innerText =key + ": " + self.attributes[countOrders][key];
              itemPropsDiv.appendChild(prop);
            }
            
          });
        }
        const prdocutOrderInfoCont = orderPersProduct.querySelector("th");
        const orderTable = document.querySelector(".order-table");

        console.log('DBOrderStatus','=======',bdOrderStatus);
        if( (orderTable && orderTable.getAttribute("data-fulfilled") == "false") && bdOrderStatus ==  'unfulfilled'){

          this.editButton = this.createA();
          this.setContent(this.editButton, 'Edit Card');
        
          this.setClass(this.editButton, ["open-widget-button", CLASS_NAMES.EDIT_BUTTON, CLASS_NAMES.BUTTON, CLASS_NAMES.PRIMARY_BUTTON]);

          const lineItemId = orderPersProduct.getAttribute('data-line-id')
          console.log('lineItemId','===========',lineItemId);
          console.log('countOrders','=======',countOrders);
          this.setClickEvent(this.editButton, this.show.bind(this, false, false,0,0,false,false,0, countOrders, lineItemId));
          prdocutOrderInfoCont.appendChild(this.editButton);
        }else{
          let statusField= document.querySelector('.dbstatus');
          console.log('statusField','=======',statusField);
          if(bdOrderStatus == 'fulfilled'){
            console.log('statusField','=======','fssd here');
            statusField.innerText='Fulfilled'
          }
          
          this.editButton = this.createP();
          this.setContent(this.editButton, 'This card is already fullfilled');
          prdocutOrderInfoCont.appendChild(this.editButton);
        }
        countOrders++;
      })
    }

    if(document.body.classList.contains("template-product")){
      const divToAppend = document.querySelector(".giftcard-widget-container");
      let soldout = divToAppend.getAttribute('data-option'); 
      this.persButton = this.createA();
      this.setContent(this.persButton, 'Add personalized message card +$5.00');
      this.setClass(this.persButton, ["open-widget-button", CLASS_NAMES.BUTTON, CLASS_NAMES.PRIMARY_BUTTON, "gcw-hide"]);
      
      this.persButton.setAttribute((soldout == 'false')?'disabled':'xyz', "");
      if((soldout != 'false')){
        this.setClickEvent(this.persButton, this.show.bind(this))
      }
      
      // Input Option
      this.inputRow = this.createDiv();
      this.setClass(this.inputRow, [CLASS_NAMES.WIDGET_INPUT_ROW]);

      this.inputRadio = this.createInput();
      this.setType(this.inputRadio, "radio");
      this.setName(this.inputRadio, "note-option");
      this.setID(this.inputRadio, "simple-card");
      this.setValue(this.inputRadio, "false");
      this.setChecked(this.inputRadio, true);
      this.inputRow.appendChild(this.inputRadio);

      this.inputLabel = this.createLabel();
      this.setContent(this.inputLabel, 'Note Card');
      this.setFor(this.inputLabel, "simple-card");
      this.inputRow.appendChild(this.inputLabel);
      divToAppend.appendChild(this.inputRow);

      this.inputPrice = this.createSpan();
      this.setClass(this.inputPrice, [CLASS_NAMES.WIDGET_INPUT_PRICE]);
      this.setContent(this.inputPrice, 'Included');
      this.inputLabel.appendChild(this.inputPrice);

        // Input Option
        this.inputRow = this.createDiv();
        this.setClass(this.inputRow, [CLASS_NAMES.WIDGET_INPUT_ROW]);

        this.inputRadio = this.createInput();
        this.setType(this.inputRadio, "radio");
        this.setName(this.inputRadio, "note-option");
        this.setID(this.inputRadio, "personalized-card");
        this.setValue(this.inputRadio, "true");
        this.inputRow.appendChild(this.inputRadio);

        this.inputLabel = this.createLabel();
        this.setContent(this.inputLabel, "Personalize It & We'll Send Direct");
        this.setFor(this.inputLabel, "personalized-card");
        this.inputRow.appendChild(this.inputLabel);

        this.inputPrice = this.createSpan();
        this.setClass(this.inputPrice, [CLASS_NAMES.WIDGET_INPUT_PRICE]);
        this.setContent(this.inputPrice, '+$5');
        this.inputLabel.appendChild(this.inputPrice);

        this.inputText = this.createSpan();
        this.setClass(this.inputText, [CLASS_NAMES.WIDGET_INPUT_TEXT]);
        this.setContent(this.inputText, "Create your card and we'll ship it directly to your recipient");
        this.inputLabel.appendChild(this.inputText);

      
      divToAppend.appendChild(this.inputRow);
      divToAppend.appendChild(this.persButton);

      const addToCartButton = document.querySelector(".add-to-cart");
      const openWidgetButton = document.querySelector(".open-widget-button");
      const self = this;
      document.querySelectorAll("input[name='note-option']").forEach(element => {
        element.addEventListener("change", function(e){
          
          if(this.value == "true"){
            
            if(soldout != 'false'){
              addToCartButton.classList.add("gcw-hide");
              openWidgetButton.classList.remove("gcw-hide");
              self.removeClass(self.persButton, "gcw-hide")
            }
           
          }else{
            addToCartButton.classList.remove("gcw-hide");
            openWidgetButton.classList.add("gcw-hide");
            self.setClass(self.persButton, "gcw-hide")
          }
        });
      });
    }
  }

  /**
  * Create personalize button for cart items page
  */

  createCartButton() {
    
    const cartRow = document.querySelectorAll(".cart__item");
    if(cartRow){
      let totalItemCount = cartRow.length
      let loopIndex = 0;
      let existID=[];
      cartRow.forEach(element => {
        let showButton = true;
        const cartItem = element.querySelector(".cart__item--name");
      
        if(cartItem == null){
          return;
        }
        const productUrl=  cartItem.querySelector('.cart__product-name');
        let url = productUrl.href;
        let lineIndex = element.getAttribute("data-count");
        let variantId = element.getAttribute("data-variantId");
        let datakey = element.getAttribute("data-key");
        let parentdatakey= element.getAttribute("data-key");
        let txtqty= document.querySelectorAll('.js-qty__num');
        let product_id=element.getAttribute("data-productid");
        let textQty= '0';
        let minus;
        let plus;
        let qtyTextbox;
        for(let qty of txtqty){
            if(qty.getAttribute("data-id") == datakey){
              textQty= qty.value;
              qtyTextbox=qty;
              minus = qty.nextElementSibling;
              plus = minus.nextElementSibling;
            }
        }

        if(element.nextElementSibling.children.length>0){
          let childitem = element.nextElementSibling.id;
          childitem=childitem.split('of')[1];
          if(childitem == variantId){
            showButton = false;
            qtyTextbox.classList.add('gcw-txt-qty-cursor')
          }
        }
        else{
          minus.removeAttribute("disabled");
          plus.removeAttribute("disabled");
          minus.classList.add('gcw-qty-hide');
          plus.classList.add('gcw-qty-hide');
          qtyTextbox.classList.remove('gcw-txt-qty-cursor')
        }
        
        existID.push(variantId)

        const envelopeIcon = icon({ prefix: 'fas', iconName: 'envelope' });
        let itemLineItemIndex = totalItemCount - loopIndex;
        this.liItem = this.createSpan();
        this.persButton = this.createA();
        this.liItem.appendChild(this.persButton);
        this.setContent(this.persButton, envelopeIcon.html+' Personalize your note (+$5)');
        this.setClass(this.persButton, ["gcw-cart-widget-button"]);
        this.setDataset(this.persButton, "id", itemLineItemIndex);
        this.setDataset(this.persButton, "variantId", variantId);
        this.setDataset(this.persButton, "key", datakey);
        this.theme.lineIndex = itemLineItemIndex;
        
        this.setClickEvent(this.persButton, this.show.bind(this, parseInt(lineIndex), parseInt(variantId), parseInt(textQty), '0' ,parentdatakey,url, parseInt(product_id)))
        if(showButton){
            cartItem.appendChild(this.liItem);
        }
        loopIndex++;
        
      });
    }
  }

  /** Create message edit buttin  */

  createEditMessageButton(){
    const cartRow = document.querySelectorAll(".childitem");
    if(cartRow){
      let totalItemCount = cartRow.length
      let loopIndex = 0;
      let existID=[];
      cartRow.forEach(element => {
        let showButton = true;
        const cartItem = element.querySelector(".cart__item--name");
        if(cartItem == null){
          return;
        }
        let lineIndex = element.getAttribute("data-count");
        let variantId = element.getAttribute("data-variantId");
        let datakey = element.getAttribute("data-key");
        
        let parentdatakey= '0';
        let textQty= '0';
        
        console.log('parent main element','=====',element.parentElement.previousElementSibling)
        let mainElement= element.parentElement.previousElementSibling;
        let product_id=mainElement.getAttribute("data-productid");

        console.log('Edit Button product id','===========',product_id)
        if(element.parentElement.previousElementSibling.children.length>0){
          let parentElement = element.parentElement.previousElementSibling;
          variantId = parentElement.getAttribute("data-variantId");
          lineIndex = parentElement.getAttribute("data-count");
          let parent
          const itemValue = parentElement.querySelectorAll('.product-details_msg-value');
          for(let parentMsg of itemValue){
            parentdatakey= parentElement.getAttribute("data-key");
          }

          let txtqty= parentElement.querySelectorAll('.js-qty__num');
          for(let qty of txtqty){
              if(qty.getAttribute("data-id") == parentdatakey){
                textQty= qty.value;
              }
          }
        }
        

        if(element.nextElementSibling.children.length>0){
          let childitem = element.nextElementSibling.id;
          childitem=childitem.split('of')[1];
          if(childitem == variantId){
            showButton = true;
          }
        }
        existID.push(variantId)

        const envelopeIcon = icon({ prefix: 'fas', iconName: 'pencil-alt' });
        let itemLineItemIndex = totalItemCount - loopIndex;
        this.editliItem = this.createSpan();
        this.editpersButton = this.createA();
        this.editliItem.appendChild(this.editpersButton);
        this.setContent(this.editpersButton, envelopeIcon.html+' Edit');
        this.setClass(this.editpersButton, ["gcw-cart-widget-button"]);
        this.setDataset(this.editpersButton, "id", itemLineItemIndex);
        this.setDataset(this.editpersButton, "variantId", variantId);
        this.setDataset(this.editpersButton, "key", datakey);
        this.theme.lineIndex = itemLineItemIndex;
        
        this.setClickEvent(this.editpersButton, this.show.bind(this, parseInt(lineIndex), parseInt(variantId), parseInt(textQty), datakey , parentdatakey,'', parseInt(product_id)))
        if(showButton){
            cartItem.appendChild(this.editliItem);
        }
        loopIndex++;
        
      });
    }
  }

  /**
   * Close widget event
   */
   dismiss() {
    const { options } = this.options;

    removeClass(this.popup, [CLASS_NAMES.DISPLAY_BLOCK]);
    addClass(this.popup, [CLASS_NAMES.DISPLAY_NONE])
    removeClass(this.warningPopup, [CLASS_NAMES.DISPLAY_BLOCK]);
    addClass(this.warningPopup, [CLASS_NAMES.DISPLAY_NONE]);
    
    // Hide backdrop
    if(options.showBackdrop) {
      this.backDrop.hide();
    }
  }

  dismissChildPopup(){
    const { options } = this.options;
    removeClass(this.warningChildPopup, [CLASS_NAMES.DISPLAY_BLOCK]);
    addClass(this.warningChildPopup, [CLASS_NAMES.DISPLAY_NONE]);
    // Hide backdrop
    if(options.showBackdrop) {
      this.backDrop.hide();
    }
  }

  /**
   * Open widget event
   */
   async show(id, variantId = false, textQty, datakey, parentdatakey,url,product_id, loopIndex = 0, lineItemId = false) {
    console.log('=======',id,variantId,textQty,datakey,parentdatakey,url,product_id)
    console.log('account ',id,variantId,loopIndex,lineItemId);

    console.log('click to open popup')
    productObj={id: id, variantId: variantId, textQty: textQty, datakey: datakey, parentdatakey: parentdatakey,loopIndex : loopIndex, lineItemId : lineItemId,url:url, productId:product_id};
    if(textQty>1){
      removeClass(this.warningPopup, [CLASS_NAMES.DISPLAY_NONE]);
      addClass(this.warningPopup, [CLASS_NAMES.DISPLAY_BLOCK]);
      this.handleMainTabChange();
      return;
    }
    else{
      this.finalSubmit();
    }
    
  }

  finalSubmit(){
    
    removeClass(this.warningPopup, [CLASS_NAMES.DISPLAY_BLOCK]);
    addClass(this.warningPopup, [CLASS_NAMES.DISPLAY_NONE]);
    // console.log('product data',productObj);
    const { options } = this.options;
    if(this.swiper){
      this.swiper.destroy(false, true);
    }

    this.initSwiper(productObj.id, productObj.loopIndex);
    // Show backdrop
    if(options.showBackdrop) {
      this.backDrop.show();
    }
    if(productObj.id != "undefined"){
      this.theme.productID = productObj.variantId;
    }

    this.theme.Qty = productObj.textQty;
    this.theme.selectedKey = productObj.datakey;
    this.theme.selectedParentKey = productObj.parentdatakey;

    removeClass(this.popup, [CLASS_NAMES.DISPLAY_NONE]);
    addClass(this.popup, [CLASS_NAMES.DISPLAY_BLOCK]);

    if(this.attributes.isAccountPage){
      this.attributes.lineItemId = productObj.lineItemId;
      this.populateCardContent(productObj.loopIndex);
      const previewTextArea = document.querySelector("."+CLASS_NAMES.POPUP_OPTIONS_TEXTAREA);
      previewTextArea.dispatchEvent(new KeyboardEvent('keyup', {'key':'y'}));
    }
  }


  populateCardContent(loopIndex = 0){
    console.log(this.attributes[loopIndex])
    this.attributes.orderItemId=this.attributes[loopIndex].orderItemId;
    console.log(this.attributes[loopIndex].orderItemId);
    document.querySelector(".gcw-giftcard_generator-options-textarea").value = this.attributes[loopIndex].message;
    this.fontPicker.setActiveFont(this.attributes[loopIndex].font);
  }

  /**
  * Generate Preview
  */
  generatePreview(design) {
    const previewImage = document.querySelectorAll("."+CLASS_NAMES.POPUP_PREVIEW_CARD_FRONT_IMAGE);
    previewImage.forEach(item => {
      this.setSrc(item, design);
    })
  }

  /**
  * Handle design change
  */
  handleTextAreaChange(){
    const textArea = document.querySelector(".gcw-giftcard_generator-options-textarea");
    const previewText = document.getElementById("previewText");
    const previewTextFinal = document.getElementById("previewTextFinal");
    textArea.addEventListener("keyup", (val) => {
      let text = textArea.value;
      text.replace(/\n\r?/g, '<br />');
      text = text.replace(/(?:&nbsp;|<br>)/g,'');
      
      this.cardMessage = text;
      // previewText.textContent = text;
      // console.log('Text area content ', text)
      previewTextFinal.textContent = text;
    })
  }

  /**
  * Handle country change
  */
   handleCountryChange(){
     const self = this;
      const countrySelect = document.getElementById("country");
      countrySelect.addEventListener("change", function() {
        const form = (new DeliveryForm().setCountryStates(this.value));
        self.replaceTargetWith("states", form);
      })
    }

  /**
  * Replaces target element with HTML
  */
   replaceTargetWith( targetID, html ){
    var last, target = document.getElementById(targetID);
    last = target;
    target.parentNode.insertBefore(html, last);
    target.parentNode.removeChild(target);
  }

  /**
  * Handle quote change
  */
   handleQuoteChange(){
    
    const quoteSelect = document.getElementById("selectQoute");
    const previewText = document.getElementById("previewText");
    const previewTextArea = document.querySelector("."+CLASS_NAMES.POPUP_OPTIONS_TEXTAREA);

    quoteSelect.addEventListener("click", function(){
      var quotesRadio = document.getElementsByName('quote');
      var i;
      for(i = 0; i < quotesRadio.length; i++) {
          if(quotesRadio[i].checked){
            let text = quotesRadio[i].nextSibling.textContent;
            // text.replace(/\n\r?/g, '<br />');
            text = text.replace(/(?:&nbsp;|<br>)/g,'');
            previewTextArea.value = text;
            // previewText.textContent = quotesRadio[i].nextSibling.textContent;
            previewTextArea.dispatchEvent(new KeyboardEvent('keyup', {'key':'y'}));
          }
      }
    })
  }

  /**
  * Populate card design slides
  */
  populateSliddes(){

  }

  /**
  * Handle occasion change in EditorPreview and generate designs
  */
  handleOccasionChange(){
    const self = this;
    const cards = this.cards;
    let selectedOccasion = document.getElementById("card-occasion-select").value;
    let cardCount = 0;
    let initSlide = 0;
    let selectedProductId = null;

    const allSlides = document.querySelectorAll(".gcw-giftcard_generator-options_design-item");
    allSlides.forEach(function callback(value, index) {
      allSlides[index].classList.add("hidden");
    });

    cards.forEach(card =>{
      let cardDesign = document.querySelector(`input[id="${card._id}"]`);
      if(!cardDesign){
        return;
      }

      //return if occasion is not set
      if(selectedOccasion != "View All Occasions" && card.occasion == undefined){
        return
      }
      //return if occasion not matched
      if(selectedOccasion != "View All Occasions" && card.occasion != selectedOccasion){
        return;
      }

      if(window.shopifyCurrentProduct){
        selectedProductId = window.shopifyCurrentProduct.id
      }else if(this.theme.variantID){
        selectedProductId = this.theme.variantID;
      }

      // if(selectedOccasion == "View All Occasions" && parseInt(selectedProductId) != card.product_id){
      //   console.log('here change view all occasion')
      //   return;
      // }
      cardDesign.closest(".gcw-giftcard_generator-options_design-item").classList.remove("hidden");

      if(card.product_id == selectedProductId){
        this.setChecked(cardDesign, true);
      }else if(cardCount == 0){
        this.setChecked(cardDesign, true);
      }
      cardCount++;

    });

    /** changes for swipper initlize at selected card */
    if(selectedProductId != null){

      let selectedCardDesign = this.cards.filter(function (e) {
        return parseInt(e.product_id) == parseInt(selectedProductId);
      })[0];

      if(selectedCardDesign){
        let cardSlide = document.querySelector(`input[value="${selectedCardDesign.image_url}"]`);
        if(cardSlide && cardSlide.getAttribute("data-index")){
          initSlide = parseInt(cardSlide.getAttribute("data-index"));
        }else{
          initSlide = 0;
        }
      }
    }

    this.swiper = new Swiper('.gcw-giftcard_generator-options_design',{
      slidesPerView: 4,
      allowTouchMove: true,
      // spaceBetween: 10,
      observeParents: true,
      observer: true,
      observeSlideChildren: true,
      initialSlide: initSlide,
      grabCursor: true,
      resistanceRatio: 0.5,
      preventClicks: false,
      preventClicksPropagation: false,
      // slideToClickedSlide: true,
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      },
      breakpoints: {
       1000: {
        // allowTouchMove: false,
        }
      }
    });
    // this.swiper.update();
    this.handleDesignChange();
  }

  /**
  * Handle design change
  */
  handleDesignChange(){
    const self = this;

    // Get initial active design
    let initActiveDesign = document.querySelector(".swiper-container").querySelector("input:checked");
    if(!initActiveDesign){
      return;
    }
    this.cardDesign = initActiveDesign.getAttribute('value');
    self.generatePreview(initActiveDesign.getAttribute('value'));
    self.handleMaxLineChange(initActiveDesign.getAttribute('data-lines'))

    // Add event listners to inputs
    document.querySelectorAll("input[name='design']").forEach((input) => {
      input.addEventListener('change', () => {
        const design = input.getAttribute('value');
        this.cardDesign = design;
        self.handleMaxLineChange(document.querySelector(".swiper-container").querySelector("input:checked").getAttribute('data-lines'))
        self.generatePreview(design);
      });
    });
  }

  /**
  * Handle Main tab change
  */
 handleMaxLineChange(lines){

  const maxLines = document.querySelector(".max-lines");
  const lineCount = document.querySelector(".line-count");
  this.setContent(maxLines, lines);
  this.setContent(lineCount, lines);
 }

  /**
  * Handle Main tab change
  */
  handleMainTabChange() {
    console.log('====inital time call');
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("gcw-giftcard_generator-body");
    tablinks = document.querySelectorAll(".gcw-main-tab-button");

    tabcontent[0].style.display = "block";

    tablinks.forEach(link => {
      link.addEventListener("click", ()=>{
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        let id = link.getAttribute("data-id");
        document.getElementById(id).style.display = "block";
        link.className += " active";
      })
    })
  }
  /**
  * Handle tab change
  */
   handleTabChange() {
    //without swiper change slides
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("gcw-giftcard_generator-preview-tab-content");
    tablinks = document.querySelectorAll(".gcw-giftcard_generator-preview-tab-menu-item");
    if(tablinks.length == 0){
      return;
    }

    tablinks[0].classList.add("active");
    tabcontent[0].style.display = "block";

    tablinks.forEach(link => {
      link.addEventListener("click", ()=>{
        for (i = 0; i < tabcontent.length; i++) {
          tabcontent[i].style.display = "none";
        }
        for (i = 0; i < tablinks.length; i++) {
          tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        let id = link.getAttribute("data-id");
        document.getElementById(id).style.display = "block";
        link.className += " active";
      })
    })
  }

  /**
  * Initilizes datepicker
  */
  initDatepicker(){
    if(!this.settings.futureDateActive){
      return;
    }
    this.datePicker = datepicker("#datepicker", {
      position: 'tl'}
      )
    var today = new Date();
    var minDate = this.addDays(today, parseInt(this.settings.minDate))
    this.datePicker.setDate(minDate);
    this.datePicker.setMin(minDate);

  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /**
  * Initilizes Swiper
  */
  initSwiper(id = null, loopIndex = 0){
    const self = this;
    let initSlide = 0;
    // If specifc design selected then set it as default
    let shopifyId = null;
    if(window.shopifyCurrentProduct){
      shopifyId = window.shopifyCurrentProduct.id
    }else if(id != null){
      shopifyId = id;
    }
    
    
    /* in case of cart page */
    if(productObj.productId != null && productObj.productId != undefined ){
      shopifyId = productObj.productId;
    }
    
    Swiper.use([Navigation]);

    console.log('shopifyId','=========',shopifyId);

    console.log('this cards','============',this.cards);
    
    if(shopifyId != null){

      // get specific card if product id matches
      let selectedCardDesign = this.cards.filter(function (e) {
        return parseInt(e.product_id) == parseInt(shopifyId);
      })[0];

      // if result then get index from slidesPerView
      if(selectedCardDesign){
        let cardSlide = document.querySelector(`input[value="${selectedCardDesign.image_url}"]`);
        if(cardSlide && cardSlide.getAttribute("data-index")){
          initSlide = parseInt(cardSlide.getAttribute("data-index"));
        }else{
          initSlide = 0;
        }

        this.generatePreview(selectedCardDesign.image_url);
        this.setChecked(cardSlide, true);
        const allSlides = document.querySelectorAll(".gcw-giftcard_generator-options_design-item");
        allSlides.forEach(function callback(value, index) {
          const currentActiveSlide = allSlides[index].querySelector(`input[value="${selectedCardDesign.image_url}"]`);
          allSlides[index].classList.remove("hidden");
          // if(currentActiveSlide == null){
          //   allSlides[index].classList.add("hidden");
          //   self.swiper.update();
          // }
        });
      }
    }

    this.swiper = new Swiper('.gcw-giftcard_generator-options_design',{
      slidesPerView: 4,
      allowTouchMove: true,
      // spaceBetween: 10,
      observeParents: true,
      observer: true,
      observeSlideChildren: true,
      initialSlide: initSlide,
      grabCursor: true,
      resistanceRatio: 0.5,
      preventClicks: false,
      preventClicksPropagation: false,
      // slideToClickedSlide: true,
      loop: false,
      navigation: {
        nextEl: ".swiper-button-next-custom",
        prevEl: ".swiper-button-prev-custom",
      },
      breakpoints: {
       1000: {
        // allowTouchMove: false,
        }
      }
    });

    // Edit Card select design
    if(this.attributes.isAccountPage){
      let editDesignInput = document.querySelector(`input[value="${this.attributes[loopIndex].designId}"]`);
      this.swiper.slideTo(parseInt(editDesignInput.getAttribute("data-index")));
      this.setChecked(editDesignInput, true);
      this.handleDesignChange();
    }
  }

  /**
  * Initilizes Custom Select
  */
  initCustomSelect(){

    const occasionSelect = document.querySelectorAll('.custom-select');
    occasionSelect.forEach(select => {
      customSelect(select);
    })

    //Append dropdown icon
    const quoteSelectOpener = document.querySelector('.custom-select-opener');
    let dropdownIcon = this.createP();
    dropdownIcon.classList.add("dropdown-icon");
    quoteSelectOpener.appendChild(dropdownIcon);

  }

  validateTextarea(textarea) {
    const errMessageP = document.querySelector(".gcw-giftcard_generator-options-textarea-error");
    const previewBtn = document.getElementById("previewBtn");

    if(textarea.value.length == 0){
      previewBtn.classList.add("disabled");
      errMessageP.classList.add("red");
      errMessageP.innerHTML = "Message can not be empty";
      return false;
    }

    //Regex for Valid Characters i.e. Alphabets, Numbers and Space.
    var regex = /^[\x00-\x7F …’]+$/;

    //Validate TextBox value against the Regex.
    // var isValid = regex.test(textarea.value);
    // if (!isValid) {
    //   previewBtn.classList.add("disabled");
    //   errMessageP.classList.add("red");
    //   errMessageP.innerHTML = `Please remove any foreign characters or emojis to continue.`
    // } else {
    //   previewBtn.classList.remove("disabled");
    //   errMessageP.classList.remove("red");
    //   errMessageP.innerHTML = "Please do not use any foreign characters or emojis.";
    // }

    // return isValid;
  }

 /**
  * Check if customer has aacepted preview before allowing to schedule deliver step
  * @returns void
  */
  acceptPreview() {
    const acceptInput = document.getElementById("accept");
    const scheduleButton = document.getElementById("AddToCartCard");

    acceptInput.addEventListener("change", function(){
      const checked = this.checked;
      if(checked){
        scheduleButton.classList.remove("disabled");
      }else{
        scheduleButton.classList.add("disabled");
      }
    })
  }

  /**
  * Initilizes Font Picker
  * @returns void
  */
  initializeFontPicker(): void {
    const fonts = this.fonts;
    this.fontPicker = new FontPicker(
      "AIzaSyD9lcqrJuLDX_ETp8A4eoNk4u_EnaxLVd0", // Google API key
      "La Belle Aurore", // Default font
      {
        pickerId: "gcw",
        families: fonts.fonts
      }, // Additional options
    );

    if(this.attributes.isAccountPage){
      // fontPicker.setActiveFont("Roboto");
    }

    let dropdownButton = document.querySelector(".dropdown-font-family");
    if(dropdownButton){
      dropdownButton.classList.add("apply-font-gcw");
    }


  }
}
