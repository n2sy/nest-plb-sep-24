import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Task } from './models/task';
import { addTaskDTO } from './DTO/addTaskDTO';

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
  AddNewTask(@Body() body: addTaskDTO) {
    console.log(body instanceof addTaskDTO);

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

  @Put('edit/:id')
  updateTask(@Body() body, @Param('id') taskId) {
    let indice = this.allTasks.findIndex((t) => t.id == taskId);
    if (indice == -1) {
      // if(selectedTask == undefined || null)
      throw new NotFoundException(
        "Le task que vous souhaitez mettre à jour n'existe pas",
      );
    }

    this.allTasks[indice] = {
      id: taskId,
      title: body.title,
      year: body.year,
      statut: body.statut,
      createdAt: this.allTasks[indice].createdAt,
    };

    return {
      message: 'Task mise à jour',
      allTasks: this.allTasks,
    };
  }
}

// function test(a, b) {
//   return a + b;
// }

//  (a, b) => {
//     return a + b;
// }

//  (a, b) =>  a + b;

//  a =>  a + 10;

//  () =>  20 + 10;
