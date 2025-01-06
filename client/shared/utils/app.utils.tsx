// @ts-ignore
import { DateTime } from "luxon";
import { toast } from "react-toastify";
import { EncodedFile } from "../../models/ContactUs.model";

const toastMsg = (msg: string, status: boolean) => {
    return (
      <>
        <div className="toast-item">
          <div className="content">
            <div className="title">{status ? "Success" : "ERROR"}</div>
            <div className="message">{msg}</div>
          </div>
        </div>
      </>
    );
};

export class AppUtils {
    static toastNotification(message: string, status: boolean) {
        // status: true-success false-error
        toast(toastMsg(message, status), {
          autoClose: 2000,
        });
      }

    static isoToFormat(date: string) {
        const newDate = DateTime.fromISO(date);
        return newDate.toFormat('dd LLL yyyy');
    }

    static parseBirthdayDate(date: Date | string) {
        // date should be of type dd/mm/yyyy
        const newDate = new Date(date)
        const year = newDate.getFullYear();
        const month = String(newDate.getMonth() + 1).padStart(2, '0');
        const day = String(newDate.getDate()).padStart(2, '0');

        return year + '-' + month + '-' + day;
    }

    static parseDBBirthdayDate(date: string | null | undefined) {
        if(date) {
            const parts = date.split('-');
            const year = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1;
            const day = parseInt(parts[2]);
            
            return new Date(year, month, day);
        }
        return null;
    }

    static random7() {
        // apply random gradient
        const max = 7;
        const min = 1;
        return Math.floor(Math.random()* (max - min) + min)
    }

    static capitalize(data: string) {
        const capData = data.charAt(0).toUpperCase() + data.slice(1);
        return capData;
    }

    static userFullNameInitials(firstName: string, lastName: string) {
        return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    }

    static splitUserFullName(fullName: string) {
        const words = fullName.trim().split(/\s+/);
        let firstName = '';
        let lastName = 'Default';

        if (words.length > 0) {
            lastName = words.shift()!;
            firstName = words.join(' ');
        }

        return {
            first_name: firstName,
            last_name: lastName
        };
    }

    static firstInitial(name: string) {
        return name.charAt(0).toUpperCase()+".";
    }

    static encodeFileToBase64 = (file: File): Promise<EncodedFile> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
            if (reader.result) {
                resolve({
                name: file.name,
                type: file.type,
                data: reader.result.toString().split(',')[1] as string, // Get the base64 part
                });
            } else {
                reject(new Error('FileReader result is undefined'));
            }
            };
            reader.onerror = error => reject(error);
        });
    }

    static encodeFileToBase64Alt = async (file: File): Promise<EncodedFile> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onload = () => {
              const arrayBuffer = reader.result as ArrayBuffer;
              const base64String = Buffer.from(arrayBuffer).toString('base64');
              resolve({
                name: file.name,
                type: file.type,
                data: base64String,
              });
            };
            reader.onerror = (error) => reject(error);
        });
    }

    static getNextBillingDate(isoDate: string) {
        const currentDate = new Date(isoDate);
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        // Set the next billing month and year
        let nextMonth = month + 1;
        let nextYear = year;

        if (nextMonth === 13) {
            nextMonth = 1;
            nextYear++;
        }

        // Determine the number of days in the next billing month
        let daysInMonth = 0;
        if (nextMonth === 2) {
            // If next month is February, check for leap year
            daysInMonth = ((nextYear % 4 === 0 && nextYear % 100 !== 0) || nextYear % 400 === 0) ? 29 : 28;
        } else if (nextMonth === 4 || nextMonth === 6 || nextMonth === 9 || nextMonth === 11) {
            // If next month has 30 days
            daysInMonth = 30;
        } else {
            // If next month has 31 days
            daysInMonth = 31;
        }

        // Set the next billing day based on the current day and the number of days in the next billing month
        let nextDay = 0;
        if (day > daysInMonth) {
            // If current day is greater than number of days in the next billing month, set next billing day to the last day of the next month
            nextDay = daysInMonth;
        } else if (month === 1 && day >= 29) {
            // If current month is January and current day is 29, 30 or 31, set next billing day to the last day of February
            nextDay = 28;
            if ((nextYear % 4 === 0 && nextYear % 100 !== 0) || nextYear % 400 === 0) {
            nextDay = 29;
            }
        } else if (day === 31 && (nextMonth === 4 || nextMonth === 6 || nextMonth === 9 || nextMonth === 11)) {
            // If current day is 31 and next month has 30 days, set next billing day to 30
            nextDay = 30;
        } else if (day === 30 && nextMonth !== 2) {
            // If current day is 30 and next month is not February, set next billing day to 30
            nextDay = 30;
        } else {
            // Otherwise, set the next billing day to the same day as the current day
            nextDay = day;
        }

        const nextBillDate = new Date(nextYear, nextMonth - 1, nextDay);

        return nextBillDate.toISOString();
    }

    // static formatToISO(day: number, month: number, year: number) {
    //     // Convert arguments to integers
    //     // const intDay = parseInt(day);
    //     // const intMonth = parseInt(month);
    //     // const intYear = parseInt(year);

    //     // Create a Date object with the given arguments
    //     const date = new Date(year, month - 1, day);

    //     // Use the built-in toISOString() method to get the date in ISO format
    //     return date.toISOString().substr(0, 10);
    // }

    // static getDateParts(isoDateString: string) {
    //     // "2023-04-13T12:34:56.789Z"
    //     const dateObj = new Date(isoDateString);
    //     const day = dateObj.getUTCDate();
    //     const month = dateObj.getUTCMonth() + 1;
    //     const year = dateObj.getUTCFullYear();
    //     return { day, month, year }; // { day: 13, month: 4, year: 2023 }
    // }
}