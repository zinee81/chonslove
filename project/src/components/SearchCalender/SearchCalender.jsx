import Calendar from "react-calendar";
import "./SearchCalender.css";

export default function SearchCalendar({ onChange, value }) {
  const today = new Date();
  today.setHours(today.getHours() + 9);
  today.setHours(0, 0, 0, 0);

  const minDate = new Date(today.getFullYear(), today.getMonth(), 1);

  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      const koreaDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      koreaDate.setHours(0, 0, 0, 0);
      return koreaDate.getTime() < today.getTime();
    }
    return false;
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
      minDate={minDate}
      value={value}
      selectRange={true}
      showDoubleView={true}
      showNeighboringMonth={false}
      tileDisabled={tileDisabled}
      className="searchCalendar"
    />
  );
}
