import { Component, OnInit } from '@angular/core';
import { PdfParseService } from './pdf-parse.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  dictPage = ''
  constructor(private pdfService: PdfParseService) {
  }

  ngOnInit() {
    this.pdfService.readPdf('assets/slovar-pushkina-2.pdf', 11).then( result => this.dictPage = result)

  }
}
