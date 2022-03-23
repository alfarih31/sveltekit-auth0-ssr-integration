export enum AUTH_METHOD {
  BLANK = 'BLANK',
  BASIC = 'BASIC',
  BEARER = 'BEARER',
}

export default class AuthStorage {
  private tokens: { [key: string]: { token: string; method?: AUTH_METHOD } } = {};

  saveToken(name: string, token: string, method?: AUTH_METHOD) {
    if (this.tokens[name]) {
      return;
    }

    this.tokens[name] = {
      token,
      method,
    };
  }

  getHTTPAuthorization(name: string): string | undefined {
    const a = this.tokens[name];
    if (!a) {
      return;
    }

    if (!a.method) {
      return a.token;
    }

    switch (a.method.toUpperCase()) {
      case AUTH_METHOD.BLANK:
        return a.token;
      case AUTH_METHOD.BEARER:
        return `Bearer ${a.token}`;
      case AUTH_METHOD.BASIC:
        return `Basic ${a.token}`;
      default:
    }
  }
}
