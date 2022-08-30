/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import { DEBUG_MODE } from '../constants/globals';

const logPrefix = '[TextRight]';

export function log(message, type = 'log') {
  if (!DEBUG_MODE) {
    return;
  }

  switch (type) {
    case 'info':
      console.info(`${logPrefix} ${message}`);
      break;

    default:
      console.log(`${logPrefix} ${message}`);
      break;
  }

}
