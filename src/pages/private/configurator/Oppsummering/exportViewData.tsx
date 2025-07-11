import Ic_logo from "../../../../assets/images/Ic_logo.svg";
import { AllSummury } from "./allSummury";

export function formatPhoneNumber(number: any) {
  let cleaned = number.replace(/[^\d+]/g, "");

  const countryCode = cleaned.slice(0, 3);
  const rest = cleaned.slice(3);

  const grouped = rest.match(/.{1,2}/g).join(" ");

  return `${countryCode} ${grouped}`;
}

export const ExportViewData: React.FC<{
  rooms: any;
  kundeInfo: any;
  roomsData: any;
}> = ({ rooms, kundeInfo, roomsData }) => {
  return (
    <div className="p-8">
      <div className="inner-room-block px-8">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-darkBlack font-semibold text-xl">
            Her følger oppsummering
          </h4>
          <img src={Ic_logo} alt="logo" className="w-[200px] lg:w-auto" />
        </div>
        <div className="mb-5 flex items-center gap-2 justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-darkBlack">
              <span className="font-semibold">Kundenavn:</span>{" "}
              {kundeInfo?.Kundenavn}
            </p>
            <p className="text-darkBlack">
              <span className="font-semibold">Kundenummer:</span>{" "}
              {kundeInfo?.Kundenummer}
            </p>
            {kundeInfo?.Serie && (
              <p className="text-darkBlack">
                <span className="font-semibold">Serie:</span> {kundeInfo?.Serie}
              </p>
            )}
            <p className="text-darkBlack">
              <span className="font-semibold">Mobile:</span>{" "}
              {kundeInfo?.mobile
                ? formatPhoneNumber(kundeInfo?.mobile)
                : kundeInfo?.mobileNummer &&
                  formatPhoneNumber(kundeInfo?.mobileNummer)}
            </p>
          </div>
          <img
            src={roomsData?.image}
            alt="room"
            className="w-[120px] h-[120px]"
          />
        </div>
      </div>
      <AllSummury roomsData={roomsData} />
    </div>
  );
};
