import * as React from "react";
import PhoneInput, { parsePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

import { cn, phoneNumberValidations } from "../../lib/utils";

export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> & {
  value?: string;
  onChange?: (value?: string) => void;
};

const InputMobile = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [phoneValue, setPhoneValue] = React.useState<string | undefined>(
      value
    );
    const [isValid, setIsValid] = React.useState<boolean | null>(null);

    React.useEffect(() => {
      setPhoneValue(value);
    }, [value]);

    const validatePhoneNumber = React.useCallback((value?: string) => {
      if (!value) return false;

      const parsedNumber = parsePhoneNumber(value || "");
      const countryCode = parsedNumber?.countryCallingCode
        ? `+${parsedNumber.countryCallingCode}`
        : "";
      const phoneNumber = parsedNumber?.nationalNumber || "";

      const validator = phoneNumberValidations[countryCode];
      return validator ? validator(phoneNumber) : false;
    }, []);

    const handleChange = (newValue?: string) => {
      setPhoneValue(newValue);

      const isValidNumber: any = validatePhoneNumber(newValue);

      setIsValid(isValidNumber);

      if (onChange) {
        onChange(newValue);
      }
    };
    return (
      <div
        className={cn(
          `flex gap-[8px] h-12 w-full items-center rounded-[8px] border px-3 py-2 text-sm`,
          isValid === false
            ? "border-red text-red"
            : isValid === true
            ? "border-gray1 text-black"
            : "border-gray1 text-black",
          className
        )}
      >
        <PhoneInput
          ref={ref as any}
          className={cn(
            "border-none h-full focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 focus-within:outline-none w-full text-base"
          )}
          international
          defaultCountry="NO"
          value={phoneValue}
          onChange={handleChange}
          countries={["NO"]}
          autoComplete="off"
          {...props}
        />
      </div>
    );
  }
);

InputMobile.displayName = "InputMobile";

export { InputMobile };
