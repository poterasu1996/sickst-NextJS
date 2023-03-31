import { DateTime } from "luxon";

export class AppUtils {
    static isoToFormat(date: string) {
        const newDate = DateTime.fromISO(date);
        return newDate.toFormat('dd LLL yyyy');
    }

    static capitalize(data: string) {
        const capData = data.charAt(0).toUpperCase() + data.slice(1);
        return capData;
    }
}