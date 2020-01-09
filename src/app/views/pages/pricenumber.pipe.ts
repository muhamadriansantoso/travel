import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'priceNumber'})
export class PriceNumber implements PipeTransform {
    transform(value: string): string {
        let newStr = value.replace(/\D/g, '');
        return newStr;
    }
}