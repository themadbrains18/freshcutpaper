import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import PopupOptions from '../interfaces/PopupOptions';
import Quotes from '../interfaces/Quotes';
import Fonts from '../interfaces/Fonts';
import Occasions from '../interfaces/Occasions';
import { ThemeOptions } from '../interfaces/ThemeOptions';
import InspirationPopup from './InsipirationPopup';

import { addClass, removeClass } from '../helpers/utils';

import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';


library.add(faChevronLeft)

let _buffer;
export default class Options extends Element {
  attributes: any;
  
  options: PopupOptions;
  quotes: Quotes;
  fonts: Fonts;
  occasions: Occasions;

  inspirationPopup: HTMLElement;

  popupOptions: HTMLElement;
  popupPreview: HTMLElement;
  popupInputRow: HTMLElement;
  popupInputLabel: HTMLElement;

  popupQuotes: HTMLElement;
  popupQuotesItem: HTMLElement;
  popupQuotesSelect: HTMLElement;
  popupQuotesOption: HTMLElement;
  popupQuotesLabel: HTMLElement;

  popupMessageLabel: HTMLElement;
  popupQuotesTextarea: HTMLElement;
  popupQuotesTextareaError: HTMLElement;

  popupEmojiImage: HTMLElement;
  emojiPopup:HTMLElement;
  emojiButton:HTMLElement;

  popupDeliveryButton: HTMLElement;
  popupPreviewButton: HTMLElement;

  popupFontPicker: HTMLElement;

  inspButton: HTMLElement;
  nextButton: HTMLElement;
  backButton: HTMLElement;
  buttonContainer: HTMLElement;

  constructor(quotes: Array<Quotes>, fonts: Array<Fonts>, occasions: Array<Occasions>, attributes){
    super();
    this.attributes = attributes;
    this.quotes = quotes;
    this.fonts = fonts;
    this.occasions = occasions;

    this.createOptions();
    this.events();
    
  }


  

