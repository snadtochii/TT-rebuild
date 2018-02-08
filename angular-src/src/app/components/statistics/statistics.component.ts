import { Component, OnInit } from '@angular/core';

import { CasesService, AuthService, DataHandlersService } from '../../services';
import { DataToChart } from '../../models';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent implements OnInit {

  private cases: any[];  
  private dataToChart: DataToChart;
  private isLoading: boolean = false;
  private staticticsOptions: any;
  private filterStep: string = ''//'Segmentation';
  private filterType: string[] = []// ['Orthognathics'];

  constructor(private casesService: CasesService, private authService: AuthService, private dataHandlersService: DataHandlersService) { }

  ngOnInit() {
    this.staticticsOptions = StaticticsOptions;
    this.casesService.getCases(this.authService.getUser()).subscribe((res) => {
      this.cases = res.cases;
      this.onModelChange();
    });
  }

  onModelChange() {

    // this.isLoading = true;
    let filterOptions = {
      caseTypes: this.filterType,
      step: this.filterStep
    }
    let data = this.dataHandlersService.getMonthlyStatistics(this.cases, filterOptions).map((el) => {
      if (isNaN(el)) {
        el = 0;
      } else {
        el = Math.round(el)
      }
      return el;
    });

    this.dataToChart = {
      data: [{ data: data, label: this.filterStep }],
      date: null,
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      options: this.staticticsOptions.barChartOptions,
      type: 'bar'
    }
    // this.isLoading = false;
  }
}


// Options
const StaticticsOptions = {
  filterOptionsStep: [
    { name: 'Images QC', value: 'Images QC' },
    { name: 'Segmentation', value: 'Segmentation' },
    { name: 'Segmentation Rejected', value: 'Segmentation Rejected' },
    { name: 'Segmentation QC', value: 'Segmentation QC' },
    { name: 'Pre-Planning', value: 'Pre-Planning' },
    { name: 'Design', value: 'Design' },
    { name: 'Design Rejected', value: 'Design Rejected' }
  ],
  filterOptionsType: [
    { name: 'Orthognathics', value: 'Orthognathics' },
    { name: 'Reconstruction', value: 'Reconstruction' },
    { name: 'PEEK PSI', value: 'PEEK PSI' },
    { name: 'Distraction', value: 'Distraction' },
    { name: 'CFR', value: 'CFR' },
    { name: 'Anatomical Model', value: 'Anatomical Model' }
  ],
  barChartOptions: {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        stacked: true
      }]
    },
    animation: {
      duration: 1000
    },
    hover: {
      animationDuration: 300
    },
    title: {
      display: true,
      text: 'Statistics, min/step',
      fontSize: 24
    },
    legend:{
      display: true,
      position: 'bottom'
    }
  }
}