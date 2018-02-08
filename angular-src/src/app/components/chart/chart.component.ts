import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent {
  private barChartOptions: any = {
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
    }
  };
  private barChartType: string = 'bar';
  private barChartLabels: string[];
  private barChartData: any[];

  @Input()
  dataToChart: any;

  constructor() { }

  ngOnChanges() {
    this.dataToChart.data && (this.barChartData = this.dataToChart.data)
    this.dataToChart.labels && (this.barChartLabels = this.dataToChart.labels);
    this.dataToChart.options && (this.barChartOptions = this.dataToChart.options);
    this.dataToChart.type && (this.barChartType = this.dataToChart.type);
  }

  // events
  public chartClicked(e: any): void {
    console.log(e)
  }

  public chartHovered(e: any): void {
    console.log(e);
  }
}
