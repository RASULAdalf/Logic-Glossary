import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Logic-Glossary';


  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(resp=>{
      if (resp['word']!= undefined && resp['fromLang']!=undefined && resp['toLang']!=undefined) {
        console.log(resp['word'])
      }
    })
  }


}
