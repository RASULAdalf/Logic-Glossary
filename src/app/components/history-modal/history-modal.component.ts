import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {PageEvent} from "@angular/material/paginator";
import {AppService} from "../../services/app.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-history-modal',
  templateUrl: './history-modal.component.html',
  styleUrls: ['./history-modal.component.scss']
})
export class HistoryModalComponent {
  dateTime: any[] = [];
  page: number | undefined = 0;
  pageSize: number | undefined = 6;
  pageSizeOptions = [10, 20, 30, 40];//The number of data which can be loaded inside one page
  pageEvent: PageEvent | undefined;
  dataCount = 0;

  constructor(private router: Router, private appService: AppService, public dialogRef: MatDialogRef<HistoryModalComponent>, @Inject(MAT_DIALOG_DATA) public data: { data: any[] }) {
    this.initialOperations(data.data);
  }

  loadHistoryData(event: PageEvent): any {
    this.appService.getHistoryData(event.pageIndex, event.pageSize).subscribe(data => {
      this.data = {data: data};
      this.initialOperations(this.data.data);
    })
  }

  displayHistoryData(HistoryDataDisplayBox: any) {
    this.dialogRef.close();
    let index = HistoryDataDisplayBox.getAttribute('data-index');
    this.router.navigate(['/'], {
      queryParams: {
        'word': this.data.data[index]?.englishWord,
        'fromLang': 'English',
        'toLang': 'Sinhala'
      }
    })

  }

  private initialOperations(data: any[]) {
    this.dataCount = data.length;
    for (let i = 0; i < data.length; i++) {
      let createdDateTime = '';
      let dateTime = new Date(data[i]?.date);
      createdDateTime = dateTime.getFullYear() + "-" + dateTime.getMonth() + "-" + dateTime.getDate() + "@" + dateTime.getHours() + "." + dateTime.getMinutes() + "." + dateTime.getSeconds() + ((dateTime.getHours() >= 12) ? "PM" : "AM");
      this.dateTime.push(createdDateTime);
    }
  }
}
