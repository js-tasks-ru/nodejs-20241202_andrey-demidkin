import {HttpException, HttpStatus, Injectable} from "@nestjs/common";
import {Task} from "./task.model";

//сортировка id:string как number по порядку
const sortIdsAsNumbers = (idA:string, idB:string) => (Number(idA) - Number(idB));
//сортировка задач по id
const sortTasksById = (taskA:Task, taskB:Task) => sortIdsAsNumbers(taskA.id, taskB.id);
//получаем сортированный массив id задач
const getSortedTaskIds = (tasks: Task[]) => tasks
  .map(task => task.id)
  .sort(sortIdsAsNumbers)


@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id: string): Task | null {
    const targetTask = this.tasks.find(task => task.id === id);
    if(!targetTask) {
      throw new HttpException(`no task with id:${id}`, HttpStatus.NOT_FOUND);
    }

    return targetTask;
  }

  createTask(task: Task): Task {
    let {id} = task;

    //получаем массив id существующих задач и сортируем его
    const taskIds = getSortedTaskIds(this.tasks);

    //если входной параметр id уже есть в списке существующих,то ошибка
    if(taskIds.includes(id)) {
      throw new HttpException(`Task with id ${id} already exist`, HttpStatus.I_AM_A_TEAPOT);
    }

    //если id указан, то используем его
    //если нет, то создаем id увеличением макс id на 1
    const newTaskId = Boolean(id)
      ? id
      : taskIds.length > 0
        ? `${Number(taskIds[taskIds.length - 1]) + 1}`
        : '0'

    //устанавливаем найденный id для новой задачи
    const newTask: Task = {
      ...task,
      id: newTaskId
    }

    //добавляем новую задачу в массив задач
    //сортируем массив по id
    this.tasks = [
      ...this.tasks,
      newTask
    ].sort(sortTasksById);

    return newTask;
  }

  updateTask(id: string, update: Task): Task {
    let {id:updateTaskId} = update;
    //ищем задачу для изменения по id
    const targetTask = this.tasks.find(task => task.id === id);
    //если задачи с таким id нет, то и обновлять нечего
    if(!targetTask) {
      throw new HttpException(`Can't find task with id:${id}`, HttpStatus.NOT_FOUND);
    }
    //если внутри объекта task.id есть и он не равен аргументу id,
    //то нужно проверить, что в массиве задач нет задачи с таким id
    if(
      updateTaskId
      && updateTaskId !== id
      && this.tasks.some(task => task.id === updateTaskId)
    ) {
      throw new HttpException(`Wrong task id:${updateTaskId}. Item with this id already exits`, HttpStatus.I_AM_A_TEAPOT);
    }

    //фильтруем все задачи, убирая редактируемую
    const otherTasks = this.tasks.filter(task => task.id !== id);
    const updatedTask = {
      ...targetTask,
      ...update,
    }

    this.tasks = [
      ...otherTasks,
      updatedTask
    ].sort(sortTasksById);


    return updatedTask
  }

  deleteTask(id: string): Task {
    const targetTask = this.tasks.find(task => task.id === id);
    if(!targetTask) {
      throw new HttpException(`Can't find task with id:${id}`, HttpStatus.NOT_FOUND);
    }
    this.tasks = this.tasks.filter(task => task.id !== id);

    return targetTask;
  }
}
