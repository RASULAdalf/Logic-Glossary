import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Logic-Glossary';


  inputForm = new FormGroup({
    inputText:new FormControl('')
  });
  outputForm = new FormGroup({
    outputText:new FormControl('')
  });



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
