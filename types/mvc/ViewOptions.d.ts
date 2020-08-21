import { Collection, Column } from './';

export interface ViewOptions <T> {
  format?: (object: any) => {};
  className?: string;
  collection?: Collection<T>;
  columns?: Column[];
  clickToSelect?: boolean;
  factory?: any;
  closable?: boolean;
  destroyOnHide?: boolean;
  silent?: boolean;
  title?: string;
  includeBlankOption?: boolean;
  blankOptions?: {
    value: string;
    text: string;
  },
  sorts?: object[];
  formatDownload?: (collection: Collection<T>) => {};
  defaultSort?: any;
}
