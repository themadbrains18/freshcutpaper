import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import Occasions from '../interfaces/Occasions';
import Quotes from '../interfaces/Quotes';
import customSelect from 'custom-select';

import { addClass, removeClass } from '../helpers/utils';

export default class InspirationPopup extends Element {
  occasions: Occasions;
  quotes: Quotes;

  wrapper: HTMLElement;
  topBar: HTMLElement;
  footer: HTMLElement;
  closeBtn: HTMLElement;
  okButton: HTMLElement;
  title: HTMLElement;
  subTitle: HTMLElement;

  popupInputRow: HTMLElement;
  popupInputLabel: HTMLElement;

  quotesContainer: HTMLElement;

  popupQuotes: HTMLElement;
  popupQuotesItem: HTMLElement;
  popupQuotesSelect: HTMLElement;
  popupQuotesOption: HTMLElement;
  popupQuotesContainer: HTMLElement;
  popupQuotesRadio: HTMLElement;
  popupQuotesLabel: HTMLElement;


  constructor(quotes: Array<Quotes>, occasions: Array<Occasions>){
    super();

    this.occasions = occasions;
    this.quotes = quotes;

    this.createPopup();
    
    // this.renderQuotes(occasions.occasions[0]);
  }

  createPopup(){
    const quotes = this.quotes;
    const occasions = this.occasions;

    this.wrapper = document.createElement("div");

    this.topBar = this.createDiv();
    this.setClass(this.topBar, [CLASS_NAMES.INSP_TOP_BAR]);
    this.wrapper.appendChild(this.topBar);

     // Create close button
     this.closeBtn = this.createDiv();
     this.setClass(this.closeBtn, [CLASS_NAMES.POPUP_CLOSE_BTN, "dark"]);
     this.topBar.appendChild(this.closeBtn);
     this.setClickEvent(this.closeBtn, this.dismiss.bind(this))

     this.title = this.createP();
     this.setContent(this.title, "Not sure what to write?");
     this.setClass(this.title, [CLASS_NAMES.INSP_TITLE]);
     this.wrapper.appendChild(this.title);

     this.subTitle = this.createP();
     this.setContent(this.subTitle, "Start off with one of our messages!");
     this.setClass(this.subTitle, [CLASS_NAMES.INSP_SUBTITLE]);
     this.wrapper.appendChild(this.subTitle);

     // Create occasions select element
     this.popupInputRow = this.createDiv();
     this.setClass(this.popupInputRow, [CLASS_NAMES.POPUP_PREVIEW_INPUT_ROW]);
     this.wrapper.appendChild(this.popupInputRow);

     this.popupQuotes = this.createDiv();
     this.setClass(this.popupQuotes, [CLASS_NAMES.POPUP_OPTIONS_QUOTES]);
     this.popupInputRow.appendChild(this.popupQuotes);

     this.popupQuotesLabel = this.createLabel();
     this.setContent(this.popupQuotesLabel, "Occasion");
     this.popupInputRow.appendChild(this.popupQuotesLabel);

     this.popupQuotesSelect = this.createSelect();
     this.setID(this.popupQuotesSelect, "occasion-select");
     this.setClass(this.popupQuotesSelect, ["custom-select"]);
     this.setChangeEvent(this.popupQuotesSelect, this.renderQuotes.bind(this))
     this.popupInputRow.appendChild(this.popupQuotesSelect);

    //  let occasionSort = occasions.occasions.sort()
    let allOccasions = [];

    quotes.forEach(quote =>{
      if(quote.occasion == undefined){
        return;
      }
      if(occasions.occasions.includes(quote.occasion)){
        allOccasions.push(quote.occasion);
      }
      // allOccasions.push(quote.occasion);
    })

    var allOccasionsUnique = allOccasions.filter((v, i, a) => a.indexOf(v) === i);
    allOccasionsUnique.sort().forEach(occasion =>{
      // Create popup options Designs item
      // console.log('occasions drop down value', occasion)
      this.popupQuotesOption = this.createOption();
      this.setContent(this.popupQuotesOption, occasion);
      this.setValue(this.popupQuotesOption, occasion);
      this.popupQuotesSelect.appendChild(this.popupQuotesOption);
    });

    //  occasionSort.forEach(occasion =>{
    //    // Create popup options Designs item
    //    console.log('occasions drop down value', occasion)
    //    this.popupQuotesOption = this.createOption();
    //    this.setContent(this.popupQuotesOption, occasion);
    //    this.setValue(this.popupQuotesOption, occasion);
    //    this.popupQuotesSelect.appendChild(this.popupQuotesOption);
    //  });

    // Create popup options quotes
    this.quotesContainer = this.createDiv();
    this.setClass(this.popupInputRow, [CLASS_NAMES.POPUP_PREVIEW_INPUT_ROW]);
    this.wrapper.appendChild(this.quotesContainer);

    this.popupQuotes = this.createDiv();
    this.setClass(this.popupQuotes, [CLASS_NAMES.POPUP_OPTIONS_QUOTES]);
    this.quotesContainer.appendChild(this.popupQuotes);

    this.popupQuotesLabel = this.createLabel();
    this.setContent(this.popupQuotesLabel, "Quotes");
    this.quotesContainer.appendChild(this.popupQuotesLabel);

    this.popupQuotesContainer = this.createDiv();
    this.setClass(this.popupQuotesContainer, [CLASS_NAMES.INSP_QUOTE_CONTAINER]);
    this.setID(this.popupQuotesContainer, "quote-select")
    this.quotesContainer.appendChild(this.popupQuotesContainer);

    this.footer = this.createDiv();
    this.setClass(this.footer, [CLASS_NAMES.INSP_FOOTER]);
    this.wrapper.appendChild(this.footer);

    this.okButton = this.createButton();
    this.setClass(this.okButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON]);
    this.setContent(this.okButton, "Select message");
    this.setID(this.okButton, "selectQoute");
    this.setClickEvent(this.okButton, this.dismiss.bind(this));
    this.footer.appendChild(this.okButton);

