import Element from './Element';
import CLASS_NAMES from '../constants/classes';
import PopupOptions from '../interfaces/PopupOptions';
import Cards from '../interfaces/Cards';
import Enviroment from '../interfaces/Enviroment';
import { ThemeOptions } from '../interfaces/ThemeOptions';
import PreviewOptions from '../interfaces/PreviewOptions';
import Occasions from '../interfaces/Occasions';

import { library, icon } from '@fortawesome/fontawesome-svg-core';
import { faCaretRight, faCaretLeft } from '@fortawesome/free-solid-svg-icons';

library.add(faCaretRight,faCaretLeft);

export default class EditorPreview extends Element {
  occasions: Occasions;
  options: PopupOptions;
  previewOptions: PreviewOptions;
  theme: ThemeOptions;
  cards: Cards;
  enviroment: Enviroment;

  preview: HTMLElement;

  previewTabMenu: HTMLElement;
  previewTabMenuItem: HTMLElement;
  previewTabFront: HTMLElement;
  previewTabInside: HTMLElement;
  previewContainer: HTMLElement;
  previewCard: HTMLElement;
  previewCardImage: HTMLElement;
  previewBorder: HTMLElement;
  previewText: HTMLElement;
  previewTextContent: HTMLElement;

  popupPreview: HTMLElement;
  popupDesignsWrapper: HTMLElement;
  popupDesigns: HTMLElement;
  popupDesignsMain: HTMLElement;
  popupDesignsItem: HTMLElement;
  popupDesignsItemContent: HTMLElement;
  popupDesignsItemInput: HTMLElement;
  popupDesignsItemLabel: HTMLElement;
  popupDesignsItemImage: HTMLElement;
  popupQuotesOption: HTMLElement;
  popupQuotesSelect: HTMLElement;

  navButton: HTMLElement;
  nextButton: HTMLElement;
  buttonContainer: HTMLElement;


  constructor(previewOptions, cards: Array<Cards>, enviroment: Array<Enviroment>, occasions: Array<Occasions>, theme: Array<ThemeOptions>){
    super();
    this.cards = cards;
    this.enviroment = enviroment;
    this.occasions = occasions;
    this.theme = theme;
    this.previewOptions = previewOptions
    this.createPreview();
  }

