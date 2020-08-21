import { ViewOptions } from './';

export class CollectionView <T> {

  constructor(options: ViewOptions<T>);

  destroy(): void;

  getView(model: any): any;

  render(): void;

}
