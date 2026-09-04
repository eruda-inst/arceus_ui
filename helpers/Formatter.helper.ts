export default class Formatter {
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
