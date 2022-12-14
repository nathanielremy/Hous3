import { PublicKey } from '@solana/web3.js';

export const getErrorMessageForCode = (code: String) => {
  if (code === 'auth/invalid-email' || code === 'auth/missing-email') {
    return 'Please enter a valid email address';
  } else if (code === 'auth/internal-error') {
    return 'Incorrect credentials, please try again';
  } else if (code === 'auth/wrong-password') {
    return 'Incorrect password, please try again';
  } else if (code === 'auth/user-not-found') {
    return 'No account linked to this email';
  } else if (code === 'auth/email-already-in-use') {
    return 'There is already an account linked to this email';
  } else if (code === 'auth/weak-password') {
    return 'Password must be at least 6 characters';
  } else if (code === 'auth/admin-restricted-operation') {
    return 'Please enter your credentials';
  }
  return code;
};

export const randomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const compareArrays = (array1: Array<number>, array2: Array<number>) => {
  if (array1.length != array2.length) return false;

  for (var i = 0, l = array1.length; i < l; i++) {
    if (array1[i] != array2[i]) return false;
  }
  return true;
};

export const compareObjects = (array1: any, array2: any) => {
  return JSON.stringify(array1) == JSON.stringify(array2);
};

export const isEmptyObject = (obj: any) => {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
};

export const isValidSolanaAddress = (address: string): boolean => {
  try {
    let pubkey = new PublicKey(address);
    let isSolana = PublicKey.isOnCurve(pubkey.toBuffer());

    return isSolana;
  } catch (_) {
    return false;
  }
};

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
};

export const isDateBeforeOther = (a: string | null, b: string | null) => {
  if (!a || !b) return true;
  const dateA = new Date(a);
  const dateB = new Date(b);
  return dateA.getTime() <= dateB.getTime();
};

export const getFileNameFormatDateStringFromDate = (date: Date) => {
  return `${[
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('')}_${[
    padTo2Digits(date.getHours()),
    padTo2Digits(date.getMinutes()),
    padTo2Digits(date.getSeconds()),
  ].join('')}`;
};


export const timeAgoDisplay = (_date: Date): string => {
  let creationDateStamp = Math.round(_date.getTime());
  let currentDateStamp = Math.floor(Date.now() / 1000);

  let secondsAgo = currentDateStamp - creationDateStamp;

  let minute = 60;
  let hour = 60 * minute;
  let day = 24 * hour;
  let week = 7 * day;
  let month = 4 * week;

  let quotient: number;
  let unit: string;

  if (secondsAgo < minute) {
    quotient = secondsAgo;
    unit = 'second';
  } else if (secondsAgo < hour) {
    quotient = secondsAgo / minute;
    unit = 'min';
  } else if (secondsAgo < day) {
    quotient = secondsAgo / hour;
    unit = 'hour';
  } else if (secondsAgo < week) {
    quotient = secondsAgo / day;
    unit = 'day';
  } else if (secondsAgo < month) {
    quotient = secondsAgo / week;
    unit = 'week';
  } else {
    quotient = secondsAgo / month;
    unit = 'month';
  }

  return `${Math.round(quotient)} ${unit}${
    Math.round(quotient) == 1 ? '' : 's'
  } ago`;
};

export const chunkArray = (array: Array<any>, chunkSize: number) => {
  return Array.from(
    { length: Math.ceil(array.length / chunkSize) },
    (_, index) => array.slice(index * chunkSize, (index + 1) * chunkSize)
  );
};

export const getFileNameFromUrl = (url: string) => {
  return url.replace(/^.*[\\\/]/, '');
};

export const truncateAddress = (address: string | null | undefined) => {
  if (!address) return 'No Account';
  const match = address.match(/^([a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
