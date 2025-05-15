export enum EnumImageType {
  SAME = 'same',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
}

export enum EnumImageFormat {
  SVG = 'image/svg+xml',
  PNG = 'image/png',
  JPEG = 'image/jpeg',
  WEBP = 'image/webp',
}

export interface ImageInfo {
  url: string;
  name: string;
  size: number;
  format: EnumImageFormat;
  blob: Blob;
  dimensions: {
    width: number;
    height: number;
  }
}