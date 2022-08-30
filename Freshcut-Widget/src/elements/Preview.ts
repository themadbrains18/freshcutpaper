import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import PopupOptions from '../interfaces/PopupOptions';
import { ThemeOptions } from '../interfaces/ThemeOptions';

import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft)

import { GIFT_CARD_PRODUCT_ID, BACKEND_API } from '../constants/globals';
import { TOP_LEVEL_OAUTH_COOKIE_NAME } from '@shopify/koa-shopify-auth';

export default class EditorPreview extends Element {
  options: PopupOptions;
  attributes: any;
  theme: ThemeOptions;

  cardMessage: String;
  preview: HTMLElement;
  previewTitle: HTMLElement;
  previewContainer: HTMLElement;
  simpleButton: HTMLElement;
  previewCard: HTMLElement;
  frontWrapper: HTMLElement;
  previewCardImage: HTMLElement;
  previewText: HTMLElement;
  previewTextContent: HTMLElement;
  buttonContainer: HTMLElement;
  popupDeliveryButton: HTMLElement;
  inputGroup: HTMLElement;
  formInput: HTMLElement;
  formLabel: HTMLElement;
  submitButton: HTMLElement;
  constructor(theme: ThemeOptions, attributes){
    super();
    this.attributes = attributes;
    this.theme = theme;

    this.createPreview();
  }

