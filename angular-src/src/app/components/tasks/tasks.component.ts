import { Component, OnInit } from '@angular/core';

import { TasksService, AuthService } from '../../services';
import { Task } from '../../models';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  user: any;
  tasks: Task[];
  datePick: Date;
  constructor(private tasksService: TasksService, private authService: AuthService) { }

  ngOnInit() {
    this.datePick = new Date();
    this.user = this.authService.getUser();
    this.onDateChange(this.user);
  }
  onDateChange(user, date?) {
    this.tasksService.getWeeklyTasks(user, date).subscribe(res => this.tasks = res.weekTasks);
  }
}
