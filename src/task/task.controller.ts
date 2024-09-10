import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './models/task';

@Controller('task')
export class TaskController {
  allTasks = [];

  @Get('all')
  getAllTasks() {
    return {
      allTasks: this.allTasks,
    };
  }

  @Post('new')
  AddNewTask(@Body() body) {
    let generatedId = uuidv4();
    let newTask = new Task(generatedId, body.title, body.year, body.statut);

    this.allTasks.push(newTask);
    return { tasksPLB: this.allTasks };
  }

  @Get(':id')
  getOneTask(@Param('id') taskId) {
    console.log(taskId);
    // let selectedTask = this.allTasks.find((t) => {
    //   return t.id == taskId;
    // });
    let selectedTask = this.allTasks.find((t) => t.id == taskId);
    if (!selectedTask) {
      // if(selectedTask == undefined || null)
      throw new NotFoundException("Le task demandé n'existe pas");
    }

    return { selectedTask: selectedTask };
  }
}

function test(a, b) {
  return a + b;
}

//  (a, b) => {
//     return a + b;
// }

//  (a, b) =>  a + b;

//  a =>  a + 10;

//  () =>  20 + 10;
