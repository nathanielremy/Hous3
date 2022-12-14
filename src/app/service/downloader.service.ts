import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DownloaderService {
  constructor() {}

  downloadJsonObject(name: string, content: any) {
    const str = JSON.stringify(content);
    const bytes = new TextEncoder().encode(str);
    const blob = new Blob([bytes], {
      type: 'application/json;charset=utf-8',
    });
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = name;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }

  downloadUrlObject(name: string, url: string) {
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  }

  downloadNormalText(name: string, content: string) {
    const bytes = new TextEncoder().encode(content);
    const blob = new Blob([bytes], {
      type: 'application/text;charset=utf-8',
    });
    const a = document.createElement('a');
    const objectUrl = URL.createObjectURL(blob);
    a.href = objectUrl;
    a.download = name;
    a.click();
    URL.revokeObjectURL(objectUrl);
  }
}
