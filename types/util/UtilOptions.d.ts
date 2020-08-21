
export interface UtilOptions {
  maxFileSize?: number;
  file?: File;
  success?: () => {};
  error?: () => {};
  reader?: FileReader;
  method?: string;
  url?: string;
  done?: () => {};
  headers?: object;
  data?: object;
  rawData?: any;
  timeout?: number;
  ontimeout?: () => {};
  callbackName?: string;
  callbackParameter?: string;
}
