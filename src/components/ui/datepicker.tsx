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
  const CustomInput = forwardRef<HTMLInputElement, any>(
    ({ value, onClick, onChange, placeholder }, ref) => {
      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, "");
        if (val.length > 2 && val.length <= 4) {
          val = `${val.slice(0, 2)}.${val.slice(2)}`;
        } else if (val.length > 4) {
          val = `${val.slice(0, 2)}.${val.slice(2, 4)}.${val.slice(4, 8)}`;
        }
        e.target.value = val;
        onChange(e);
      };

      return (
        <div
          className={`${className} flex h-11 items-center justify-between py-2.5 px-3.5 gap-2 border border-gray-300 rounded`}
        >
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            onClick={onClick}
            placeholder={placeholder}
            ref={ref}
            className="text-base font-medium focus:outline-none w-full text-black"
          />
          <img src={Ic_calendar} alt="Calendar icon" />
        </div>
      );
    }
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
