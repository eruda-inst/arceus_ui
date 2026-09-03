export default class Formatter {
  static isoDate = (isoDate: string): string => {
    const year: number = Number(isoDate.substring(0, 4));
    const month: number = Number(isoDate.substring(5, 7)) - 1;
    const day: number = Number(isoDate.substring(8, 10));
    const formattedDate = new Date(year, month, day).toLocaleDateString(
      "pt-BR",
    );
    return formattedDate;
  };

  static isoHour = (isoHour: string): string => {
    if (isoHour.length === 5) {
      return isoHour;
    }
    return isoHour.substring(0, 5);
  };

  static isoDatetimeToDate = (isoDatetime: string): string => {
    const date = isoDatetime.split("T")[0];
    const year: number = Number(date.substring(0, 4));
    const month: number = Number(date.substring(5, 7)) - 1;
    const day: number = Number(date.substring(8, 10));
    const formattedDate = new Date(year, month, day).toLocaleDateString(
      "pt-BR",
    );
    return formattedDate;
  };

  static isoDatetimeToTime = (isoDatetime: string): string => {
    const time = isoDatetime.split("T")[1];
    return time.substring(0, 5);
  };
}
