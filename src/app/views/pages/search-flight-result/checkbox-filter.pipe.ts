import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class CheckboxFilterPipe implements PipeTransform {
  transform(items: any, filterTransit: any, filterTransits: Array<any>, isAndTransit: boolean, filterAirline: any, filterAirLines: Array<any>, isAndAirline: boolean): any {
    if (filterTransit && filterAirline && Array.isArray(items) && filterTransits && filterAirLines) {
      let filterKeysTransit = Object.keys(filterTransit);
      let filterKeysAirline = Object.keys(filterAirline);

      let checkedItemsTransit = filterTransits.filter(item => {
        return item.checked;
      });
      let checkedItemsAirline = filterAirLines.filter(item => {
        return item.checked;
      });

      if ((!checkedItemsTransit || checkedItemsTransit.length === 0) && (!checkedItemsAirline || checkedItemsAirline.length === 0)) {
        return items;
      }

      if (isAndTransit) {
        return items.filter(item => {
          filterKeysTransit.reduce((acc1, keyName) =>
              (acc1 && checkedItemsTransit.reduce((acc2, checkedItem) => acc2 && new RegExp(item[keyName], 'gi').test(checkedItem.value) || checkedItem.value === '', true))
            , true);
        });
      } else {
        console.log('hit transit');
        return items.filter(item => {
          return filterKeysTransit.some((keyName) => {
            return checkedItemsTransit.some((checkedItem) => {
              return new RegExp(item[keyName], 'gi').test(checkedItem.value) || checkedItem.value === '';
            });
            });
          });
      }
    } else {
      return items;
    }
  }
}
