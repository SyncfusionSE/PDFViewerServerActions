import { PdfViewer, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, AjaxHandler } from '@syncfusion/ej2-pdfviewer';
// tslint:disable-next-line:max-line-length
PdfViewer.Inject(Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner);
import { ContextMenu, MenuItemModel, ContextMenuModel, MenuEventArgs } from '@syncfusion/ej2-navigations';
/**
 * Default PdfViewer sample
 */

 let isReload:boolean = false;
 let pageNumber:number = 0;

let viewer: PdfViewer = new PdfViewer();
viewer.serviceUrl = 'https://localhost:7006/pdfviewer'; // .net 6.0
//viewer.serviceUrl = 'https://localhost:44356/pdfviewer'; //.net 5.0
//viewer.serviceUrl = 'https://localhost:44330/pdfviewer'; //.netcore 3.1
viewer.contextMenuOption = 'None';
viewer.documentLoad = () => {
  if (isReload) {
    //Navigate to the page where the server side action is performed
    viewer.navigation.goToPage(pageNumber + 1);
    isReload = false;
  }
};
viewer.appendTo('#pdfViewer');
viewer.load('PDF_Succinctly.pdf', null);

document.getElementById('rotate').addEventListener('click', () => {
    pdfServerAction('Rotate');
  });
  document.getElementById('delete').addEventListener('click', () => {
    pdfServerAction('Delete');
  });
  document.getElementById('add').addEventListener('click', () => {
    pdfServerAction('Add');
  });
  
  let menuItems: MenuItemModel[] = [
    { text: 'Rotate' },
    { text: 'Delete' },
    { text: 'Add' }
];
let menuOptions: ContextMenuModel = {
    target: '#pdfViewer',
    items: menuItems,
    select:(args:MenuEventArgs)=>{
        let action:string = args.item.text;
        pdfServerAction(action);
    }
};
let menuObj: ContextMenu = new ContextMenu(menuOptions, '#contextmenu');

function pdfServerAction(action: string) {
  //Get the JSON Data of the download request to use in server side while getting the current PDF in the server-side
    let jsonData = (viewer.viewerBase as any).constructJsonDownload();
    pageNumber = (viewer.viewerBase.activeElements as any).activePage;
    if (pageNumber===null){return;}
    let fileName = viewer.fileName;
    //Send a Ajax request with download JSON data and the action name to perform the action in the server
    let RequestHandler = new AjaxHandler(viewer);
    RequestHandler.url = viewer.serviceUrl + '/' + 'PDFAction';
    jsonData['pageNumber'] = pageNumber;
    jsonData['action'] = action;
    jsonData['documentPath'] = fileName;
    RequestHandler.send(jsonData);
    RequestHandler.onSuccess = function (result: any) {
      //Reload the Updated PDF in the PDFViewer
      viewer.serverActionSettings.load = 'ReLoad';
      isReload = true;
      viewer.load(viewer.fileName, null);
      viewer.serverActionSettings.load = 'Load';
    };
  }