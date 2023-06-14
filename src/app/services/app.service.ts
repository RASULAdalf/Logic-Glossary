import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {HistoryModalComponent} from "../components/history-modal/history-modal.component";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  translatedText: any = '';
  baseURL = environment.baseURL;
  tinyURL = environment.tinyURL;
  public historydialogRef: MatDialogRef<HistoryModalComponent, any> | undefined;

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
      height: '580px',
      width: '750px',
      data: {
        data: data
      }
    });
  }


}
