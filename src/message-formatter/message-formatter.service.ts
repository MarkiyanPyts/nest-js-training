export class MessageFormatterService {
    format(message: string):string {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
        const currentDay = String(currentDate.getDate()).padStart(2, '0');
        const formattedString = `[${currentYear}-${currentMonth}-${currentDay}] ${message}`;

        return formattedString;
    }
}
