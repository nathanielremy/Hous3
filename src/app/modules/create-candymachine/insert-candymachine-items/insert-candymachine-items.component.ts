import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CandyMachine, UploadMetadataInput } from '@metaplex-foundation/js';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  FILE_TYPE_GIF,
  FILE_TYPE_JPEG,
  FILE_TYPE_JPG,
  FILE_TYPE_JSON,
  FILE_TYPE_PNG,
} from 'src/app/common/constants';
import { checkJSONObjectIsValidMetadata } from 'src/app/common/utils/utils';
import { SnackService } from 'src/app/service/snack.service';

@Component({
  selector: 'app-insert-candymachine-items',
  templateUrl: './insert-candymachine-items.component.html',
  styleUrls: ['./insert-candymachine-items.component.css'],
})
export class InsertCandymachineItemsComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;
  @Output() candyMachineEmitter = new EventEmitter<CandyMachine>();

  isUploadingAssets: boolean = false;
  isImagesDragged: boolean = false;
  isJsonsDragged: boolean = false;
  imageFiles: Array<File> = [];
  imagePreviews: Array<string> = [];
  jsonFiles: Array<File> = [];
  jsonPreviews: Array<UploadMetadataInput> = [];

  constructor(private snackService: SnackService) {}

  ngOnInit(): void {}

  /*************************************************************************************/
  /******************************** Event handlers *************************************/
  /*************************************************************************************/
  onImageFilesSelected(e: any) {
    const element = e.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.prepareImageFiles(fileList);
    }
  }

  onJsonFilesSelected(e: any) {
    const element = e.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.prepareJsonFiles(fileList);
    }
  }

  onImageFilesDropped(droppedFiles: FileList) {
    this.prepareImageFiles(droppedFiles);
  }

  onJsonFilesDropped(droppedFiles: FileList) {
    this.prepareJsonFiles(droppedFiles);
  }

  toogleImagesDragged(event: boolean) {
    this.isImagesDragged = event;
  }

  toogleJsonsDragged(event: boolean) {
    this.isJsonsDragged = event;
  }

  openFileSelector(fileSelector: HTMLInputElement) {
    if (this.isUploadingAssets) return;
    fileSelector.value = fileSelector.defaultValue;
    fileSelector.click();
  }

  /*************************************************************************************/
  /****************************** Utility functions ************************************/
  /*************************************************************************************/
  checkImageFilesValidation(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (
          !(
            file.type === FILE_TYPE_PNG ||
            file.type === FILE_TYPE_JPG ||
            file.type === FILE_TYPE_JPEG ||
            file.type === FILE_TYPE_GIF
          )
        ) {
          this.snackService.showError(
            'Only .gif, .png & .jpg files are accepted'
          );
          return false;
        }

        if (file.size > 10000000) {
          this.snackService.showError('Your file is too large. Max 10mb');
          return false;
        }
      }
    }
    return true;
  }

  checkJsonFilesValidation(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);
      if (file) {
        if (file.type !== FILE_TYPE_JSON) {
          this.snackService.showError('Only .json files are accepted');
          return false;
        }

        if (file.size > 1000000) {
          this.snackService.showError('Your file is too large. Max 1mb');
          return false;
        }
      }
    }
    return true;
  }

  prepareImageFiles(fileList: FileList) {
    if (!this.checkImageFilesValidation(fileList)) return;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const preview = reader.result as string;
          if (this.imagePreviews.includes(preview)) {
            this.snackService.showWarning('Image file is duplicated.');
          } else {
            this.imageFiles.push(file);
            this.imagePreviews.push(preview);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  }

  prepareJsonFiles(fileList: FileList) {
    if (!this.checkJsonFilesValidation(fileList)) return;

    let isJsonInvalidMetadata = false;
    for (let i = 0; i < fileList.length; i++) {
      if (isJsonInvalidMetadata) {
        this.jsonFiles = [];
        this.jsonPreviews = [];
        this.snackService.showError('Invalid metadata format in .json file.');
        return;
      }
      const file = fileList.item(i);
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const jsonBody = reader.result as string;
          const jsonObject = checkJSONObjectIsValidMetadata(
            JSON.parse(jsonBody)
          );
          if (jsonObject) {
            this.jsonFiles.push(file);
            this.jsonPreviews.push(jsonObject);
          } else {
            isJsonInvalidMetadata = true;
            this.jsonFiles = [];
            this.jsonPreviews = [];
            this.snackService.showError(
              'Invalid metadata format in .json file.'
            );
          }
        };
        reader.readAsText(file);
      }
    }
  }

  async addAssers() {}

  /*************************************************************************************/
  /************************************ Getters ****************************************/
  /*************************************************************************************/
  get isMultipleFiles() {
    return this.candyMachine?.itemSettings.type == 'configLines';
  }

  get imageFilesCount() {
    return this.imageFiles.length;
  }

  get jsonFilesCount() {
    return this.jsonFiles.length;
  }
}
