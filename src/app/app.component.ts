import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormControl, FormGroup} from "@angular/forms";
import {debounceTime} from "rxjs";
import {AppService} from "./services/app.service";
import {ClipboardService} from "ngx-clipboard";
import {MatSnackBar} from "@angular/material/snack-bar";


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
    inputText: new FormControl('')
  });
  outputForm = new FormGroup({
    outputText: new FormControl('')
  });

  constructor(private snackBar: MatSnackBar, private activatedRoute: ActivatedRoute, private router: Router, public appService: AppService, private clipBoard: ClipboardService) {
    this.inputForm.valueChanges.pipe(debounceTime(1080)).subscribe(inData => {
      if (inData.inputText !== '') {
        this.router.navigate(['/'], {
          queryParams: {
            'word': inData.inputText,
            'fromLang': this.fromLang,
            'toLang': this.toLang
          }
        })
      }
    })
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(resp => {
      if (resp['word'] != undefined && resp['fromLang'] != undefined && resp['toLang'] != undefined) {
        if (resp['fromLang'] !== 'Sinhala' && this.fromLang === 'Sinhala') {
          this.swapLanguages();
        }
        this.inputForm.get('inputText')?.patchValue(resp['word']);
        this.appService.getTranslation(resp['word'].trim(), resp['fromLang'], resp['toLang']).subscribe(data => {
          this.appService.translatedText = data?.data;
          console.log(this.appService.translatedText);
        })
      }
    })
  }


  swapLanguages() {
    let prevInputLang = this.fromLang;
    this.fromLang = this.toLang;
    this.toLang = prevInputLang;
    let input: any = this.inputForm.get('inputText')?.value
    this.inputForm.get('inputText')?.patchValue(this.appService.translatedText);
    this.outputForm.get('outputText')?.patchValue(input);
  }

  recordAudioAndSend() {
   this.appService.createVoiceProcRequest(document, this.inputForm,this.fromLang);
  }

  createTinyUrlAndCopy() {
    this.appService.getTinyUrl("https://logic-glossary.web.app" + this.router.url).subscribe(data => {
      this.clipBoard.copy(data?.data?.tiny_url);
      this.snackBar.open("Link copied to clipboard!", "OK", {
        duration: 2000,
      });

    })

  }

  openHistoryModal() {
    this.appService.getHistoryData(0, 10).subscribe(data => {
      this.appService.openHistoryModal(data);
    })
  }

  resetForms() {
    this.inputForm.get('inputText')?.patchValue('');
    this.outputForm.get('outputText')?.patchValue('');
  }
}
