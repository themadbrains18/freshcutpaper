import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import PopupOptions from '../interfaces/PopupOptions';
import { ThemeOptions } from '../interfaces/ThemeOptions';
import Settings from '../interfaces/Settings';

import CountryStates from 'country-state-picker';

import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faChevronLeft)

import { GIFT_CARD_PRODUCT_ID, BACKEND_API } from '../constants/globals';

export default class DeliveryForm extends Element {
  attributes: any;
  options: PopupOptions;
  theme: ThemeOptions;
  settings: Settings;

  deliveryForm: HTMLElement;
  formContainer: HTMLElement;
  formInput: HTMLElement;
  formSelect: HTMLElement;
  formOption: HTMLElement;
  formLabel: HTMLElement;
  inputGroup: HTMLElement;
  inputStateGroup: HTMLElement;
  inputRow: HTMLElement;
  formError: HTMLElement;
  title: HTMLElement;
  text: HTMLElement;

  datepicker: HTMLElement;

  simpleButton: HTMLElement;
  submitButton: HTMLElement;

  constructor(theme: ThemeOptions, settings: Settings, attributes){
    super();
    this.attributes = attributes;
    this.theme = theme;
    this.settings = settings;

    this.createPreview();
  }

  createPreview(): void{
    const countries = CountryStates.getCountries();
    this.deliveryForm = this.createForm();
    this.setClass(this.deliveryForm, [CLASS_NAMES.POPUP_DELIVERY_FORM, CLASS_NAMES.CONTAINER]);
    this.setName(this.deliveryForm, "delivery-form");

    this.title = this.createP();
    this.setClass(this.title, [CLASS_NAMES.TITLE_H3]);
    this.setContent(this.title, "Where should we send this?");
    this.deliveryForm.appendChild(this.title);

    // 1 row
    this.inputRow = this.createDiv();
    this.setClass(this.inputRow, [CLASS_NAMES.POPUP_FORM_INPUT_ROW, CLASS_NAMES.ROW]);

    // Form First name Input field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_6]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "First name");
    this.inputGroup.appendChild(this.formLabel)
    this.formInput = this.createInput();
    this.formInput.inputMode = 'string';
    this.formInput.placeholder = "John";
    this.setName(this.formInput, "firstname");
    this.setType(this.formInput, "text");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT, "required"]);

    this.inputGroup.appendChild(this.formInput)
    this.inputRow.appendChild(this.inputGroup);
    // Form Last name Input field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_6]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "Last name");
    this.inputGroup.appendChild(this.formLabel)
    this.formInput = this.createInput();
    this.formInput.inputMode = 'string';
    this.formInput.placeholder = "Smith";
    this.setName(this.formInput, "lastname");
    this.setType(this.formInput, "text");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT, "required"]);

    this.inputGroup.appendChild(this.formInput)
    this.inputRow.appendChild(this.inputGroup);

    this.deliveryForm.appendChild(this.inputRow);

    // 2 row
    this.inputRow = this.createDiv();
    this.setClass(this.inputRow, [CLASS_NAMES.POPUP_FORM_INPUT_ROW, CLASS_NAMES.ROW]);

    // Create address field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_8]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "Address");
    this.inputGroup.appendChild(this.formLabel)
    this.formInput = this.createInput();
    this.formInput.inputMode = 'string';
    this.formInput.placeholder = "4517 Washington Ave.";
    this.setName(this.formInput, "street");
    this.setType(this.formInput, "text");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT, "required"]);

    this.inputGroup.appendChild(this.formInput)
    this.inputRow.appendChild(this.inputGroup);
    // Create Apt. suite... field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_4]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "Apt, suite, etc. (optional)");
    this.inputGroup.appendChild(this.formLabel)
    this.formInput = this.createInput();
    this.formInput.inputMode = 'string';
    this.setName(this.formInput, "apt");
    this.setType(this.formInput, "text");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT]);

    this.inputGroup.appendChild(this.formInput)
    this.inputRow.appendChild(this.inputGroup);

    this.deliveryForm.appendChild(this.inputRow);

    // 3 row
    this.inputRow = this.createDiv();
    this.setClass(this.inputRow, [CLASS_NAMES.POPUP_FORM_INPUT_ROW, CLASS_NAMES.ROW]);
    // Create city field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_3]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "City");
    this.inputGroup.appendChild(this.formLabel)
    this.formInput = this.createInput();
    this.formInput.inputMode = 'string';
    this.formInput.placeholder = "Manchester";
    this.setName(this.formInput, "city");
    this.setType(this.formInput, "text");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT, "required"]);

    this.inputGroup.appendChild(this.formInput)
    this.inputRow.appendChild(this.inputGroup);
    // Create Country field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_3]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "Country");
    this.inputGroup.appendChild(this.formLabel)
    this.formSelect = this.createSelect();
    this.setID(this.formSelect, "country");
    this.inputGroup.appendChild(this.formSelect)
    countries.forEach(country =>{
      this.formOption = this.createOption();
      this.setContent(this.formOption, country.name);
      this.setValue(this.formOption, country.code);
      if(country.code === 'us'){
        this.setSelected(this.formOption, true);
        this.setContent(this.formOption, "United States");
      }
      this.formSelect.appendChild(this.formOption);
    })

    this.inputRow.appendChild(this.inputGroup);

    // Create zip field
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_3]);
    this.inputRow.appendChild(this.inputGroup)
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "Zip code");
    this.inputGroup.appendChild(this.formLabel)
    this.formInput = this.createInput();
    this.formInput.inputMode = 'string';
    this.setName(this.formInput, "zip");
    this.setType(this.formInput, "text");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT, "required"]);

    this.inputGroup.appendChild(this.formInput)
    this.inputRow.appendChild(this.inputGroup);

    // Create state field
    this.inputStateGroup = this.createDiv();
    this.setClass(this.inputStateGroup, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP, CLASS_NAMES.COL_3]);
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL]);
    this.setContent(this.formLabel, "State");
    this.inputStateGroup.appendChild(this.formLabel);
    this.formSelect = this.setCountryStates();

    if(this.settings.futureDateActive){
      this.setClass(this.inputStateGroup, [CLASS_NAMES.VISSABILITY_HIDDEN]);
    }else{

    }

    this.inputRow.appendChild(this.inputStateGroup);

    this.deliveryForm.appendChild(this.inputRow);

    if(this.settings.futureDateActive){
      this.title = this.createP();
      this.setClass(this.title, [CLASS_NAMES.TITLE_H3]);
      this.setContent(this.title, this.settings.deliveryHeading);
      this.deliveryForm.appendChild(this.title);

      this.text = this.createP();
      this.setClass(this.text, [CLASS_NAMES.BODY_TEXT]);
      this.setContent(this.text, this.settings.deliveryText);
      this.deliveryForm.appendChild(this.text);
    }


    //Create Radio Buttons
    this.inputGroup = this.createDiv();
    if(!this.settings.futureDateActive){
      this.setClass(this.inputGroup, [CLASS_NAMES.VISSABILITY_HIDDEN]);
    }else{
      this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_RADIO_GROUP, CLASS_NAMES.POPUP_FORM_INPUT_GROUP]);
    }
    this.deliveryForm.appendChild(this.inputGroup)
    this.formInput = this.createInput();
    this.setType(this.formInput, "radio");
    this.setID(this.formInput, "deliver-now");
    this.setName(this.formInput, "delivery");
    this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT_RADIO]);
    this.inputGroup.appendChild(this.formInput);
    this.formLabel = this.createLabel();
    this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL_RADIO]);
    this.setFor(this.formLabel, "deliver-now");
    this.setValue(this.formInput, "asap");
    this.setContent(this.formLabel, "Send this card right away");
    this.setChecked(this.formInput, "checked");
    this.inputGroup.appendChild(this.formLabel)

    if(this.settings.futureDateActive){

      this.inputGroup = this.createDiv();
      this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_INPUT_RADIO_GROUP, CLASS_NAMES.POPUP_FORM_INPUT_GROUP]);
      this.deliveryForm.appendChild(this.inputGroup);
      this.formInput = this.createInput();
      this.setType(this.formInput, "radio");
      this.setID(this.formInput, "deliver-later");
      this.setName(this.formInput, "delivery");
      this.setValue(this.formInput, "later");
      this.setClass(this.formInput, [CLASS_NAMES.POPUP_FORM_INPUT_RADIO]);

      this.inputGroup.appendChild(this.formInput);
      this.formLabel = this.createLabel();
      this.setClass(this.formLabel, [CLASS_NAMES.POPUP_FORM_LABEL_RADIO]);
      this.setFor(this.formLabel, "deliver-later");
      this.setContent(this.formLabel, "Please delay this card so that it arrives by...");
      this.inputGroup.appendChild(this.formLabel)

      //Create datepicker
      this.inputRow = this.createDiv();
      this.setClass(this.inputRow, [CLASS_NAMES.POPUP_FORM_INPUT_GROUP]);
      this.datepicker = this.createInput();
      this.setID(this.datepicker, "datepicker");
      this.inputRow.appendChild(this.datepicker);

      this.deliveryForm.appendChild(this.inputRow);
    }

    // Button group
    this.inputGroup = this.createDiv();
    this.setClass(this.inputGroup, [CLASS_NAMES.POPUP_FORM_BUTTON_GROUP, CLASS_NAMES.DISPLAY_FLEX, CLASS_NAMES.JUSTIFY_BETWEEN]);
    this.deliveryForm.appendChild(this.inputGroup);

    const fontIcon = icon({ prefix: 'fas', iconName: 'chevron-left' })
    this.simpleButton = this.createA();
    this.setClass(this.simpleButton, [CLASS_NAMES.SIMPLE_BUTTON, CLASS_NAMES.MAIN_TAB_BUTTON, "prevSlide"]);
    this.setContent(this.simpleButton, fontIcon.html+" Back");
    this.setDataset(this.simpleButton, "id", "preview-tab");
    this.inputGroup.appendChild(this.simpleButton);

    if(this.attributes.isAccountPage){
      this.submitButton = this.createButton();
      this.setClass(this.submitButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON ]);
      this.setContent(this.submitButton, "Save");
      this.inputGroup.appendChild(this.submitButton);

      this.setSubmitEvent(this.deliveryForm, this.onCardEdit.bind(this));
    }else{
      this.submitButton = this.createButton();
      this.setClass(this.submitButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON ]);
      this.setContent(this.submitButton, "Add to cart");
      this.inputGroup.appendChild(this.submitButton);

      this.setSubmitEvent(this.deliveryForm, this.onFormSubmit.bind(this));
    }

  }

  /**
   * Edit card in my account page
   * @param  {Event} event
   */
   async onCardEdit(event: Event) {
    event.preventDefault();
    return;
    const firstName = document.querySelector(".gcw-popup-form-input[name='firstname']").value;
    const lastName = document.querySelector(".gcw-popup-form-input[name='lastname']").value;
    const street = document.querySelector(".gcw-popup-form-input[name='street']").value;
    const apt = document.querySelector(".gcw-popup-form-input[name='apt']").value;
    const city = document.querySelector(".gcw-popup-form-input[name='city']").value;
    const zip = document.querySelector(".gcw-popup-form-input[name='zip']").value;
    const country = document.getElementById("country").value;
    const state = document.getElementById("states").value;

    const font = document.querySelector('.dropdown-font-family').textContent;
    const design = document.querySelector("input[name='design']:checked").value;
    const message = document.querySelector(".gcw-giftcard_generator-options-textarea").value;

    const delivery = document.querySelector('input[name="delivery"]:checked').value;
    let arriveByDate;
    if(document.getElementById("datepicker")){
      arriveByDate = document.getElementById("datepicker").value;
    }

    if(delivery == "asap"){
      arriveByDate = null;
    }

    const errors = this.validateFormFields();
    if (errors) {
      return;
    }

    const editCard = await fetch(`${BACKEND_API}/widget/update-order/${this.attributes.orderId}`, {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'FirstName': firstName,
          'LastName': lastName,
          '_Street': street,
          '_Apt': apt,
          '_City': city,
          '_Zip': zip,
          '_Country': country,
          '_State': state,
          'DeliverTo': `${street} ${apt} ${city} ${country} ${state}`,
          '_Design': design,
          'Font': font,
          'Message': message,
          "Delivery": delivery,
          "DeliveryDate": arriveByDate,
          "orderId": this.attributes.orderId
        })
      });
      location.reload();
   }
  /**
   * Validate and add to cart
   * @param  {Event} event
   */
   async onFormSubmit(event: Event) {
    const theme = this.theme;
    event.preventDefault();
    const firstName = document.querySelector(".gcw-popup-form-input[name='firstname']").value;
    const lastName = document.querySelector(".gcw-popup-form-input[name='lastname']").value;
    const street = document.querySelector(".gcw-popup-form-input[name='street']").value;
    const apt = document.querySelector(".gcw-popup-form-input[name='apt']").value;
    const city = document.querySelector(".gcw-popup-form-input[name='city']").value;
    const zip = document.querySelector(".gcw-popup-form-input[name='zip']").value;
    const country = document.getElementById("country").value;
    const state = document.getElementById("states").value;

    const font = document.querySelector('.dropdown-font-family').textContent;
    const design = document.querySelector("input[name='design']:checked").value;
    const message = document.querySelector(".gcw-giftcard_generator-options-textarea").value;

    const delivery = document.querySelector('input[name="delivery"]:checked').value;
    let arriveByDate;
    if(document.getElementById("datepicker")){
      arriveByDate = document.getElementById("datepicker").value;
    }

    if(delivery == "asap"){
      arriveByDate = null;
    }

    const errors = this.validateFormFields();
    if (errors) {
      return;
    }

    const currentUrl = location.protocol + '//' + location.host + location.pathname + ".json";
    let productJson = {};
    if(location.pathname.includes("product")){
      productJson =  await this.getJSON(currentUrl);
    }
    //live store product
    const giftCardProductID = GIFT_CARD_PRODUCT_ID;

    console.log('theme ===== productID',theme.productID)
    const cardItem ={
        quantity: 1,
        id: giftCardProductID,
        properties: {
          'FirstName': firstName,
          'LastName': lastName,
          '_Street': street,
          '_Apt': apt,
          '_City': city,
          '_Zip': zip,
          '_Country': country,
          '_State': state,
          'DeliverTo': `${street} ${apt} ${city} ${country} ${state}`,
          '_Design': design,
          'Font': font,
          'Varientid':theme.productID,
          'Message': message,
          "Delivery": delivery,
          "DeliveryDate": arriveByDate
        }
      };

    if(theme.productID && theme.postType != "addFromCollection"){
      let lineIndex = theme.productID

      const rawResponse = await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(
              {
                line: lineIndex,
                properties: {
                  'FirstName': firstName,
                  'LastName': lastName,
                  '_Street': street,
                  '_Apt': apt,
                  '_City': city,
                  '_Zip': zip,
                  '_Country': country,
                  '_State': state,
                  'DeliverTo': `${street} ${apt} ${city} ${country} ${state}`,
                  '_Design': design,
                  'Font': font,
                  'Varientid':theme.productID,
                  'Message': message,
                  "Delivery": delivery,
                  "DeliveryDate": arriveByDate
                }
              }
            )
        });
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

    }else{
      let productID;
      if(Object.keys(productJson).length != 0){
        productID = productJson.product.variants[0].id;
      }
      if(theme.productID){
        productID = theme.productID;
      }
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
                properties: {
                  'FirstName': firstName,
                  'LastName': lastName,
                  '_Street': street,
                  '_Apt': apt,
                  '_City': city,
                  '_Zip': zip,
                  '_Country': country,
                  '_State': state,
                  'DeliverTo': `${street} ${apt} ${city} ${country} ${state}`,
                  '_Design': design,
                  'Font': font,
                  'Varientid':theme.productID,
                  'Message': message,
                  "Delivery": delivery,
                  "DeliveryDate": arriveByDate
                }
              }
            ]
          })
        });
    }

    const content = await rawResponse.json();
    window.location.href = '/cart'
   }

  /**
  * Set states based on country
  */
  setCountryStates(countryCode = 'us') {
    const states = CountryStates.getStates(countryCode);
    this.formSelect = this.createSelect();
    this.setID(this.formSelect, "states");
    states.forEach(state =>{
      this.formOption = this.createOption();
      this.setContent(this.formOption, state);
      this.setValue(this.formOption, state);
      this.formSelect.appendChild(this.formOption);
      if(this.attributes.isAccountPage){
        if(state === this.attributes._State){
          this.setSelected(this.formOption, true);
        }
      }
    })
    this.inputStateGroup.appendChild(this.formSelect)
    return this.formSelect;
  }

  validateFormFields(){
    const formFields = document.forms["delivery-form"].getElementsByTagName("input");
    let errors = [];
    for (let item of formFields) {
      if(item.type == "text" && item.classList.contains("required")){
        if(item.value == ""){
          item.classList.add("invalid")
          errors.push(item);
        }else{
          item.classList.remove("invalid")
        }
      }
    }
    if(errors.length > 0){
      return true;
    }else{
      return false;
    }
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

  /**
  * Return Preview element
  */
  getDeliveryForm() {
    return this.deliveryForm;
  }

}
