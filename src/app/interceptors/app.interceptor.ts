import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {finalize, Observable} from 'rxjs';
import {AppService} from "../services/app.service";

@Injectable()
export class AppInterceptor implements HttpInterceptor {

  constructor(private appService: AppService) {
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.toString().includes('word')) {
      this.appService.translatedText = 'Getting Translation...';
    }
    if (request.url.toString().includes('voice')) {
      this.appService.inputText = 'Transcribing Voice...';
    }
    return next.handle(request).pipe(finalize(() => {

    }));
  }
}
