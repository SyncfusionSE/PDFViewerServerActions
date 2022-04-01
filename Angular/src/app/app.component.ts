import { Component, ViewChild } from '@angular/core';
import {
  PdfViewerComponent, LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService,
  ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService, ContextMenuAction, AjaxHandler
} from '@syncfusion/ej2-angular-pdfviewer';
import { MenuEventArgs, MenuItemModel } from '@syncfusion/ej2-navigations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // tslint:disable-next-line:max-line-length
  providers: [LinkAnnotationService, BookmarkViewService, MagnificationService, ThumbnailViewService, ToolbarService, NavigationService, TextSearchService, TextSelectionService, PrintService, AnnotationService, FormFieldsService]
})
export class AppComponent {
  @ViewChild('pdfviewer')
  public viewer!: PdfViewerComponent;
  
  public service: string = 'https://localhost:7006/pdfviewer'; // .net 6.0
  //public service: string = 'https://localhost:44356/pdfviewer'; //.net 5.0
  //public service: string = 'https://localhost:44330/pdfviewer'; //.netcore 3.1

  public document: string = 'PDF_Succinctly.pdf';
  public menuItems: MenuItemModel[] =  [
    { text: 'Rotate' },
    { text: 'Delete' },
    { text: 'Add' }
  ];
  public contextMenuAction : ContextMenuAction ="None";
  private isReload:boolean = false;
  private pageNumber:number = 0;
  ngOnInit(): void {
      // ngOnInit function
  }

  public documentload():void {
    if (this.isReload) {
      //Navigate to the page where the server side action is performed
      this.viewer.navigation.goToPage(this.pageNumber + 1);
      this.isReload = false;
    }
  };

  public menuSelect(args:MenuEventArgs):void {
    let action:string = args.item.text as string;
    this.pdfServerAction(action);
  }

  public pdfServerAction(action: string):void {
    //Get the JSON Data of the download request to use in server side while getting the current PDF in the server-side
    let jsonData = (this.viewer.viewerBase as any).constructJsonDownload();
    this.pageNumber = (this.viewer.viewerBase.activeElements as any).activePage;
    if (this.pageNumber===null){return;}
    let fileName = this.viewer.fileName;
    //Send a Ajax request with download JSON data and the action name to perform the action in the server
    let RequestHandler = new AjaxHandler(this.viewer);
    RequestHandler.url = this.viewer.serviceUrl + '/' + 'PDFAction';
    jsonData['pageNumber'] = this.pageNumber;
    jsonData['action'] = action;
    jsonData['documentPath'] = fileName;
    RequestHandler.send(jsonData);
    RequestHandler.onSuccess =  (result: any) =>{
      //Reload the Updated PDF in the PDFViewer
      this.viewer.serverActionSettings.load = 'ReLoad';
      this.isReload = true;
      (this.viewer as any).load(this.viewer.fileName, null);
      this.viewer.serverActionSettings.load = 'Load';
    };
  }
}
