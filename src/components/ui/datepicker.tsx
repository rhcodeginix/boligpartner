import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Ic_calendar from "../../assets/images/Ic_calendar.svg";

interface DatePickerComponentProps {
  selectedDate: Date | null;
  onDateChange: (date: Date | null) => void;
  dateFormat?: string;
  placeholderText?: string;
  className?: string;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
  selectedDate,
  onDateChange,
  dateFormat = "yyyy/MM/dd",
  placeholderText = "Select a date",
  className,
}) => {
  const CustomInput = ({
    value,
    onClick,
  }: {
    value: string;
    onClick: () => void;
  }) => (
    <div
      style={{ position: "relative" }}
      className={`${className}`}
      onClick={onClick}
    >
      <img src={Ic_calendar} alt="Calendar icon" />
      <input
        type="text"
        value={value}
        placeholder={placeholderText}
        readOnly
        className="text-sm font-medium focus-within:outline-none w-[100px]"
      />
    </div>
  );

  return (
    <div>
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat={dateFormat}
        customInput={
          <CustomInput
            value={selectedDate ? selectedDate.toLocaleDateString() : ""}
            onClick={() => {}}
          />
        }
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
      />
    </div>
  );
};

export default DatePickerComponent;