  createPreview(){
    const cards = this.cards;
    const enviroment = this.enviroment;
    const occasions = this.occasions;

    // Create popup preview
    this.preview = this.createDiv();
    this.setClass(this.preview, [CLASS_NAMES.POPUP_PREVIEW]);

    this.previewTabMenu = this.createDiv();
    this.setClass(this.previewTabMenu, [CLASS_NAMES.POPUP_PREVIEW_TAB_MENU]);
    // this.preview.appendChild(this.previewTabMenu);

    this.previewTabMenuItem = this.createButton();
    this.setClass(this.previewTabMenuItem, [CLASS_NAMES.POPUP_PREVIEW_TAB_MENU_ITEM]);
    this.setContent(this.previewTabMenuItem, "Front side");
    this.setDataset(this.previewTabMenuItem, "id", "frontside");
    this.previewTabMenu.appendChild(this.previewTabMenuItem);

    this.previewTabMenuItem = this.createButton();
    this.setClass(this.previewTabMenuItem, [CLASS_NAMES.POPUP_PREVIEW_TAB_MENU_ITEM]);
    this.setContent(this.previewTabMenuItem, "Inside");
    this.setDataset(this.previewTabMenuItem, "id", "inside");
    this.previewTabMenu.appendChild(this.previewTabMenuItem);

    this.previewContainer = this.createDiv();
    this.setClass(this.previewContainer, [CLASS_NAMES.POPUP_PREVIEW_CONTAINER]);
    this.preview.appendChild(this.previewContainer);

    this.previewTabFront = this.createDiv();
    this.setClass(this.previewTabFront, [CLASS_NAMES.POPUP_PREVIEW_FRONT, CLASS_NAMES.POPUP_PREVIEW_TAB_MENU_CONTENT]);
    this.setID(this.previewTabFront, "frontside");
    this.previewContainer.appendChild(this.previewTabFront);

    this.previewText = this.createP();
    this.setClass(this.previewText, [CLASS_NAMES.POPUP_PREVIEW_HEADING]);
    this.setContent(this.previewText, "Select note card design");
    this.previewTabFront.appendChild(this.previewText);

    this.popupQuotesSelect = this.createSelect();
    this.setID(this.popupQuotesSelect, "card-occasion-select");
    this.setClass(this.popupQuotesSelect, ["custom-select"]);
    this.setChangeEvent(this.popupQuotesSelect, this.previewOptions.handleOccasionChange.bind(this))
    this.previewTabFront.appendChild(this.popupQuotesSelect);

    this.popupQuotesOption = this.createOption();
    this.setContent(this.popupQuotesOption, "View All Occasions");
    this.popupQuotesSelect.appendChild(this.popupQuotesOption);
    let allOccasions = [];
    this.cards.forEach(card =>{
      if(card.occasion == undefined){
        return;
      }
      if(occasions.occasions.includes(card.occasion)){
        allOccasions.push(card.occasion);
      }
      
    })

    // console.log('all main occasion', allOccasions);
    var allOccasionsUnique = allOccasions.filter((v, i, a) => a.indexOf(v) === i);

    // console.log('main popup occasion drop down', allOccasionsUnique);
    allOccasionsUnique.sort().forEach(occasion =>{
      // Create popup options Designs item
      this.popupQuotesOption = this.createOption();
      this.setContent(this.popupQuotesOption, occasion);
      this.setValue(this.popupQuotesOption, occasion);
      this.popupQuotesSelect.appendChild(this.popupQuotesOption);
    });

    this.previewBorder = this.createDiv();
    this.setClass(this.previewBorder, [CLASS_NAMES.POPUP_PREVIEW_CARD_BORDER]);
    this.previewTabFront.appendChild(this.previewBorder);

    this.previewCard = this.createDiv();
    this.setClass(this.previewCard, [CLASS_NAMES.POPUP_PREVIEW_CARD_FRONT]);
    this.previewBorder.appendChild(this.previewCard);

    this.previewCardImage = this.createImg();
    this.setClass(this.previewCardImage, [CLASS_NAMES.POPUP_PREVIEW_CARD_FRONT_IMAGE]);
    this.previewCard.appendChild(this.previewCardImage);

    // Create popup options Designs
    this.popupDesignsMain = this.createDiv();
    this.setClass(this.popupDesignsMain, [CLASS_NAMES.POPUP_OPTIONS_DESIGNS_MAIN]);
    this.previewBorder.appendChild(this.popupDesignsMain);

    this.popupDesigns = this.createDiv();
    this.setClass(this.popupDesigns, [CLASS_NAMES.POPUP_OPTIONS_DESIGNS, "swiper-container"]);
    this.popupDesignsMain.appendChild(this.popupDesigns);

    this.popupDesignsWrapper = this.createDiv();
    this.setClass(this.popupDesignsWrapper, ["swiper-wrapper"]);
    this.popupDesigns.appendChild(this.popupDesignsWrapper);

    let cardCount = 0;
    let currentProductId = null;
    if(document.querySelector("#ProductSection-product-template")){
      currentProductId = document.querySelector("#ProductSection-product-template").getAttribute("data-product-id");
    }

    cards.forEach(card =>{
      let shopifyId = null;

      if(card.occasion == null){
        this.popupDesignsItem = this.createDiv();
        this.setClass(this.popupDesignsItem, [CLASS_NAMES.POPUP_OPTIONS_DESIGNS_ITEM, "swiper-slide"]);
        if(window.shopifyCurrentProduct){
          shopifyId = window.shopifyCurrentProduct.id;
          // if(parseInt(card.product_id) != shopifyId || parseInt(card.product_id) != this.theme.variantID){
          //   this.setClass(this.popupDesignsItem, [" hidden"]);
          // }
        }

        this.popupDesignsWrapper.appendChild(this.popupDesignsItem);


        this.popupDesignsItemContent = this.createDiv();
        this.setClass(this.popupDesignsItemContent, [CLASS_NAMES.POPUP_OPTIONS_DESIGNS_ITEM_CONTENT]);
        this.popupDesignsItem.appendChild(this.popupDesignsItemContent);

        this.popupDesignsItemInput = this.createInput();
        this.setType(this.popupDesignsItemInput, "radio");
        this.setID(this.popupDesignsItemInput, card._id);
        this.setValue(this.popupDesignsItemInput, card.image_url);
        this.setName(this.popupDesignsItemInput, "design");
        this.setDataset(this.popupDesignsItemInput, "lines", card.character_count);
        this.setDataset(this.popupDesignsItemInput, "index", cardCount);
        this.popupDesignsItemContent.appendChild(this.popupDesignsItemInput);

        if(cardCount === 0){
            this.setChecked(this.popupDesignsItemInput, true);
            this.setSrc(this.previewCardImage, card.image_url);
        }

        this.popupDesignsItemLabel = this.createLabel();
        this.setFor(this.popupDesignsItemLabel, card._id);
        //this.setBackgroundImage(this.popupDesignsItemLabel, card.image_url);
        this.popupDesignsItemContent.appendChild(this.popupDesignsItemLabel);

        this.popupDesignsItemImage = this.createImg();
        this.setSrc(this.popupDesignsItemImage, card.image_url);
        this.popupDesignsItemLabel.appendChild(this.popupDesignsItemImage);
        cardCount++;
      }
      else{
        if(occasions.occasions.includes(card.occasion)){
        // Create popup options Designs item
        this.popupDesignsItem = this.createDiv();
        this.setClass(this.popupDesignsItem, [CLASS_NAMES.POPUP_OPTIONS_DESIGNS_ITEM, "swiper-slide"]);
        if(window.shopifyCurrentProduct){
          shopifyId = window.shopifyCurrentProduct.id;
          // if(parseInt(card.product_id) != shopifyId || parseInt(card.product_id) != this.theme.variantID){
          //   this.setClass(this.popupDesignsItem, [" hidden"]);
          // }
        }

        this.popupDesignsWrapper.appendChild(this.popupDesignsItem);


        this.popupDesignsItemContent = this.createDiv();
        this.setClass(this.popupDesignsItemContent, [CLASS_NAMES.POPUP_OPTIONS_DESIGNS_ITEM_CONTENT]);
        this.popupDesignsItem.appendChild(this.popupDesignsItemContent);

        this.popupDesignsItemInput = this.createInput();
        this.setType(this.popupDesignsItemInput, "radio");
        this.setID(this.popupDesignsItemInput, card._id);
        this.setValue(this.popupDesignsItemInput, card.image_url);
        this.setName(this.popupDesignsItemInput, "design");
        this.setDataset(this.popupDesignsItemInput, "lines", card.character_count);
        this.setDataset(this.popupDesignsItemInput, "index", cardCount);
        this.popupDesignsItemContent.appendChild(this.popupDesignsItemInput);

        if(cardCount === 0){
            this.setChecked(this.popupDesignsItemInput, true);
            this.setSrc(this.previewCardImage, card.image_url);
        }

        this.popupDesignsItemLabel = this.createLabel();
        this.setFor(this.popupDesignsItemLabel, card._id);
        //this.setBackgroundImage(this.popupDesignsItemLabel, card.image_url);
        this.popupDesignsItemContent.appendChild(this.popupDesignsItemLabel);

        this.popupDesignsItemImage = this.createImg();
        this.setSrc(this.popupDesignsItemImage, card.image_url);
        this.popupDesignsItemLabel.appendChild(this.popupDesignsItemImage);
        cardCount++;
      }
      }

      
      
    });

    // Navigation buttons
    const btnNext = icon({ prefix: 'fas', iconName: 'caret-right' })
    const btnPrev = icon({ prefix: 'fas', iconName: 'caret-left' })
    this.navButton = this.createDiv();
    this.setClass(this.navButton, ["swiper-button-next-custom"]);
    this.setContent(this.navButton, btnNext.html)
    this.popupDesignsMain.appendChild(this.navButton);
    this.navButton = this.createDiv();
    this.setClass(this.navButton, ["swiper-button-prev-custom"]);
    this.setContent(this.navButton, btnPrev.html)
    this.popupDesignsMain.appendChild(this.navButton);

    this.buttonContainer = this.createDiv();
    this.setClass(this.buttonContainer, [CLASS_NAMES.BUTTON_CONTAINER]);
    this.preview.appendChild(this.buttonContainer);

    this.popupDesignsItem = this.createDiv();
    this.buttonContainer.appendChild(this.popupDesignsItem);

    this.nextButton = this.createButton();
    this.setClass(this.nextButton, [CLASS_NAMES.PRIMARY_BUTTON, CLASS_NAMES.BUTTON, CLASS_NAMES.MAIN_TAB_BUTTON, "nextSlide"]);
    this.setContent(this.nextButton, "Next");
    this.setDataset(this.nextButton, "id", "options-tab");
    this.buttonContainer.appendChild(this.nextButton);
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
}