  createPreview(): void{
    // Create popup preview
    this.preview = this.createDiv();
    this.setClass(this.preview, [CLASS_NAMES.POPUP_FINAL_PREVIEW]);

    this.previewTitle = this.createP()
    this.setClass(this.previewTitle, [CLASS_NAMES.POPUP_FINAL_PREVIEW_TITLE]);
    this.setContent(this.previewTitle, "Preview your personalized note card");
    this.preview.appendChild(this.previewTitle);

    this.previewContainer = this.createDiv();
    this.setClass(this.previewContainer, [CLASS_NAMES.POPUP_FINAL_PREVIEW_CONTAINER]);
    this.preview.appendChild(this.previewContainer);

    this.previewCard = this.createDiv();
    this.setClass(this.previewCard, [CLASS_NAMES.POPUP_FINAL_PREVIEW_CARD_FRONT]);
    this.previewContainer.appendChild(this.previewCard);

    this.frontWrapper = this.createDiv();
    this.setClass(this.frontWrapper, [CLASS_NAMES.POPUP_FINAL_PREVIEW_FRONT_WRAPPER]);
    this.previewCard.appendChild(this.frontWrapper);

    this.previewCardImage = this.createImg();
    this.setClass(this.previewCardImage, [CLASS_NAMES.POPUP_PREVIEW_CARD_FRONT_IMAGE]);
    this.frontWrapper.appendChild(this.previewCardImage);

    this.previewText = this.createDiv();
    this.setClass(this.previewText, [CLASS_NAMES.POPUP_FINAL_PREVIEW_CARD_TEXT]);
    this.previewContainer.appendChild(this.previewText);

    this.previewTextContent = this.createTextarea();
    this.setClass(this.previewTextContent, [CLASS_NAMES.POPUP_FINAL_PREVIEW_CARD_TEXT_CONTENT, "apply-font-gcw"]);
    this.setID(this.previewTextContent, "previewTextFinal");
    this.previewText.appendChild(this.previewTextContent);

    this.buttonContainer = this.createDiv();
    this.setClass(this.buttonContainer, [CLASS_NAMES.BUTTON_CONTAINER, "agree-container"]);
    this.preview.appendChild(this.buttonContainer);

    this.inputGroup = this.createDiv();
    // this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_RADIO_GROUP, CLASS_NAMES.POPUP_FORM_INPUT_GROUP]);
    this.buttonContainer.appendChild(this.inputGroup)
    this.formInput = this.createInput();
    this.setType(this.formInput, "checkbox");
    this.setID(this.formInput, "accept");
    this.setName(this.formInput, "accept");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT_RADIO]);
    this.inputGroup.appendChild(this.formInput);
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL_RADIO, "accept-checkbox"]);
    this.setFor(this.formLabel, "accept");
    this.setValue(this.formInput, "accept");
    this.setContent(this.formLabel, "I approve this design");
    this.inputGroup.appendChild(this.formLabel)

    this.buttonContainer = this.createDiv();
    this.setClass(this.buttonContainer, [CLASS_NAMES.BUTTON_CONTAINER]);
    this.preview.appendChild(this.buttonContainer);

    const fontIcon = icon({ prefix: 'fas', iconName: 'chevron-left' })
    this.simpleButton = this.createButton();
    this.setClass(this.simpleButton, [CLASS_NAMES.SIMPLE_BUTTON, CLASS_NAMES.MAIN_TAB_BUTTON, CLASS_NAMES.BACK_BUTTON, "prevSlide"]);
    this.setContent(this.simpleButton, fontIcon.html+"Back to editor");
    this.setDataset(this.simpleButton, "id", "options-tab");
    this.buttonContainer.appendChild(this.simpleButton);

    // this.popupDeliveryButton = this.createButton();
    // this.setClass(this.popupDeliveryButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON, CLASS_NAMES.MAIN_TAB_BUTTON, "nextSlide", CLASS_NAMES.DISABLED]);
    // this.setContent(this.popupDeliveryButton, "Schedule delivery");
    // this.setID(this.popupDeliveryButton, "schedule-button");
    // this.setDataset(this.popupDeliveryButton, "id", "schedule-tab");
      // this.buttonContainer.appendChild(this.popupDeliveryButton);


      if(this.attributes.isAccountPage){
        this.submitButton = this.createButton();
        this.setClass(this.submitButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON, CLASS_NAMES.DISABLED]);
        this.setID(this.submitButton, "AddToCartCard");
        this.setContent(this.submitButton, "Save");
        this.buttonContainer.appendChild(this.submitButton);

        this.setClickEvent(this.submitButton, this.onCardEdit.bind(this));
      }else{
        this.submitButton = this.createButton();
        this.setClass(this.submitButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON, CLASS_NAMES.DISABLED]);
        this.setContent(this.submitButton, "Add to cart");
        this.setID(this.submitButton, "AddToCartCard"); 
        this.buttonContainer.appendChild(this.submitButton);

        this.setClickEvent(this.submitButton, this.onFormSubmit.bind(this));
      }
  }

  /**
   * Add card to cart
   * @param  {Event} event
   */
  async onFormSubmit(event: Event) {
    console.log('here form submit or design');
    const theme = this.theme;
    const font = document.querySelector('.dropdown-font-family').textContent;
    const design = document.querySelector("input[name='design']:checked").value;
    const message = document.querySelector(".gcw-giftcard_generator-options-textarea").value;
    const AddToCartCard = document.querySelector("#AddToCartCard");
    
    let cardVarientID=0;
    
    const giftCardProductID = GIFT_CARD_PRODUCT_ID;
    AddToCartCard.textContent = "Adding to cart...";
    AddToCartCard.classList.add("disabled");

    const currentUrl = location.protocol + '//' + location.host + location.pathname + ".json";
    let productJson = {};
    if(location.pathname.includes("product")){
      productJson =  await this.getJSON(currentUrl);
    }

    const cardItem ={
      quantity: theme.Qty>1?theme.Qty:1,
      id: giftCardProductID,
      properties: {
        '_Design': design,
        'Font': font,
        'Message': message,
        "Delivery": "asap",
        "DeliveryDate": null,
        "Varientid":theme.productID,
        "_id": Date.now(),
      }
    };
    
    console.log('theme.postType',theme.postType);

    if(theme.productID && theme.postType != "addFromCollection"){
      console.log('====second time add to cart')
      let lineIndex = theme.productID

      if(theme.selectedParentKey != undefined && theme.selectedKey != undefined){

        if(theme.selectedKey == '0' && theme.selectedParentKey !='0'){

           console.log('child item 0 and parent not 0')

           console.log('====',theme.productID)
            const addCard = await fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                items:[cardItem]
              })
            });

            let editMessage=[];
            if(theme.selectedParentKey!='0' && theme.selectedParentKey!=undefined){
              console.log('change message also with parent when add first time ');
              editMessage.push({key:theme.selectedParentKey});

              for(let itemkey of editMessage){
                console.log('key',itemkey.key);
                const rawResponse = await fetch('/cart/change.js', {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                          id: itemkey.key,
                          quantity: cardItem.quantity,
                          properties:cardItem.properties
                        }
                      )
                });
                console.log("rawResponse", rawResponse)
              }
            }

            
        }
        else if(theme.selectedKey != '0' && theme.selectedParentKey !='0'){
            console.log('child item 0 and parent item also 0')
            console.log('change message')
            let editMessage=[];
            if(theme.selectedKey!='0'){
              editMessage.push({key:theme.selectedKey});
            }
            if(theme.selectedParentKey!='0'){
              console.log('change message also with parent');
              editMessage.push({key:theme.selectedParentKey});
            }
    
            for(let itemkey of editMessage){
              console.log('key',itemkey.key);
              const rawResponse = await fetch('/cart/change.js', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(
                      {
                        id: itemkey.key,
                        quantity: cardItem.quantity,
                        properties:cardItem.properties
                      }
                    )
              });
              console.log("rawResponse", rawResponse)
            }
        }
        else{
            console.log('====',theme.productID)
            const addCard = await fetch('/cart/add.js', {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                items:[cardItem]
              })
            });
        }
      }
      // else{
      //   console.log('====',theme.productID)
      //   const addCard = await fetch('/cart/add.js', {
      //     method: 'POST',
      //     headers: {
      //         'Accept': 'application/json',
      //         'Content-Type': 'application/json'
      //     },
      //     body: JSON.stringify({
      //       items:[cardItem]
      //     })
      //   });
      // }
    }
    else{
      console.log('====first time add to cart')
      let productID;
      if(Object.keys(productJson).length != 0){
        productID = productJson.product.variants[0].id;
      }
      if(theme.productID){
        productID = theme.productID;
      }

      console.log('====',productID)

      cardItem.properties.Varientid=productID;

      const rawResponse = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            items: [
              cardItem,
              {
                quantity: 1,
                id: productID,
                properties: cardItem.properties
              }
            ]
          })
        });
    }
    window.location.href = '/cart';
  }

  /**
   * Edit card in my account page
   * @param  {Event} event
   */
  async onCardEdit(event: Event) {
    console.log('on card new item second time');
    const font = document.querySelector('.dropdown-font-family').textContent;
    const design = document.querySelector("input[name='design']:checked").value;
    const message = document.querySelector(".gcw-giftcard_generator-options-textarea").value;
    console.log(this.attributes.orderId);
    console.log(this.attributes.orderItemId);
    const editCard = await fetch(`${BACKEND_API}/widget/update-order/${this.attributes.orderId}/${this.attributes.orderItemId}`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          '_Design': design,
          'Font': font,
          'Message': message,
          'lineItemID': this.attributes.lineItemId,
          "Delivery": "asap",
          "DeliveryDate": null
        })
    });
    location.reload();
  }

  /**
 * Return Preview element
 */
  getPreview() {
    return this.preview;
  }

  getPreviewCard(){
    return this.previewCard;
  }

  async getJSON(url) {
    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json';
      xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
          resolve(xhr.response);
        } else {
          reject({
            status: status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.send();
    });
  };

}
