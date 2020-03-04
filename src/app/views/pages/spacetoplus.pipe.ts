import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'spaceToPlus'})
export class SpacetoplusPipe implements PipeTransform {
  transform(value: string): string {
    let newStr = value.replace(/ /g, '+');
    return newStr;
  }
}
