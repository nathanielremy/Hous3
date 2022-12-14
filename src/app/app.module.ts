import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RECAPTCHA_SETTINGS,
  RecaptchaModule,
  RecaptchaSettings,
} from 'ng-recaptcha';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { SnackBarComponent } from './common/snack-bar/snack-bar.component';
import { DropzoneDirective } from './dropzone.directive';
import { HdWalletAdapterModule } from '@heavy-duty/wallet-adapter';
import { WalletSelectorComponent } from './common/wallet-selector/wallet-selector.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { ProgressBarComponent } from './common/progress-bar/progress-bar.component';
import { HeaderComponent } from './common/header/header.component';
import { ToolsComponent } from './modules/tools/tools.component';
import { CreateTokenComponent } from './modules/create-token/create-token.component';

@NgModule({
  declarations: [
    DropzoneDirective,
    AppComponent,
    HomeComponent,
    SnackBarComponent,
    WalletSelectorComponent,
    ProgressBarComponent,
    HeaderComponent,
    ToolsComponent,
    CreateTokenComponent,
  ],
  imports: [
    RouterModule,
    FlexLayoutModule,
    MaterialModule,
    BrowserModule,
    AppRoutingModule,
    HdWalletAdapterModule.forRoot({ autoConnect: false }),
    FormsModule,
    ReactiveFormsModule,
    RecaptchaModule,
    BrowserAnimationsModule,
    ImageCropperModule,
    NgxCsvParserModule,
  ],
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptchaToken,
      } as RecaptchaSettings,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
function Injectable() {
  throw new Error('Function not implemented.');
}
