import { Injectable } from '@angular/core';
import { forEach } from '@angular/router/src/utils/collection';

@Injectable()
export class DataHandlersService {

  constructor() { }
  getWeekDates(d: Date) {
    const date = new Date(d);
    const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayOfWeek = day.getDay();
    return {
      startDate: new Date(day.getFullYear(), day.getMonth(), day.getDate() - dayOfWeek),
      endDate: new Date(day.getFullYear(), day.getMonth(), day.getDate() + (6 - dayOfWeek) + 1)
    };
  }

  sortByDay(cases: any[], skipBellow: number = 0) {
    let steps = cases.map(el => el.steps).reduce((a, b) => a.concat(b));

    steps = steps.filter(step => step.time >= skipBellow);

    const stepsByDay = {};
    steps.forEach(step => {
      const stepDate = new Date(step.date);
      const stepDay = {
        start: new Date(stepDate.getFullYear(), stepDate.getMonth(), stepDate.getDate()),
        end: new Date(stepDate.getFullYear(), stepDate.getMonth(), stepDate.getDate() + 1)
      };

      if (stepsByDay.hasOwnProperty(stepDay.start.getTime())) {
        stepsByDay[stepDay.start.getTime()].push(step);
      } else {
        stepsByDay[stepDay.start.getTime()] = [step];
      }
    });
    return stepsByDay;
  }

  reduceStepsToTime(sortedSteps: any) {
    const time = {};
    for (const key in sortedSteps) {
      if (sortedSteps.hasOwnProperty(key)) {
        time[key] = sortedSteps[key].reduce((a, b) => a.time + b.time);
      }
    }
    return time;
  }





  getMonthlyStatistics(cases: any[], options: any): any[] {
    let monthlyStatistics = (new Array(12)).fill(0);
    let monthlyFull: FullData[] = [];

    let temp = cases.filter((el) => {
      return (el.step && (el.step.toLowerCase() === options.step.toLowerCase()));
    })
      .filter((el) => {
        return options.caseTypes.some((type, i, arr) => {
          return /(\w+)$/.exec(type)[0].toLowerCase() === /(\w+)$/.exec(el.caseType)[0].toLowerCase();
        });
      });
    temp.forEach((el, i, arr) => {

      if (el.date && new Date(el.date) >= new Date(2017, 0)) {

        let ind = new Date(el.date).getMonth();
        if (!monthlyFull[ind]) {
          monthlyFull[ind] = new FullData();
        }
        monthlyFull[ind].fullTime += el.time;
        monthlyFull[ind].counter++;
      }
    });

    monthlyStatistics = monthlyFull.map((el, i) => {
      if (!el) { return undefined; }
      return el.fullTime / el.counter;
    });
    console.log(monthlyStatistics);
    return monthlyStatistics;
  }
}

class FullData {
  fullTime: number;
  counter: number;
  constructor() {
    this.fullTime = 0;
    this.counter = 0;
  }
}