  createOptions(){
    const quotes = this.quotes;
    const fonts = this.fonts;
    const occasions = this.occasions;

    // Create popup options
    this.popupOptions = this.createDiv();
    this.setClass(this.popupOptions, [CLASS_NAMES.POPUP_OPTIONS]);


    // Create popup options Font picker
    this.popupInputRow = this.createDiv();
    this.setClass(this.popupInputRow, [CLASS_NAMES.POPUP_PREVIEW_INPUT_ROW]);
    this.popupOptions.appendChild(this.popupInputRow);

    this.popupInputLabel = this.createLabel();
    this.setContent(this.popupInputLabel, "Fonts");
    this.popupInputRow.appendChild(this.popupInputLabel);

    this.popupFontPicker = this.createDiv();
    this.setID(this.popupFontPicker, [CLASS_NAMES.POPUP_FONT_PICKER]);
    this.setClass(this.popupFontPicker, ["apply-font-gcw"]);
    this.popupInputRow.appendChild(this.popupFontPicker);

    // Create message tex area
    this.popupInputRow = this.createDiv();
    this.setClass(this.popupInputRow, [CLASS_NAMES.POPUP_PREVIEW_INPUT_ROW, "text-preview"]);
    this.popupOptions.appendChild(this.popupInputRow);

    this.popupMessageLabel = this.createLabel();
    this.setContent(this.popupMessageLabel, "Message");
    this.setClass(this.popupMessageLabel, ["msgLabel"]);

    this.popupInputRow.appendChild(this.popupMessageLabel);

    this.popupQuotesTextarea = this.createTextarea();
    this.setClass(this.popupQuotesTextarea, [CLASS_NAMES.POPUP_OPTIONS_TEXTAREA, "apply-font-gcw"]);
    this.setRows(this.popupQuotesTextarea, "10");
    this.setCols(this.popupQuotesTextarea, "20");
    this.setWrap(this.popupQuotesTextarea, "hard");
    this.popupInputRow.appendChild(this.popupQuotesTextarea);

    this.popupEmojiImage = this.createImg();
    this.setClass(this.popupEmojiImage, [CLASS_NAMES.POPUP_OPTIONS_EMOJI]);
    this.setSrc(this.popupEmojiImage, 'https://img.icons8.com/external-tulpahn-basic-outline-tulpahn/25/000000/external-emoji-birthday-party-tulpahn-basic-outline-tulpahn.png');
    this.popupInputRow.appendChild(this.popupEmojiImage);
    
    // this.emojiButton=this.createButton();
    // this.setClass(this.emojiButton, [CLASS_NAMES.POPUP_OPTIONS_EMOJI]);
    // this.setContent(this.emojiButton, "emoji");
    // this.popupInputRow.appendChild(this.emojiButton);

    // this.popupQuotesTextareaError = this.createP();
    // this.setClass(this.popupQuotesTextareaError, [CLASS_NAMES.POPUP_OPTIONS_TEXTAREA_ERROR]);
    // this.setContent(this.popupQuotesTextareaError, "Please do not use any foreign characters or emojis.");
    // this.popupInputRow.appendChild(this.popupQuotesTextareaError);

    //Inspiration popup button
    this.buttonContainer = this.createDiv();
    this.setClass(this.buttonContainer, [CLASS_NAMES.BUTTON_CONTAINER]);
    this.popupInputRow.appendChild(this.buttonContainer);

    this.inspButton = this.createButton();
    this.setClass(this.inspButton, [CLASS_NAMES.SIMPLE_BUTTON]);
    this.setContent(this.inspButton, "Need Inspiration?");
    this.setID(this.inspButton, "inspButton");
    this.setClickEvent(this.inspButton, this.showInsp.bind(this))
    this.buttonContainer.appendChild(this.inspButton);

    this.popupMessageLabel = this.createP();
    this.setClass(this.popupMessageLabel, [CLASS_NAMES.POPUP_OPTIONS_LINES]);
    this.setContent(this.popupMessageLabel, `<span class="line-count">0</span>/<span class="max-lines">16</span> printable lines remaining`);
    this.buttonContainer.appendChild(this.popupMessageLabel);

    // Action buttons
    this.buttonContainer = this.createDiv();
    this.setClass(this.buttonContainer, [CLASS_NAMES.BUTTON_CONTAINER]);
    this.popupOptions.appendChild(this.buttonContainer);

    const fontIcon = icon({ prefix: 'fas', iconName: 'chevron-left' })
    this.backButton = this.createButton();
    this.setClass(this.backButton, [CLASS_NAMES.SIMPLE_BUTTON, CLASS_NAMES.MAIN_TAB_BUTTON, "prevSlide"]);
    this.setContent(this.backButton, fontIcon.html+"Back to Design");
    this.setDataset(this.backButton, "id", "editor-tab");
    this.buttonContainer.appendChild(this.backButton);

    this.popupPreviewButton = this.createButton();
    this.setClass(this.popupPreviewButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON, CLASS_NAMES.MAIN_TAB_BUTTON, CLASS_NAMES.BACK_BUTTON, CLASS_NAMES.DISABLED, "nextSlide"]);
    this.setContent(this.popupPreviewButton, "Preview");
    this.setID(this.popupPreviewButton, "previewBtn");
    this.setDataset(this.popupPreviewButton, "id", "preview-tab");
    this.buttonContainer.appendChild(this.popupPreviewButton);

