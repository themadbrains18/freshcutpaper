/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
import CLASS_NAMES from '../constants/classes';

const ANIMATION_EVENT = 'animationend';
const ANIMATION_REGEX = 'sb-fade.*';
const DISPLAY_NONE = 'none';
const DISPLAY_BLOCK = 'block';

const hasClassRegex = (target, classNameRegex) => new RegExp(`(^| )${classNameRegex}( |$)`, 'gi').test(target.className);

export function hide(target) {
  if (target) {
    if (hasClassRegex(target, ANIMATION_REGEX)) {
      let hideAnimationEvent;
      target.addEventListener(
        ANIMATION_EVENT,
        (hideAnimationEvent = function () {
          target.style.cssText += `display: ${DISPLAY_NONE};`;
          target.removeEventListener(ANIMATION_EVENT, hideAnimationEvent, false);
        }),
      );
    } else {
      target.style.cssText += `display: ${DISPLAY_NONE};`;
    }
  }
}

export function show(target, displayType) {
  if (target) {
    target.style.cssText += `display: ${displayType || DISPLAY_BLOCK}`;
  }
}

export function hasClass(...args) {
  return args.reduce((target, className) => {
    if (target.classList) {
      return target.classList.contains(className);
    }
    return new RegExp(`(^| )${className}( |$)`, 'gi').test(target.className);
  });
}

export function addClass(...args) {
  return args.reduce((target, className) => {
    if (target.classList) {
      if (!(className in target.classList)) {
        target.classList.add(className);
      }
    } else if (target.className.indexOf(className) < 0) {
      target.className += ` ${className}`;
    }
    return target;
  });
}

export function removeClass(...args) {
  return args.reduce((target, className) => {
    if (target.classList) {
      target.classList.remove(className);
    } else {
      target.className = target.className.replace(
        new RegExp(`(^|\\b)${className.split(' ').join('|')}(\\b|$)`, 'gi'),
        '',
      );
    }
    return target;
  });
}

export function switchPlacement(placement) {
  switch (placement) {
    case 'top-left':
      return CLASS_NAMES.POSITION_TOP_LEFT;
    case 'top-center':
      return CLASS_NAMES.POSITION_TOP_CENTER;
    case 'top-right':
      return CLASS_NAMES.POSITION_TOP_RIGHT;
    case 'bottom-left':
      return CLASS_NAMES.POSITION_BOTTOM_LEFT;
    case 'bottom-center':
      return CLASS_NAMES.POSITION_BOTTOM_CENTER;
    case 'bottom-right':
      return CLASS_NAMES.POSITION_BOTTOM_RIGHT;
    default:
      return CLASS_NAMES.POSITION_BOTTOM_CENTER;
  }
}
