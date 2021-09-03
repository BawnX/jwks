import { DayjsInterface } from '../interfaces/dayjs.interface';
import dayjs from 'dayjs';

export class DayJsConfig implements DayjsInterface
{
    addTime(timeCurrent: Date, timeToAdd: number, typeTime: dayjs.OpUnitType): dayjs.Dayjs
    {
        return dayjs(timeCurrent).add((timeToAdd), typeTime);
    }
}