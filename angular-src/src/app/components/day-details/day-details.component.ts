import { Component, OnInit } from '@angular/core';

import { CasesService, AuthService } from '../../services';

@Component({
  selector: 'app-day-details',
  templateUrl: './day-details.component.html',
  styleUrls: ['./day-details.component.css']
})
export class DayDetailsComponent implements OnInit {

  private dayCases: any;
  private casesToOutput: any[]
  private datePick: Date;
  private selectedDate: Date;
  private isLoading: boolean = false;
  private filterOptionsChosen: any[];
  private readonly filterOptions = [
    { name: 'Images QC', value: 'Images QC' },
    { name: 'Segmentation', value: 'Segmentation' },
    { name: 'Segmentation Rejected', value: 'Segmentation Rejected' },
    { name: 'Segmentation QC', value: 'Segmentation QC' },
    { name: 'Pre-Planning', value: 'Pre-Planning' },
    { name: 'Design', value: 'Design' },
    { name: 'Design Rejected', value: 'Design Rejected' }
  ];

  constructor(private casesService: CasesService, private authService: AuthService) { }

  ngOnInit() { 
    this.datePick = new Date();
    this.onDateChange(this.datePick)
  }
  onDateChange(date) {
    this.isLoading = true;
    this.dayCases = undefined;

    this.selectedDate = new Date(date);
    this.casesService.getDailyCases(this.authService.getUser(), this.selectedDate).subscribe(res => {
      this.dayCases = res.cases;
      this.casesToOutput = this.dayCases;
      this.filterOptionsChosen = this.filterOptions.map((el) => { return el.value });
      this.isLoading = false;
    },
      err => {
        console.log(err)
        this.isLoading = false;
      });
  }
  private filterByStep(e): void {
    this.casesToOutput = this.dayCases.filter((val) => {
      for (let i = 0; i < e.length; i++) {
        if (val.step.toLowerCase() === e[i].toLowerCase()) {
          return true;
        }
      }
      return false;
    });
  }
  private clearFilters() {
    this.filterOptionsChosen = [];
    this.casesToOutput = [];
  }
}