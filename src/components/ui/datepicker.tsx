// import React from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import Ic_calendar from "../../assets/images/Ic_calendar.svg";

// interface DatePickerComponentProps {
//   selectedDate: Date | null;
//   onDateChange: (date: Date | null) => void;
//   dateFormat?: string;
//   placeholderText?: string;
//   className?: string;
// }

// const DatePickerComponent: React.FC<DatePickerComponentProps> = ({
//   selectedDate,
//   onDateChange,
//   dateFormat = "dd.MM.yyyy",
//   placeholderText = "Select a date",
//   className,
// }) => {
//   const CustomInput = ({
//     value,
//     onClick,
//   }: {
//     value: string;
//     onClick: () => void;
//   }) => (
//     <div
//       style={{ position: "relative" }}
//       className={`${className} flex h-11 items-center justify-between py-2.5 px-3.5 gap-2`}
//       onClick={onClick}
//     >
//       <input
//         type="text"
//         value={value}
//         placeholder={placeholderText}
//         readOnly
//         className="text-base font-medium focus-within:outline-none w-full text-black"
//       />
//       <img src={Ic_calendar} alt="Calendar icon" />
//     </div>
//   );

//   return (
//     <div className="w-full">
//       <DatePicker
//         selected={selectedDate}
//         onChange={onDateChange}
//         dateFormat={dateFormat}
//         customInput={
//           <CustomInput
//             value={selectedDate ? selectedDate.toLocaleDateString() : ""}
//             onClick={() => {}}
//           />
//         }
//         showMonthDropdown
//         showYearDropdown
//         dropdownMode="select"
//       />
//     </div>
//   );
// };

// export default DatePickerComponent;

import React, { forwardRef } from "react";
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
  dateFormat = "dd.MM.yyyy",
  placeholderText = "Select a date",
  className,
}) => {
  // Custom input needs to use forwardRef
  const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, onChange, placeholder }, ref) => (
      <div
        className={`${className} flex h-11 items-center justify-between py-2.5 px-3.5 gap-2 border border-gray-300 rounded`}
      >
        <input
          type="text"
          value={value}
          onChange={onChange}
          onClick={onClick}
          placeholder={placeholder}
          ref={ref}
          className="text-base font-medium focus:outline-none w-full text-black"
        />
        <img src={Ic_calendar} alt="Calendar icon" />
      </div>
    )
  );

  return (
    <div className="w-full">
      <DatePicker
        selected={selectedDate}
        onChange={onDateChange}
        dateFormat={dateFormat}
        placeholderText={placeholderText}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        customInput={<CustomInput />}
      />
    </div>
  );
};

export default DatePickerComponent;
