import { FileInputViewOptions, ViewOptions } from './';

/**
 * Private inner class. This is a view for rendering individual files in
 * a list-type format. It is provided to the CollectionView as the factory.
 *
 */
export class FileView <T> {

  constructor(params: ViewOptions<T>);

}

/**
 * Class: FileInputView
 *
 * @param params
 *      Configuration options. See _DEFAULTS for more details.
 */
export class FileInputView {

  constructor(params: FileInputViewOptions);

  destroy(): void;

  hide(): void;

  show(clean: boolean): void;

}
