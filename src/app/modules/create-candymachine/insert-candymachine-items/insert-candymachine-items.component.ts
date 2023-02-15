import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  CandyMachine,
  CandyMachineHiddenSettings,
  CandyMachineV2Item,
  UploadMetadataInput,
  UploadMetadataOutput,
} from '@metaplex-foundation/js';
import { Adapter } from '@solana/wallet-adapter-base';
import { PublicKey } from '@solana/web3.js';
import {
  FILE_TYPE_GIF,
  FILE_TYPE_JPEG,
  FILE_TYPE_JPG,
  FILE_TYPE_JSON,
  FILE_TYPE_PNG,
} from 'src/app/common/constants';
import { checkJSONObjectIsValidMetadata } from 'src/app/common/utils/utils';
import { WalletService } from 'src/app/service/wallet.service';
import { MetaplexService } from 'src/app/service/metaplex.service';
import { SnackService } from 'src/app/service/snack.service';

@Component({
  selector: 'app-insert-candymachine-items',
  templateUrl: './insert-candymachine-items.component.html',
  styleUrls: ['./insert-candymachine-items.component.css'],
})
export class InsertCandymachineItemsComponent implements OnInit {
  @Input() candyMachine: CandyMachine | null = null;
  @Output() candyMachineEmitter = new EventEmitter<CandyMachine>();

  walletAdapter: Adapter | null = null;
  rpcEndpoint: string | null = null;

  isInsertingAssets: boolean = false;
  uploadingProgress: number = 0;
  isImagesDragged: boolean = false;
  isJsonsDragged: boolean = false;
  imageFiles: Array<File> = [];
  imagePreviews: Array<string> = [];
  jsonFiles: Array<File> = [];
  jsonPreviews: Array<UploadMetadataInput> = [];
  assets: Map<UploadMetadataInput, File> = new Map();
  uploadedItems: Array<CandyMachineV2Item> = [];
  uploadedMetadata: UploadMetadataOutput | null = null;

  constructor(
    private walletService: WalletService,
    private snackService: SnackService,
    private mxService: MetaplexService
  ) {}

  ngOnInit(): void {
    this.walletService.walletStore$.wallet$.subscribe((wallet) => {
      this.walletAdapter = wallet?.adapter;
    });
    this.walletService.connectionStore$.state$.subscribe((state) => {
      this.rpcEndpoint = state.endpoint;
    });
  }

