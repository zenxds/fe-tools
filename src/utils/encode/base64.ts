import * as utf8 from './utf8'

export const encode = (str: string) => btoa(utf8.encode(str))
export const decode = (str: string) => utf8.decode(atob(str))
