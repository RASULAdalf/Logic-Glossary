import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HistoryModalComponent} from "../components/history-modal/history-modal.component";
import {FormGroup} from "@angular/forms";
import {AppInterceptor} from "../interceptors/app.interceptor";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  translatedText: any = '';
  baseURL = environment.baseURL;
  tinyURL = environment.tinyURL;
  public historydialogRef: MatDialogRef<HistoryModalComponent, any> | undefined;
  inputText: any;
  private mediaRecorder : any;
  // @ts-ignore
  private audioChunks:any[];
  constructor(private http: HttpClient, private modalService: MatDialog) {
  }

  public getTranslation(inputWord: any, fromLang: any, toLang: any): Observable<any> {
    return this.http.get(this.baseURL + 'word/search?word=' + inputWord + '&fromLang=' + fromLang + '&toLang=' + toLang);
  }

  public getTinyUrl(url: any): Observable<any> {
    return this.http.post(this.tinyURL, {"url": url});
  }

  public getHistoryData(page: number, pageSize: number): Observable<any> {
    return this.http.get(this.baseURL + 'history/getHistory?page=' + page + "&size=" + pageSize);
  }

  public openHistoryModal(data: any[]) {
    this.historydialogRef = this.modalService.open(HistoryModalComponent, {
      height: '530px',
      width: '750px',
      data: {
        data: data
      }
    });
  }

  public createVoiceProcRequest(document: Document,inputForm:FormGroup,fromLang:any) {
    // @ts-ignore
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(stream => {
        if (this.mediaRecorder === undefined) {
          this.mediaRecorder = new MediaRecorder(stream);
        }
        console.log(this.mediaRecorder.state)
        if (this.mediaRecorder.state === 'paused' || this.mediaRecorder.state === 'inactive') {
          this.audioChunks = [];
          this.mediaRecorder.start();
          // @ts-ignore
          document.getElementById('mic-btn').style.color='blue'
        } else {
          this.mediaRecorder.stop();
          // @ts-ignore
          document.getElementById('mic-btn').style.color='black'
        }

        // @ts-ignore
        this.mediaRecorder.addEventListener("dataavailable", event => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener("stop", async () => {
          this.mediaRecorder = new MediaRecorder(stream);
          const audioBlob = new Blob(this.audioChunks);
          const fileName = 'audioFile.mp3';

          const file = await fetch(URL.createObjectURL(audioBlob)).then(r => r.blob()).then(blobFile => new File([blobFile], fileName, {type: 'audio/mp3'}));
          const formData = new FormData();
          formData.append("file", file);
          formData.append("inputLang",fromLang);

          this.http.post(this.baseURL+"voice/procVoice",formData).subscribe(data=>{
            //@ts-ignore
            inputForm.get('inputText')?.patchValue(data.data);
            // @ts-ignore
            this.inputText = data?.data;
          })

        });

      });


  }


}
