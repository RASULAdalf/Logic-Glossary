import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AppService {
  translatedText: any = 'Translation...';

  constructor(private http:HttpClient) { }
  baseURL = environment.baseURL;
  public getTranslation(inputWord:any,fromLang:any,toLang:any):Observable<any>{
    return this.http.get(this.baseURL+'word/search?word='+inputWord+'&fromLang='+fromLang+'&toLang='+toLang);
  }
}
