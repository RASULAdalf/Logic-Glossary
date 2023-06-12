import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs";
import {AppService} from "./services/app.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Logic-Glossary';
  fromLang = 'Sinhala';
  toLang = 'English';

  inputForm = new FormGroup({
    inputText:new FormControl('')
  });

  //Listeners


  constructor(private activatedRoute: ActivatedRoute,private router:Router,public appService:AppService) {
    this.inputForm.valueChanges.pipe(debounceTime(1080)).subscribe(inData=>{
      this.router.navigate(['/'],{queryParams:{'word':inData.inputText,'fromLang':this.fromLang,'toLang':this.toLang}})
    })
  }

  outputForm = new FormGroup({
    outputText:new FormControl('')
  });

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(resp=>{
      if (resp['word']!= undefined && resp['fromLang']!=undefined && resp['toLang']!=undefined) {
        this.appService.getTranslation(resp['word'],resp['fromLang'],resp['toLang']).subscribe(data=>{
          this.appService.translatedText = data?.data;
          console.log(this.appService.translatedText);
        })
      }
    })
  }


  swapLanguages(inputLang: any, outputLang: any) {
    let prevInputLang = inputLang.textLabel;
    inputLang.textLabel = outputLang.textLabel;
    outputLang.textLabel = prevInputLang;

    this.fromLang = inputLang.textLabel;
    this.toLang = outputLang.textLabel;
  }

  recordAudioAndSend() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.start();

        // @ts-ignore
        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
          audioChunks.push(event.data);
        });

        mediaRecorder.addEventListener("stop", () => {
          // @ts-ignore
          const audioBlob = new Blob(audioChunks);
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl);
          audio.play();
        });

        setTimeout(() => {
          mediaRecorder.stop();
        }, 3000);
      });
  }

  createTinyUrlAndCopy() {
    console.log(this.activatedRoute.url);
    W9OFYAa5IseXCK5KIiNW1PdAZ09VZ5ofrD3I2GgjFO1yhb5vOjCLydBRZ5c0

  }
}
