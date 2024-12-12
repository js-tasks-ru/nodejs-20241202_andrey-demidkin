import {Controller, Get, HttpException, HttpStatus, Query} from "@nestjs/common";
import { TasksService } from "./tasks.service";
import {TASK_KEYS, TaskKeys, TaskStatus} from "./task.model";

@Controller("tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query("status") status?: TaskStatus,
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("sortBy") sortBy?: TaskKeys,
  ) {
    const wrongSortParameter = sortBy && !TASK_KEYS.includes(sortBy);
    const wrongPageParameter = page && typeof Number(page) !== "number"
      || page && page < 1
    const wrongLimitParameter = limit && typeof Number(limit) !== "number"
      || limit && limit < 1
    const wrongStatusParameter = status && !Object.values(TaskStatus).includes(status);

    if(wrongLimitParameter) {
      throw new HttpException(`Wrong limit parameter`, HttpStatus.BAD_REQUEST);
    }
    if(wrongPageParameter ) {
      throw new HttpException(`Wrong page parameter`, HttpStatus.BAD_REQUEST);
    }
    if(wrongSortParameter) {
      throw new HttpException(`Wrong sortBy parameter`, HttpStatus.BAD_REQUEST);
    }

    if(wrongStatusParameter) {
      throw new HttpException(`Wrong task status:${status}`, HttpStatus.NOT_FOUND);
    }

    return this.tasksService.getFilteredTasks(status, page, limit, sortBy);
  }
}
