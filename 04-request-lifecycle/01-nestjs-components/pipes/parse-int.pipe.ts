import {BadRequestException, Injectable, PipeTransform} from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    const result = +value;
    if(isNaN(result)){
      throw new BadRequestException(`"${value}" не является числом`);
    }

    return result;
  }
}
