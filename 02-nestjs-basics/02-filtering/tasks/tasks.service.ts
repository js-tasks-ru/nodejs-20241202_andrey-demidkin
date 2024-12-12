import {Injectable} from "@nestjs/common";
import {Task, TaskKeys, TaskStatus} from "./task.model";
import {chunk} from "lodash";

//метод сортировки задач по полям
const sortByTaskField = (sortBy: TaskKeys, tasks:Task[]) => tasks.sort((taskA, taskB)=> {
  //если поле сортировки "id" то сравниваем как числа
  let valueA: number | string = sortBy === 'id' ? Number(taskA[sortBy]) : taskA[sortBy];
  let valueB: number | string = sortBy === 'id' ? Number(taskB[sortBy]) : taskB[sortBy];

  if(valueA < valueB) {
    return -1;
  }

  if(valueA > valueB) {
    return 1;
  }

  return 0;
})

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: "1",
      title: "Task 1",
      description: "First task",
      status: TaskStatus.PENDING,
    },
    {
      id: "2",
      title: "Task 2",
      description: "Second task",
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: "3",
      title: "Task 3",
      description: "Third task",
      status: TaskStatus.COMPLETED,
    },
    {
      id: "4",
      title: "Task 4",
      description: "Fourth task",
      status: TaskStatus.PENDING,
    },
    {
      id: "5",
      title: "Task 5",
      description: "Fifth task",
      status: TaskStatus.IN_PROGRESS,
    },
  ];

  getFilteredTasks(
    status?: TaskStatus,
    page?: number,
    limit?: number,
    sortBy?: TaskKeys,
  ): Task[] {
    let result = this.tasks;
    //сначала фильтруем задачи по статусу
    if(status) {
      result = result.filter(task => task.status === status);
    }

    //сортируем по полю, если нужно
    if(sortBy) {
      result = sortByTaskField(sortBy, result);
    }

    //если есть limit
    if(limit) {
      //разбиваем одномерный массив задач.
      //получаем двумерный. Кол-во элементов во вложенном = limit
      const tasksByPage = chunk(result, limit);

      //если есть page и он больше 1,
      // то обращаемся к массиву задач по индексу page - 1.
      //если элемента с таким индексом нет, то возвращаем пустой массив
      //если же page нет, то возвращаем первый элемент
      return (page)
        ? tasksByPage[page - 1] ?? []
        : tasksByPage[0]
    }

    //если нет лимита и page больше 1,то возвращаем пустой массив
    if(page && page > 1) {
      return []
    }

    return result
  }
}
