import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { PdfViewerModule } from '@syncfusion/ej2-angular-pdfviewer';
// Imported Syncfusion contextmenu module from navigations package
import { ContextMenuModule } from '@syncfusion/ej2-angular-navigations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, PdfViewerModule, ContextMenuModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
