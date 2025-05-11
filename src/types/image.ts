export enum EnumImageType {
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
}

export interface ImageInfo {
  url: string;
  name: string;
  size: number;
  type: EnumImageType;
  blob: Blob;
  dimensions: {
    width: number;
    height: number;
  }
}