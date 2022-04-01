<template>
<div class='control-section'>
    <div style='height:"25px"'>
      <button id="rotate" @click="pdfServerAction('Rotate')"  >RotatePage</button>
      <button id="delete" @click="pdfServerAction('Delete')" >DeletePage</button>
      <button id="add" @click="pdfServerAction('Add')" >AddPage</button>
    </div>
    <div style='height:"calc(100vh - 25px)"'>
      <ejs-contextmenu target='#pdfViewer' :items='menuItems'  :select="menuSelect"></ejs-contextmenu>
      <ejs-pdfviewer id="pdfViewer" ref="viewer" :serviceUrl="serviceUrl" :documentPath="documentPath" :documentLoad="documentload"> </ejs-pdfviewer>
    </div>
  </div>
</template>

<script>
import { PdfViewerComponent, AjaxHandler, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormDesigner, FormFields } from '@syncfusion/ej2-vue-pdfviewer';

import { ContextMenuComponent } from "@syncfusion/ej2-vue-navigations";

export default {
  name: 'App',
  components: {
    "ejs-pdfviewer": PdfViewerComponent,
    "ejs-contextmenu": ContextMenuComponent
  },
  data () {
    return {
      serviceUrl: 'https://localhost:7006/pdfviewer', // .net 6.0
      //serviceUrl: 'https://localhost:44356/pdfviewer', //.net 5.0
      //serviceUrl: 'https://localhost:44330/pdfviewer', //.netcore 3.1
      documentPath:"PDF_Succinctly.pdf",
      isReload : false,
      pageNumber : 0,
      menuItems: [
          { text: 'Rotate' }, 
          { text: 'Delete' }, 
          { text: 'Add' }
        ]
    };
  },
  methods: {
    documentload: function () {
      if (this.isReload) {
        this.$refs.viewer.ej2Instances.navigation.goToPage(this.pageNumber + 1);
        this.isReload = false;
      }
    },

    menuSelect: function (args) {
      let action = args.item.text;
      this.pdfServerAction(action);
    },

    pdfServerAction: function (action) {
      let pdfViewerInstance = this.$refs.viewer.ej2Instances;
      let jsonData = pdfViewerInstance.viewerBase.constructJsonDownload();
      this.pageNumber = pdfViewerInstance.viewerBase.activeElements.activePage;	  
      if (this.pageNumber===null){return;}
      let fileName = pdfViewerInstance.fileName;
      let RequestHandler = new AjaxHandler(pdfViewerInstance);
      RequestHandler.url = pdfViewerInstance.serviceUrl + '/' + 'PDFAction';
      jsonData['pageNumber'] = this.pageNumber;
      jsonData['action'] = action;
      jsonData['documentPath'] = fileName;
      RequestHandler.send(jsonData);
      RequestHandler.onSuccess = () => {
        pdfViewerInstance.serverActionSettings.load = 'ReLoad';
        this.isReload = true;
        pdfViewerInstance.load(pdfViewerInstance.fileName, null);
        pdfViewerInstance.serverActionSettings.load = 'Load';
      };
    }
  },
  provide: {
    PdfViewer: [Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView, ThumbnailView, Print, TextSelection, TextSearch, Annotation, FormDesigner, FormFields]
  }
}
</script>

<style>
@import '../node_modules/@syncfusion/ej2-base/styles/material.css';
@import '../node_modules/@syncfusion/ej2-buttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-dropdowns/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-inputs/styles/material.css';  
@import '../node_modules/@syncfusion/ej2-navigations/styles/material.css';
@import '../node_modules/@syncfusion/ej2-popups/styles/material.css';
@import '../node_modules/@syncfusion/ej2-splitbuttons/styles/material.css';
@import '../node_modules/@syncfusion/ej2-lists/styles/material.css';
@import '../node_modules/@syncfusion/ej2-vue-pdfviewer/styles/material.css';

#pdfViewer {
height: 640px;
}
</style>
