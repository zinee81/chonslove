import Calendar from "react-calendar";
import "./StyledCalender.css";

export default function StyledCalender({
  onChange,
  minDate,
  value,
  selectRange,
  isCheckIn = false,
  selectedCheckIn = null,
  timeSlots = {},
}) {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  today.setHours(0, 0, 0, 0);

  const tileDisabled = ({ date, view }) => {
    if (view !== "month") return false;

    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    const dateStr = koreaDate.toISOString().split("T")[0];

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    todayEnd.setHours(todayEnd.getHours() + 9);

    if (isCheckIn) {
      return (
        koreaDate <= todayEnd ||
        (timeSlots[dateStr] && !timeSlots[dateStr].checkIn)
      );
    } else {
      if (!selectedCheckIn) {
        return true;
      }

      const checkInStart = new Date(selectedCheckIn);
      checkInStart.setHours(0, 0, 0, 0);

      const compareDate = new Date(koreaDate);
      compareDate.setHours(0, 0, 0, 0);

      if (compareDate <= checkInStart) {
        return true;
      }

      const sortedDates = Object.keys(timeSlots)
        .filter(
          (d) => new Date(d).getTime() + 9 * 60 * 60 * 1000 > selectedCheckIn
        )
        .sort();

      const firstBlockedDate = sortedDates.find((d) => !timeSlots[d].checkIn);

      if (firstBlockedDate) {
        return (
          koreaDate >=
          new Date(new Date(firstBlockedDate).getTime() + 9 * 60 * 60 * 1000)
        );
      }

      return false;
    }
  };

  const formatDay = (locale, date) => {
    const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return koreaDate.getDate();
  };

  return (
    <Calendar
      locale="ko"
      formatDay={formatDay}
      onChange={onChange}
      minDate={minDate || today}
      value={value}
      className="styledCalender"
      tileDisabled={tileDisabled}
    />
  );
}
