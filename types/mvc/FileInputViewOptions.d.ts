
export interface FileInputViewOptions {
  browseText: string;
  cancelCallback: () => {};
  cancelText: string;
  cancelTooltip: string;
  dropzoneText: string;
  intro: {
    text: string
    classes: string
  };
  title: string;
  uploadCallback: () => {};
  uploadText: string;
  uploadTooltip: string;
}
