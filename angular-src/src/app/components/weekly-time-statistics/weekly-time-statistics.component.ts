import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { CasesService, AuthService, DataHandlersService, TasksService } from '../../services';
import { DataToChart, Week, ChartData } from '../../models';

@Component({
  selector: 'app-weekly-time-statistics',
  templateUrl: './weekly-time-statistics.component.html',
  styleUrls: ['./weekly-time-statistics.component.css']
})
export class WeeklyTimeStatisticsComponent implements OnInit {
  private week: Week;
  private isHours: boolean = true;
  private isLoading: boolean = false;
  private weeklyTime: any[];
  private weeklyTimeImagesQCSynthes: any[];
  private weeklyTimeImagesQCObl: any[];
  private weeklyTimeImagesQCSurgicase: any[];
  private weeklyTimeImagesQCShoulder: any[];
  private weeklyTimeImagesQCOther: any[];
  private weeklyTimeCE: any[];
  private weeklyTimeQE: any[];
  private weeklyTimeOblCE: any[];
  private weeklyTimeOblQE: any[];
  private weeklyTimeTasks: any[];
  private weekToChart: DataToChart;
  private totalWeeklyTime: number;
  private standardWeeklyTime: number;
  private weekDates: any;
  private readonly adminOverheadCoefficient: number = 0.9;

  datePick: Date;
  selectedDate: Date;

  constructor(private changeDetectorRef: ChangeDetectorRef,
    private casesService: CasesService,
    private dataHandlersService: DataHandlersService,
    private authService: AuthService,
    private tasksService: TasksService) {
  }

  ngOnInit() {
    this.datePick = new Date();
    this.onDateChange(this.datePick);
  }

  onDateChange(date) {
    this.selectedDate = new Date(date);
    this.getWeeklyTime(this.authService.getUser(), this.selectedDate);
  }

  getWeeklyTime(user, date): any {
    this.isLoading = true;

    this.nullAll();

    this.week = new Week();
    this.changeDetectorRef.detectChanges();

    this.casesService.getWeeklyCasesTime(user, date).subscribe(res => {
      console.log(res);
      /// images Synthes
      this.week.weeklyTimeImagesQCSynthesMM = res.weekCasesTime.weeklyTimeImagesQCSynthesMM ?
        res.weekCasesTime.weeklyTimeImagesQCSynthesMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeImagesQCSynthesMM;

      /// images Obl
      this.week.weeklyTimeImagesQCOblMM = res.weekCasesTime.weeklyTimeImagesQCOblMM ?
        res.weekCasesTime.weeklyTimeImagesQCOblMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeImagesQCOblMM;

      /// images Surgicase
      this.week.weeklyTimeImagesQCSurgicaseMM = res.weekCasesTime.weeklyTimeImagesQCSurgicaseMM ?
        res.weekCasesTime.weeklyTimeImagesQCSurgicaseMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeImagesQCSurgicaseMM;

      /// images Shoulder
      this.week.weeklyTimeImagesQCShoulderMM = res.weekCasesTime.weeklyTimeImagesQCShoulderMM ?
        res.weekCasesTime.weeklyTimeImagesQCShoulderMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeImagesQCShoulderMM;

      ///images other
      this.week.weeklyTimeImagesQCOtherMM = res.weekCasesTime.weeklyTimeImagesQCOtherMM ?
        res.weekCasesTime.weeklyTimeImagesQCOtherMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeImagesQCOtherMM;

      /// CE
      this.week.weeklyTimeCEMM = res.weekCasesTime.weeklyTimeCEMM ?
        res.weekCasesTime.weeklyTimeCEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeCEMM;

      /// Obl CE
      this.week.weeklyTimeOblCEMM = res.weekCasesTime.weeklyTimeOblCEMM ?
        res.weekCasesTime.weeklyTimeOblCEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeOblCEMM;

      /// QE
      this.week.weeklyTimeQEMM = res.weekCasesTime.weeklyTimeQEMM ?
        res.weekCasesTime.weeklyTimeQEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeQEMM;

      /// Obl QE
      this.week.weeklyTimeOblQEMM = res.weekCasesTime.weeklyTimeOblQEMM ?
        res.weekCasesTime.weeklyTimeOblQEMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeOblQEMM;

      /// daily
      this.week.weeklyTimeMM = res.weekCasesTime.weeklyTimeMM ?
        res.weekCasesTime.weeklyTimeMM.map((el) => { return Math.round(el / this.adminOverheadCoefficient) }) : res.weekCasesTime.weeklyTimeMM;

      /// total
      this.week.totalWeeklyTimeMM = Math.round(res.weekCasesTime.totalWeeklyTimeMM / this.adminOverheadCoefficient);

      this.tasksService.getWeeklyTasksTime(user, date).subscribe(res => {
        this.week.weeklyTimeTasksMM = res.weekTasksTime;

        /// daily cases + tasks
        this.week.weeklyTimeTasksMM &&
          this.week.weeklyTimeTasksMM.map((el, i) => {
            this.week.weeklyTimeMM[i] += el;
          });

        /// total cases + tasks
        this.week.weeklyTimeTasksMM && (this.week.totalWeeklyTimeMM += this.week.weeklyTimeTasksMM.reduce((a, b) => a + b, 0));

        this.updateTime();
        this.isLoading = false;
      });
      this.weekDates = this.dataHandlersService.getWeekDates(this.selectedDate);

    });


  }

