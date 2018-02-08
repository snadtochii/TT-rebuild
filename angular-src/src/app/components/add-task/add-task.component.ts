import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
// import { FlashMessagesService } from 'angular2-flash-messages';

import { Task } from '../../models';
import { TasksService, AuthService } from '../../services';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  datePick: Date;
  public task: Task;

  constructor(private tasksService: TasksService,
    //  private flashMessagesService: FlashMessagesService,
      private authService: AuthService) { }

  ngOnInit() {
    this.datePick = new Date();
  }

  addTask(form: NgForm) {
    if (!form.valid || (form.value.time == 0)) {
      // this.flashMessagesService.show('Form is not valid', { cssClass: 'alert-danger', timeout: 3000 });
      return;
    }
    this.task = new Task(form.value.title, form.value.description, form.value.time, new Date(this.datePick));

    this.tasksService.addTask(this.authService.getUser(), this.task).subscribe(res => {
      // this.flashMessagesService.show('Task was added', { cssClass: 'alert-success', timeout: 3000 });
      form.resetForm();
    });
  }
}
