import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { addTaskDTO } from './DTO/addTaskDTO';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  allTasks = [];

  //constructor(private taskSer: TaskService) {}

  @Inject(TaskService) private taskSer;

  @Get('all')
  getAllTasks() {
    return {
      allTasks: this.allTasks,
    };
  }

  @Post('new')
  AddNewTask(@Body() body: addTaskDTO) {
    this.taskSer.ajouterTask(body);
    return { message: 'task ajouté', tasksPLB: this.taskSer.allTasks };
  }

  @Get('search/:id')
  getOneTask(@Param('id') taskId) {
    console.log('id du task', taskId);
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

  @Get('filter')
  filterTasks(@Query('year1') y1, @Query('year2') y2) {
    let filtredTasks = this.allTasks.filter(
      (t) => t.year >= y1 && t.year <= y2,
    );
    return { result: filtredTasks };
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

  @Delete('delete/:taskid')
  deleteTask(@Param('taskid') taskId) {
    let indice = this.allTasks.findIndex((t) => t.id == taskId);
    if (indice == -1) {
      // if(selectedTask == undefined || null)
      throw new NotFoundException(
        "Le task que vous souhaitez mettre à jour n'existe pas",
      );
    }
    //let abc = 10;
    this.allTasks.splice(indice, 1);
    return {
      message: 'Task supprimé avec succès',
      allTasks: this.allTasks,
      //  abc : abc,
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
