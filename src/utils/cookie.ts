export const retrieveCookie = (name: string): string | null => {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : null;
};

export function storeCookie(
  cookieName: string,
  cookieValue: string,
  cookieOptions: { [key: string]: string | number | Date | boolean } = {}
) {
  cookieOptions = {
    path: '/',
    ...cookieOptions
  };

  let expirationDate = cookieOptions.expires;
  if (expirationDate && typeof expirationDate === 'number') {
    const currentDate = new Date();
    currentDate.setTime(currentDate.getTime() + expirationDate * 1000);
    expirationDate = cookieOptions.expires = currentDate;
  }

  if (expirationDate && expirationDate instanceof Date) {
    cookieOptions.expires = expirationDate.toUTCString();
  }
  cookieValue = encodeURIComponent(cookieValue);
  let cookieString = cookieName + '=' + cookieValue;
  for (const optionName in cookieOptions) {
    cookieString += '; ' + optionName;
    const optionValue = cookieOptions[optionName];
    if (optionValue !== true) {
      cookieString += '=' + optionValue;
    }
  }
  document.cookie = cookieString;
}

export function removeCookie(cookieName: string) {
  storeCookie(cookieName, '', { expires: -1 });
}
