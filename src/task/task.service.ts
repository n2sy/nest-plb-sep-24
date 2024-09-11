import { Injectable } from '@nestjs/common';
import { addTaskDTO } from './DTO/addTaskDTO';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './models/task';

@Injectable()
export class TaskService {
  allTasks = [];
  ajouterTask(bodyTask: addTaskDTO) {
    let generatedId = uuidv4();
    let newTask = new Task(
      generatedId,
      bodyTask.title,
      bodyTask.year,
      bodyTask.statut,
    );

    this.allTasks.push(newTask);
  }
}
