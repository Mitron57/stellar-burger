export function retrieveCookie(cookieName: string): string | undefined {
  const cookieMatches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        cookieName.replace(/([.$?*|{}$$$$[\]\\/+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return cookieMatches ? decodeURIComponent(cookieMatches[1]) : undefined;
}

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
