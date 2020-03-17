import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'underscoreToPlus'})
export class UnderscoretoplusPipe implements PipeTransform {
  transform(value: string): string {
    let newStr = value.replace(/_/g, ' ');
    return newStr;
  }
}
