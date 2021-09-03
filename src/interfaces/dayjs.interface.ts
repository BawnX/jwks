import dayjs from 'dayjs';

export interface DayjsInterface {
    addTime(timeCurrent: Date, timeToAdd: number, typeTime: string): dayjs.Dayjs
}