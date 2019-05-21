import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { unauthorized } from './unauthorized/unauthorized';
import { AuthorizedComponent } from './authorized/authorized';
import { messagelist } from './messagelist/messagelist';
import { messageDetail } from './messageDetail/messageDetail';
import { taskCreate } from './taskCreate/taskCreate';
import { workbenchOfGrantedSchedule } from './workbenchOfGrantedSchedule/workbenchOfGrantedSchedule';
import { DataService } from './work.service';
import { TaskComponent } from './task/task.component';

const workbenchRoute: Routes = [
  { path: '', component: AuthorizedComponent },
  { path: 'authorized', component: AuthorizedComponent },
  { path: 'unauthorized', component: unauthorized },
  { path: 'messagelist', component: messagelist },
  { path: 'messageDetail/:id/:type', component: messageDetail },
  { path: 'taskCreate', component: taskCreate },
  { path: 'workbenchOfGrantedSchedule', component: workbenchOfGrantedSchedule },
  { path: 'tasks/:date', component: TaskComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(workbenchRoute)
  ],
  declarations: [
    AuthorizedComponent,
    unauthorized,
    messagelist,
    messageDetail,
    taskCreate,
    workbenchOfGrantedSchedule,
    TaskComponent
  ],
  providers: [DataService]
})
export class workbenchModule { }


