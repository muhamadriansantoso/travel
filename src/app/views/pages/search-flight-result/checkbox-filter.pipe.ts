import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'searchFligthFilter'
})
export class CheckboxFilterPipe implements PipeTransform {
  transform(list: any, transitFilter: any, transitItems: Array<any>, airlineFilter: any, airlineItems: Array<any>): any {
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

      return temp;
    } else {
      return list;
    }

    // if ((airlineItems.length > 0)) {
    //   console.log(airlineItems);
    //   let temp: any[] = [];
    //   let tempCat: any[] = [];
    //
    //   for (let i = 0; i < list.length; i++) {
    //     for (let j = 0; j < airlineItems.length; j++) {
    //       if (list[i].transData[0].platingCarrierName.toString().includes(airlineItems[j].value.toString())) {
    //         tempCat.push(list[i]);
    //       }
    //     }
    //   }
    //
    //   console.log(tempCat);
    //
    //   temp = tempCat;
    //   return temp;
    // } else {
    //   return list;
    // }
  }
}
