export enum EnumImageType {
  SAME = 'same',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
}

export interface ImageInfo {
  url: string;
  name: string;
  size: number;
  format: EnumImageType;
  blob: Blob;
  dimensions: {
    width: number;
    height: number;
  }
}