  /*************************************************************************************/
  /******************************** Event handlers *************************************/
  /*************************************************************************************/
  onImageFilesSelected(e: any) {
    if (this.isInsertingAssets) return;

    const element = e.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.prepareImageFiles(fileList);
    }
  }

  onJsonFilesSelected(e: any) {
    if (this.isInsertingAssets) return;

    const element = e.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.prepareJsonFiles(fileList);
    }
  }

  onImageFilesDropped(droppedFiles: FileList) {
    if (this.isInsertingAssets) return;

    this.prepareImageFiles(droppedFiles);
  }

  onJsonFilesDropped(droppedFiles: FileList) {
    if (this.isInsertingAssets) return;

    this.prepareJsonFiles(droppedFiles);
  }

  toogleImagesDragged(event: boolean) {
    if (this.isInsertingAssets) return;

    this.isImagesDragged = event;
  }

  toogleJsonsDragged(event: boolean) {
    if (this.isInsertingAssets) return;

    this.isJsonsDragged = event;
  }

  openFileSelector(fileSelector: HTMLInputElement) {
    if (this.isInsertingAssets) return;

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
            if (!isJsonInvalidMetadata) {
              this.jsonFiles.push(file);
              this.jsonPreviews.push(jsonObject);
            }
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

  validateUserConnection(): boolean {
    // Validate wallet is connected
    if (this.walletAdapter?.connected && this.walletAdapter?.publicKey) {
      if (this.rpcEndpoint) {
        // Validate rpcEndpoint and wallet matches metaplex instance
        return this.mxService.validateInstance(
          this.rpcEndpoint,
          this.walletAdapter
        );
      } else {
        this.snackService.showError('Rpc error, please reload and try again');
        return false;
      }
    } else {
      this.snackService.showError('Wallet not connected');
      return false;
    }
  }

  async getCandyMachine(candyMachineAddress: PublicKey) {
    try {
      const candyMachine = await this.mxService.getCandyMachine(
        candyMachineAddress
      );
      return candyMachine;
    } catch (err) {
      console.log(`Error fetching cm ${err}`);
    }
    return null;
  }

  prepareAssets() {
    this.assets.clear();

    if (this.jsonPreviews.length != this.imageFiles.length) {
      this.snackService.showError('Image and JSON files are not match.');
      return false;
    }
    for (let metadata of this.jsonPreviews) {
      const fileName = metadata.image;
      const imageFile = this.imageFiles.find((file) => {
        return file.name == fileName;
      });
      if (imageFile) {
        this.assets.set(metadata, imageFile);
      } else {
        this.assets.clear();
        this.snackService.showError('Not able to find image file.');
        return false;
      }
    }
    return true;
  }

  async addAssets() {
    if (this.isInsertingAssets) return;
    if (!this.candyMachine) return;
    if (!this.prepareAssets()) return;
    if (!this.validateUserConnection()) return;

    this.isInsertingAssets = true;
    this.uploadingProgress = 0;

    if (this.isMultipleFiles) {
      if (
        this.assets.size >
        this.candyMachine.itemsAvailable.toNumber() -
          this.candyMachine.itemsLoaded
      ) {
        this.snackService.showError(
          `You can not add more than ${
            this.candyMachine.itemsAvailable.toNumber() -
            this.candyMachine.itemsLoaded
          } items.`
        );
        this.isInsertingAssets = false;
        return;
      }

      // Insert CandyMachine's items
      if (this.uploadedItems.length == 0) {
        let index = 1;
        const assetsArray = Array.from(this.assets, (item) => {
          return { metadata: item[0], imageFile: item[1] };
        });
        while (assetsArray.length > 0) {
          // Attempt to upload assets continuously
          const asset = assetsArray.shift();
          if (asset) {
            try {
              const { metadata, imageFile } = asset;
              const uploadedMetadata = await this.mxService.uploadNftMetadata(
                metadata,
                imageFile
              );
              if (uploadedMetadata) {
                this.uploadedItems.push({
                  name: uploadedMetadata.metadata.name!,
                  uri: uploadedMetadata.uri,
                });

                this.uploadingProgress = 60 * (index / this.assets.size);
                index++;
              } else {
                assetsArray.unshift(asset);
                continue;
              }
            } catch (e) {
              console.log(e);
              assetsArray.unshift(asset);
              continue;
            }
          }
        }

        if (this.uploadedItems.length != this.assets.size) {
          // Never land here
          this.snackService.showError(
            'Failed to upload NFT metadata. Please try again.'
          );
          this.uploadedItems = [];
          this.isInsertingAssets = false;
          return;
        }
      } else {
        // Already uploaded assets
        this.uploadingProgress = 60;
      }

      try {
        await this.mxService.insertCandyMachineItems(
          this.candyMachine,
          this.uploadedItems
        );
        this.uploadedItems = [];
        this.uploadingProgress = 90;
      } catch (e) {
        console.log(e);
        this.snackService.showError(
          'Failed to insert items to Candy Machine. Please try again.'
        );
        this.isInsertingAssets = false;
        return;
      }
    } else {
      // Update CandyMachine's mint setting
      while (!this.uploadedMetadata) {
        // Attempt to upload asset continuously
        const [{ metadata, imageFile }] = Array.from(this.assets, (item) => {
          return { metadata: item[0], imageFile: item[1] };
        });

        this.uploadedMetadata = await this.mxService.uploadNftMetadata(
          metadata,
          imageFile
        );
      }

      this.uploadingProgress = 60;

      const itemSettings = {
        type: 'hidden',
        name: this.uploadedMetadata.metadata.name!,
        uri: this.uploadedMetadata.uri,
        hash: [
          1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
          1, 1, 1, 1, 1, 1, 1, 1, 1,
        ],
      } as CandyMachineHiddenSettings;

      const result = await this.mxService.updateCandyMachine(
        this.candyMachine,
        { itemSettings }
      );
      if (result) {
        this.uploadedMetadata = null;
        this.uploadingProgress = 90;
      } else {
        this.snackService.showError(
          'Failed to update Candy Machine settings. Please try again.'
        );
        this.isInsertingAssets = false;
        return;
      }
    }

    // Refresh CandyMachine account
    this.candyMachine = await this.getCandyMachine(this.candyMachine.address);
    this.uploadingProgress = 100;
    this.isInsertingAssets = false;

    if (!this.candyMachine) {
      this.snackService.showError(
        'Failed to fetch updated CandyMachine. Please try again.'
      );
      return;
    }

    this.candyMachineEmitter.emit(this.candyMachine);

    this.snackService.showSuccess(
      `You successfully added ${this.assets.size} items to your Candy Machine.`
    );

    // Clear cache
    this.imageFiles = [];
    this.imagePreviews = [];
    this.jsonFiles = [];
    this.jsonPreviews = [];
    this.assets = new Map();
    this.uploadedItems = [];
    this.uploadedMetadata = null;
  }

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
