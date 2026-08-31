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
}
