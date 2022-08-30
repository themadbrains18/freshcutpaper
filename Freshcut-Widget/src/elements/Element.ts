/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
import '../assets/styles/widget.scss';
import { removeClass, addClass } from '../helpers/utils';
import ClassName from '../constants/classes';

export default class Element {
  tagName: { DIV: string; SPAN: string; P: string; INPUT: string; TEXTAREA: string; SELECT: string; OPTION: string, BUTTON: string, UL: string; LI: string; TIME: string; LABEL: string; A: string; IMG: string; VIDEO: string; FORM: string, STYLE: string };
  eventName: { CLICK: string; KEYDOWN: string; KEYUP: string; CHANGE: string; SCROLL: string; SUBMIT: string, PASTE: string; };

  constructor() {
    this.tagName = {
      DIV: 'div',
      SPAN: 'span',
      P: 'p',
      INPUT: 'input',
      BUTTON: 'button',
      UL: 'ul',
      LI: 'li',
      TIME: 'time',
      LABEL: 'label',
      A: 'a',
      IMG: 'img',
      VIDEO: 'video',
      FORM: 'form',
      STYLE: 'style',
      SELECT: 'select',
      OPTION: 'option',
      TEXTAREA: 'textarea',
    };
    this.eventName = {
      CLICK: 'click',
      KEYDOWN: 'keydown',
      KEYUP: 'keyup',
      CHANGE: 'change',
      SCROLL: 'scroll',
      SUBMIT: 'submit',
      PASTE: 'paste',
    };
  }

  /*
  Create Elements
   */
  createDiv() {
    return document.createElement(this.tagName.DIV);
  }

  createTime() {
    return document.createElement(this.tagName.TIME);
  }

  createA() {
    return document.createElement(this.tagName.A);
  }

  createImg() {
    return document.createElement(this.tagName.IMG);
  }

  createSpan() {
    return document.createElement(this.tagName.SPAN);
  }

  createP() {
    return document.createElement(this.tagName.P);
  }

  createLabel() {
    return document.createElement(this.tagName.LABEL);
  }

  createButton() {
    return document.createElement(this.tagName.BUTTON);
  }

  createInput() {
    return document.createElement(this.tagName.INPUT);
  }

  createTextarea() {
    return document.createElement(this.tagName.TEXTAREA);
  }

  createSelect() {
    return document.createElement(this.tagName.SELECT);
  }

  createOption() {
    return document.createElement(this.tagName.OPTION);
  }

  createUl() {
    return document.createElement(this.tagName.UL);
  }

  createLi() {
    return document.createElement(this.tagName.LI);
  }

  createVideo() {
    return document.createElement(this.tagName.VIDEO);
  }

  createForm() {
    return document.createElement(this.tagName.FORM);
  }

  createStyle() {
    return document.createElement(this.tagName.STYLE);
  }

  setClass(...args):void {
    args.reduce((target, classes) => (target.className += classes.join(' ')));
  }

  removeClass(target, c) {
    target.classList.remove(c);
  }

  setID(...args):void {
    args.reduce((target, id) => (target.id = id));
  }

  setContent(target, text) {
    target.innerHTML = text;
  }

  addContent(target, text) {
    target.innerHTML += text;
  }

  setBackgroundImage(target, url) {
    target.style.cssText += `background-image: url(${url});`;
  }

  setBackgroundSize(target, size) {
    target.style.cssText += `background-size: ${size};`;
  }

  setBackgroundColor(target, color) {
    target.style.cssText += `background-color: ${color};`;
  }

  setFontSize(target, size) {
    target.style.cssText += `font-size: ${size ? `${size  }px` : null};`;
  }

  setHeight(target, height) {
    target.style.cssText += `height: ${height}px;`;
  }

  setWidth(target, width) {
    target.style.cssText += `width: ${width}px;`;
  }

  setRight(target, right) {
    target.style.cssText += `right: ${right}px;`;
  }

  setColor(target, color) {
    target.style.cssText += `color: ${color};`;
  }

  setSrc(target, src) {
    target.setAttribute(`src`, src);
  }

  setType(target, type) {
    target.setAttribute(`type`, type);
  }

  setRows(target, rows) {
    target.setAttribute(`rows`, rows);
  }

  setCols(target, cols) {
    target.setAttribute(`cols`, cols);
  }

  setValue(target, value) {
    target.value = value;
  }

  setName(target, name) {
    target.setAttribute(`name`, name);
  }

  setFor(target, forAttr) {
    target.setAttribute(`for`, forAttr);
  }

  setHref(target, href) {
    target.setAttribute(`href`, href);
  }

  setWrap(target, wrap) {
    target.setAttribute(`wrap`, wrap);
  }

  setDataset(target, name, data) {
    target.setAttribute(`data-${  name}`, data);
  }

  setChecked(target, checked) {
    target.checked = checked;
  }

  setSelected(target, selected) {
    target.selected = selected;
  }

  setClickEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.CLICK, () => {
        action();
      });
    });
  }

  setPasteEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.PASTE, (event) => {
        action(event);
      });
    });
  }

  setKeyupEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.KEYUP, (event) => {
        action(event);
      });
    });
  }

  setKeydownEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.KEYDOWN, (event) => {
        action(event);
      });
    });
  }

  setChangeEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.CHANGE, () => {
        action();
      });
    });
  }

  setScrollEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.SCROLL, () => {
        action();
      });
    });
  }

  setSubmitEvent(...args) {
    args.reduce((target, action) => {
      target.addEventListener(this.eventName.SUBMIT, (e) => {
        action(e);
      });
    });
  }

  isBottom(target, list) {
    return target.scrollTop + target.offsetHeight >= list.offsetHeight;
  }

  appendToBody(target) {
    document.documentElement.appendChild(target);
  }

  appendTopBodyTop(target) {
    const body = document.getElementsByTagName("body")[0];

    body.insertBefore(target, body.firstChild);
  }
  /**
   * Slide down animation
   * @param  {HTMLElement} element
   * @param  {integer} duration
   */
  slideDown = (target, duration = 500) => {
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;

    if (display === 'none')
      display = 'block';

    target.style.display = display;
    let height = target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.height = height + 'px';
    target.style.removeProperty('padding-top');
    target.style.removeProperty('padding-bottom');
    target.style.removeProperty('margin-top');
    target.style.removeProperty('margin-bottom');
    window.setTimeout( () => {
      target.style.removeProperty('height');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
  }
  /**
   * Slide up animation
   * @param  {HTMLElement} element
   * @param  {integer} duration
   */
  slideUp = (target, duration = 500) => {
    target.style.transitionProperty = 'height, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.height = target.offsetHeight + 'px';
    target.offsetHeight;
    target.style.overflow = 'hidden';
    target.style.height = 0;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout( () => {
      target.style.display = 'none';
      target.style.removeProperty('height');
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
      //alert("!");
    }, duration);
  }

  /**
   * Overwrite popup style with passed options
   * @param  {HTMLElement} element
   * @param  {Object} styleOptions
   */
  overwriteStyle(element: HTMLElement, styleOptions) {
    const styleKeys = Object.keys(styleOptions);

    if (styleKeys.length === 0) {
      return;
    }

    styleKeys.forEach((style) => {

      if (style == 'fontSize') {
        this.setFontSize(element, styleOptions[style])
      }

      else if(style == 'textColor' || style == 'buttonTextColor') {
        this.setColor(element, styleOptions[style]);
      }

      else if(style == 'backgroundColor' || style == 'buttonColor') {
        this.setBackgroundColor(element, styleOptions[style]);
      }
    })
  }
}