    this.inspirationPopup = (new InspirationPopup(quotes, occasions).getInspirataionPopup());
    this.setClass(this.inspirationPopup, [CLASS_NAMES.INSP_WRAPPER, CLASS_NAMES.DISPLAY_NONE]);
    this.popupOptions.appendChild(this.inspirationPopup);

  }
    /**
   * Close widget event
   */
  showInsp() {
    const backDrop = document.querySelector("."+CLASS_NAMES.POPUP_INNER_BACKDROP);
    removeClass(backDrop, [CLASS_NAMES.VISSABILITY_HIDDEN]);
    addClass(backDrop, [CLASS_NAMES.VISSABILITY_VISSIBLE])

    removeClass(this.inspirationPopup, [CLASS_NAMES.DISPLAY_NONE]);
    addClass(this.inspirationPopup, [CLASS_NAMES.DISPLAY_BLOCK])
  }

  // Events
  events(){
    const self = this;
    let previousMessage = "";
    let previousLinesCount = 1;
    this.popupQuotesTextarea.addEventListener('keyup', (event) => {
      
      /** disable emoji when enter from keyboard */
      // var regex = new RegExp("^[a-zA-Z0-9]+$");
      // var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);
      // if (!regex.test(key)) {
      //    event.preventDefault();
      //    return false;
      // }

      /** disable emoji when enter from keyboard */

      let currentMessage = this.popupQuotesTextarea.value;
      var eachLine = currentMessage.split('\n');
      let localvalue = localStorage.getItem('quateMsg');
      currentMessage = currentMessage.replace(/(?:&nbsp;|<br>)/g,'');
      
      if(eachLine.length > 1 && localvalue == 'true'){
        console.log('eachLine.length',eachLine.length)
        if(eachLine[1] == ""){
          currentMessage = eachLine[0];
        }
        
        localStorage.setItem('quateMsg','false');
      }
      else{
        localStorage.setItem('quateMsg','false');
      }

      this.popupQuotesTextarea.value = currentMessage;

      let lines = this.countLines(event.target);
      const lineCount = document.querySelector(".line-count");
      const maxLines = document.querySelector(".max-lines").textContent;
      const linesRemaining = lines;
      const buttonPreview = document.querySelector("#previewBtn");
      
      console.log('======lines =======',lines);
      if( lines > parseInt(maxLines)){
        buttonPreview.classList.add("disabled");
        this.popupQuotesTextarea.value = previousMessage;

        let recheckLines = this.countLines(event.target);
        if( recheckLines <= parseInt(maxLines)){
          buttonPreview.classList.remove("disabled");
          let remaining = recheckLines
          this.setContent(lineCount, remaining);
        }

      }else{
        buttonPreview.classList.remove("disabled");
        previousMessage = currentMessage;
        this.popupQuotesTextarea.value = currentMessage;
        this.setContent(lineCount, linesRemaining);
      }
      previousLinesCount = lines;
    });
  }
  /**
  * Returns the number of lines in a textarea, including wrapped lines.
  *
  * __NOTE__:
  * [textarea] should have an integer line height to avoid rounding errors.
  */
  countLines(textarea) {
    if (_buffer == null) {
        _buffer = document.createElement('textarea');
        _buffer.style.border = 'none';
        _buffer.style.height = '0';
        _buffer.style.overflow = 'hidden';
        _buffer.style.padding = '0';
        _buffer.style.position = 'absolute';
        _buffer.style.left = '0';
        _buffer.style.top = '0';
        _buffer.style.zIndex = '-1';
        _buffer.style.minHeight = '0';
        this.popupOptions.appendChild(_buffer);
    }

    var cs = window.getComputedStyle(textarea);
    var pl = parseInt(cs.paddingLeft);
    var pr = parseInt(cs.paddingRight);
    var lh = parseInt(cs.lineHeight);

    // [cs.lineHeight] may return 'normal', which means line height = font size.
    if (isNaN(lh)) lh = parseInt(cs.fontSize);

    // Copy content width.
    _buffer.style.width = (textarea.clientWidth - pl - pr) + 'px';

    // Copy text properties.
    _buffer.style.font = cs.font;
    _buffer.style.letterSpacing = cs.letterSpacing;
    _buffer.style.whiteSpace = cs.whiteSpace;
    _buffer.style.wordBreak = cs.wordBreak;
    _buffer.style.wordSpacing = cs.wordSpacing;
    _buffer.style.wordWrap = cs.wordWrap;

    // Copy value.
    _buffer.value = textarea.value;

    var result = Math.floor(_buffer.scrollHeight / lh);
    if (result == 0) result = 1;
    return result;
  }

  /**
 * Return Preview element
 */
  getOptions() {
    return this.popupOptions;
  }
}
