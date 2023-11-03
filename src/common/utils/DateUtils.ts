export class DateUtils {
  static monthTotalDayCount(
    year: string | number | undefined,
    month: string | number | undefined
  ) {
    const numberYear = Number(year) || new Date().getFullYear();
    const numberMonth = Number(month) || new Date().getMonth() + 1;

    return new Date(numberYear, numberMonth, 0).getDate();
  }
}
