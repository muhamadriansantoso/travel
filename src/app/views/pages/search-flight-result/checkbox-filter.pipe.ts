import {Pipe, PipeTransform} from '@angular/core';
import {orderBy} from 'lodash';

@Pipe({
  name: 'searchFligthFilter'
})
export class CheckboxFilterPipe implements PipeTransform {
  transform(list: any, transitFilter: any, transitItems: Array<any>, airlineFilter: any, airlineItems: Array<any>, sortResult: string): any {
    if ((transitItems.length > 0) || (airlineItems.length > 0)) {
      let temp: any[] = [];
      let tempCat: any[] = [];

      for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < transitItems.length; j++) {
          if (list[i].stop.toString().includes(transitItems[j].value.toString())) {
            tempCat.push(list[i]);
          }
        }
      }

      temp = tempCat;

      if (airlineItems.length > 0) {
        if (temp.length == 0) {
          for (let i = 0; i < list.length; i++) {
            for (let j = 0; j < airlineItems.length; j++) {
              for (let k = 0; k < list[i].transData.length; k++) {
                if (list[i].transData[k].platingCarrierName.toString().includes(airlineItems[j].value.toString())) {
                  temp.push(list[i]);
                }
              }
            }
          }
        } else {
          let tempSearch: any[] = [];
          for (let i = 0; i < temp.length; i++) {
            for (let j = 0; j < airlineItems.length; j++) {
              for (let k = 0; k < list[i].transData.length; k++) {
                if (temp[i].transData[k].platingCarrierName.toString().includes(airlineItems[j].value.toString())) {
                  tempSearch.push(temp[i]);
                }
              }
            }
          }

          temp = tempSearch;
        }
      }
      if (sortResult == '0') {
        return orderBy(temp, ['totalPrice'], ['asc']);
      } else if (sortResult == '1') {
        return orderBy(temp, ['flightTimeTotal'], ['asc']);
      } else {
        return temp;
      }
    } else {
      if (sortResult == '0') {
        return orderBy(list, ['totalPrice'], ['asc']);
      } else if (sortResult == '1') {
        return orderBy(list, ['flightTimeTotal'], ['asc']);
      } else {
        return list;
      }
    }
  }
}
