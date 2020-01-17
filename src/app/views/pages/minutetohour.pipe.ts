import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'minuteToHour'
})
export class MinuteToHour implements PipeTransform {
    transform(value: number): string {
        const minutes: number = Math.floor(value / 60);
        return minutes + 'H ' + (value - minutes * 60) + 'M';
    }
}