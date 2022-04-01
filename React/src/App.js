import './App.css';
import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner, Inject, AjaxHandler } from '@syncfusion/ej2-react-pdfviewer';
import { ContextMenuComponent } from '@syncfusion/ej2-react-navigations';
import { useRef } from 'react';
function App() {
  const viewer = useRef(null);
  const menuItems = [
      { text: 'Rotate' },
      { text: 'Delete' },
      { text: 'Add' }
  ];
  const serviceUrl = 'https://localhost:7006/pdfviewer'; // .net 6.0
  //const serviceUrl = 'https://localhost:44356/pdfviewer'; //.net 5.0
  //const serviceUrl = 'https://localhost:44330/pdfviewer'; //.netcore 3.1
  const documentName = 'PDF_Succinctly.pdf';
  let isReload = false;
  let pageNumber = 0;
  function documentload() {
      if (isReload) {
        //Navigate to the page where the server side action is performed
        viewer.current.navigation.goToPage(pageNumber + 1);
        isReload = false;
      }
    };
  
    function menuSelect(args) {
      let action = args.item.text;
      pdfServerAction(action);
    }
  
    function pdfServerAction(action) {
      //Get the JSON Data of the download request to use in server side while getting the current PDF in the server-side
      let jsonData = (viewer.current.viewerBase ).constructJsonDownload();
      pageNumber = (viewer.current.viewerBase.activeElements ).activePage;
      if (pageNumber===null){return;}
      let fileName = viewer.current.fileName;
      //Send a Ajax request with download JSON data and the action name to perform the action in the server
      let RequestHandler = new AjaxHandler(viewer.current);
      RequestHandler.url = viewer.current.serviceUrl + '/' + 'PDFAction';
      jsonData['pageNumber'] = pageNumber;
      jsonData['action'] = action;
      jsonData['documentPath'] = fileName;
      RequestHandler.send(jsonData);
      RequestHandler.onSuccess =  (result) =>{
        //Reload the Updated PDF in the PDFViewer
        viewer.current.serverActionSettings.load = 'ReLoad';
        isReload = true;
        viewer.current.load(viewer.current.fileName, null)
        viewer.current.serverActionSettings.load = 'Load';
      };
    }
      return (<div>
      <div className='control-section'>
        <div style={{'height':"25px"}}>
      <button id="rotate" onClick={()=>pdfServerAction("Rotate")}>RotatePage</button>
      <button id="delete" onClick={()=>pdfServerAction("Delete")}>DeletePage</button>
      <button id="add" onClick={()=>pdfServerAction("Add")}>AddPage</button>
      </div>
        <div style={{'height':"calc(100vh - 25px)"}}>
      <ContextMenuComponent target="#pdfviewer" items={menuItems} select={menuSelect}/>
          <PdfViewerComponent ref={viewer} documentLoad={documentload} id="pdfviewer" contextMenuOption="None" documentPath={documentName} serviceUrl={serviceUrl} style={{ 'height': '100%' }}>
              <Inject services={[Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormFields, FormDesigner]}/>
          </PdfViewerComponent>
          </div>
        </div>

      </div>);
}

export default App;
