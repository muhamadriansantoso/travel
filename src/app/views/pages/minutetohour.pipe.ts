import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteToHour'
})
export class MinuteToHour implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        return minutes + ' HOUR, ' + (value - minutes * 60) + ' MINUTES';
    }
}