    this.renderQuotes(allOccasionsUnique[0]);
    setTimeout(() => {
      this.initCustomSelect();  
    }, 3000);
    

  }

  renderQuotes(occasion){
    const quotes = this.quotes;

    console.log('inspired dropdown occasions' , occasion);
    this.popupQuotesContainer.innerHTML = "";
    if(!occasion){
      const occasionSelect = document.getElementById("occasion-select");
      occasion = occasionSelect.value;
    }
    quotes.forEach(quote =>{
      if(quote.occasion != occasion){
        return;
      }
      this.popupInputRow = this.createDiv();
      this.setClass(this.popupInputRow, [CLASS_NAMES.POPUP_PREVIEW_INPUT_ROW, CLASS_NAMES.INSP_QUOTE_ITEM]);
      this.popupQuotesContainer.appendChild(this.popupInputRow);

      // Create popup options Designs item
      this.popupQuotesRadio = this.createInput();
      this.setType(this.popupQuotesRadio, "radio");
      this.setName(this.popupQuotesRadio, "quote");
      this.setContent(this.popupQuotesRadio, quote.quote);
      this.setDataset(this.popupQuotesRadio, "data-occasion", quote.occasion);
      this.setValue(this.popupQuotesRadio, quote._id);
      this.setID(this.popupQuotesRadio, quote._id);
      this.popupInputRow.appendChild(this.popupQuotesRadio);

      this.popupQuotesLabel = this.createLabel();
      this.setFor(this.popupQuotesLabel, quote._id);
      this.setContent(this.popupQuotesLabel, quote.quote);
      this.popupInputRow.appendChild(this.popupQuotesLabel);
    });
  }

  /**
   * Close widget event
   */
   dismiss() {
    localStorage.setItem('quateMsg','true');
    const backDrop = document.querySelector("."+CLASS_NAMES.POPUP_INNER_BACKDROP);
    addClass(backDrop, [CLASS_NAMES.VISSABILITY_HIDDEN]);
    removeClass(backDrop, [CLASS_NAMES.VISSABILITY_VISSIBLE])

    removeClass(this.wrapper, [CLASS_NAMES.DISPLAY_BLOCK]);
    addClass(this.wrapper, [CLASS_NAMES.DISPLAY_NONE])

  }


    /**
  * Return Preview element
  */
  getInspirataionPopup() {
    return this.wrapper;
  }

  initCustomSelect(){

    const inspwrapper= document.querySelector('.gcw-insp-wrapper');
    
    //Append dropdown icon
    const quoteSelectOpener = inspwrapper.querySelector('.custom-select-opener');
    let dropdownIcon = this.createP();
    dropdownIcon.classList.add("dropdown-icon");
    quoteSelectOpener.appendChild(dropdownIcon);

  }
}
