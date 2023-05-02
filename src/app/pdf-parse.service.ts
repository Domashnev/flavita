import { Injectable } from '@angular/core';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';
import { TextContent } from 'pdfjs-dist/types/web/text_layer_builder';
import { TextItem } from 'pdfjs-dist/types/src/display/api';

@Injectable({
  providedIn: 'root'
})
export class PdfParseService {

  constructor() {
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'assets/pdf.worker.js';
  }

  public readPdf(pdfUrl: string, pageNumber: number = 1): Promise<any> {
    return pdfjsLib.getDocument(pdfUrl).promise
      .then(doc => {
      const numPages = doc.numPages;
      console.log("Number of Pages: " + numPages);
      return this.getPageText(pageNumber, doc)
    })
  }

  /**
   * Retrieves the text of a specif page within a PDF Document obtained through pdf.js
   *
   * @param {Integer} pageNum Specifies the number of the page
   * @param {PDFDocument} PDFDocumentInstance The PDF document obtained
   **/
  public getPageText(pageNum: number, PDFDocumentInstance: PDFDocumentProxy): Promise<any> {
    // Return a Promise that is solved once the text of the page is retrieven
    return new Promise(function (resolve, reject) {
      PDFDocumentInstance.getPage(pageNum).then(function (pdfPage: PDFPageProxy) {
        // The main trick to obtain the text of the PDF page, use the getTextContent method
        pdfPage.getTextContent().then(function (textContent: TextContent) {
          let textItems = textContent.items;
          let finalString = "";
          console.log(textContent.items, textContent.styles)
          // Concatenate the string of the item to the final string
          for (let i = 1; i < textItems.length; i++) {
            let item = textItems[i] as TextItem;
            let word = item.str
            if ( item.str.indexOf(' ')>=0 ) word = word.substring(0, word.indexOf(' '))
            if ( (textItems[i-1] as TextItem).hasEOL && word.length>1
              && !/^-?[\d.]+$/.test(word) && word === word.toUpperCase()){
              finalString += item.str + " :: " + (textItems[i+1] as TextItem)?.str + '\n'
            };

          }

          // Solve promise with the text retrieven from the page
          resolve(finalString);
        });
      });
    });
  }

}
