import { Injectable } from '@angular/core';
import { createCanvas, loadImage } from 'canvas'

@Injectable({
  providedIn: 'root'
})
export class PreviewService {
  constructor() { }

  async saveProjectPreviewImage(_data: string[], width: number = 500, height: number = 500) {
    // Initiate the canvas now that we have calculated everything
    const previewCanvas = createCanvas(width, height);
    const previewCtx = previewCanvas.getContext("2d");

    // Iterate all NFTs and insert thumbnail into preview image
    // Don't want to rely on "edition" for assuming index
    for (let index = 0; index < _data.length; index++) {
      const url = _data[index];
      await loadImage(url).then((image) => {
        previewCtx.drawImage(
          image,
          0,
          0,
          width,
          height
        );
      });
    }
    return previewCanvas.toDataURL()
  };

  async getImageFileSizeFromData(_data: string[], width: number = 500, height: number = 500) {
    const dataURL = await this.saveProjectPreviewImage(_data, width, height);

    const binary = atob(dataURL.split(',')[1]);

    // Create 8-bit unsigned array
    var array = [];
    for(var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }

    let largestBlob = new Blob([new Uint8Array(array)], {type: 'image/png'});
    console.log(`Maximun possible file size = ${largestBlob.size}`);

    return largestBlob.size;
  }
}