  updateTime(): void {
    /// images synthes
    this.week.weeklyTimeImagesQCSynthesMM && (this.weeklyTimeImagesQCSynthes = !this.isHours ? this.week.weeklyTimeImagesQCSynthesMM :
      this.week.weeklyTimeImagesQCSynthesMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// images Obl 
    this.week.weeklyTimeImagesQCOblMM && (this.weeklyTimeImagesQCObl = !this.isHours ? this.week.weeklyTimeImagesQCOblMM :
      this.week.weeklyTimeImagesQCOblMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// images Surgicase
    this.week.weeklyTimeImagesQCSurgicaseMM && (this.weeklyTimeImagesQCSurgicase = !this.isHours ? this.week.weeklyTimeImagesQCSurgicaseMM :
      this.week.weeklyTimeImagesQCSurgicaseMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// images Shoulder
    this.week.weeklyTimeImagesQCShoulderMM && (this.weeklyTimeImagesQCShoulder = !this.isHours ? this.week.weeklyTimeImagesQCShoulderMM :
      this.week.weeklyTimeImagesQCShoulderMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// images other
    this.week.weeklyTimeImagesQCOtherMM && (this.weeklyTimeImagesQCOther = !this.isHours ? this.week.weeklyTimeImagesQCOtherMM :
      this.week.weeklyTimeImagesQCOtherMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// CE
    this.week.weeklyTimeCEMM && (this.weeklyTimeCE = !this.isHours ? this.week.weeklyTimeCEMM :
      this.week.weeklyTimeCEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// Obl CE
    this.week.weeklyTimeOblCEMM && (this.weeklyTimeOblCE = !this.isHours ? this.week.weeklyTimeOblCEMM :
      this.week.weeklyTimeOblCEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// QE
    this.week.weeklyTimeQEMM && (this.weeklyTimeQE = !this.isHours ? this.week.weeklyTimeQEMM :
      this.week.weeklyTimeQEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// Obl QE
    this.week.weeklyTimeOblQEMM && (this.weeklyTimeOblQE = !this.isHours ? this.week.weeklyTimeOblQEMM :
      this.week.weeklyTimeOblQEMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// tasks
    this.week.weeklyTimeTasksMM && (this.weeklyTimeTasks = !this.isHours ? this.week.weeklyTimeTasksMM :
      this.week.weeklyTimeTasksMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// daily
    this.week.weeklyTimeMM && (this.weeklyTime = !this.isHours ? this.week.weeklyTimeMM :
      this.week.weeklyTimeMM.map((el) => +((el / this.week.minutesInHour).toFixed(1))));

    /// total
    this.totalWeeklyTime = !this.isHours ? this.week.totalWeeklyTimeMM :
      +((this.week.totalWeeklyTimeMM / this.week.minutesInHour).toFixed(1));

    /// time needed for week
    this.standardWeeklyTime = !this.isHours ? this.week.standardWeeklyTimeMM :
      +((this.week.standardWeeklyTimeMM / this.week.minutesInHour).toFixed(1));

    this.updateChartData();
  }
  nullAll() {
    this.weeklyTime = undefined;
    this.weeklyTimeImagesQCSynthes = undefined;
    this.weeklyTimeImagesQCSurgicase = undefined;
    this.weeklyTimeImagesQCShoulder = undefined;
    this.weeklyTimeImagesQCOther = undefined;
    this.weeklyTimeCE = undefined;
    this.weeklyTimeQE = undefined;
    this.weeklyTimeOblCE = undefined;
    this.weeklyTimeOblQE = undefined;
    this.weeklyTimeTasks = undefined;
    this.weekDates = undefined;
  }
  updateChartData() {
    let chartDatasets: ChartData[] = [];
    this.weeklyTimeImagesQCSynthes && (chartDatasets.push({ data: this.weeklyTimeImagesQCSynthes, label: 'Images Synthes' }));
    this.weeklyTimeImagesQCObl && (chartDatasets.push({ data: this.weeklyTimeImagesQCObl, label: 'Images Obl' }));
    this.weeklyTimeImagesQCSurgicase && (chartDatasets.push({ data: this.weeklyTimeImagesQCSurgicase, label: 'Images Surgicase' }));
    this.weeklyTimeImagesQCShoulder && (chartDatasets.push({ data: this.weeklyTimeImagesQCShoulder, label: 'Images Shoulder' }));
    this.weeklyTimeImagesQCOther && (chartDatasets.push({ data: this.weeklyTimeImagesQCOther, label: 'Images Other' }));
    this.weeklyTimeCE && (chartDatasets.push({ data: this.weeklyTimeCE, label: 'CE' }));
    this.weeklyTimeQE && (chartDatasets.push({ data: this.weeklyTimeQE, label: 'QE' }));
    this.weeklyTimeOblCE && (chartDatasets.push({ data: this.weeklyTimeOblCE, label: 'CE OBL' }));
    this.weeklyTimeOblQE && (chartDatasets.push({ data: this.weeklyTimeOblQE, label: 'QE OBL' }));
    this.weeklyTimeTasks && (chartDatasets.push({ data: this.weeklyTimeTasks, label: 'Other Tasks' }));

    this.weekToChart = {
      data: chartDatasets,
      date: this.weekDates,
      labels: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      options: null,
      type: 'bar'
    }
  }
}
