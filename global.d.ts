import { Url } from 'whatwg-url';

declare global {
  namespace NodeJS {
    interface Global {
      URL: any
      Buffer: any
    }
  }
}

export default global;