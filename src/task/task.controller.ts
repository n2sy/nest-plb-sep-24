import { Body, Controller, Get, Post } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

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
    let newTask = {
      id: uuidv4(),
      title: body.title,
      date: body.date,
    };
    this.allTasks.push(newTask);
    return { tasksPLB: this.allTasks };
  }
}
