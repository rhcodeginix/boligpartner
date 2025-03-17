import Button from "../../../components/common/button";
import { HusmodellerTable } from "./HusmodellerTable";

export const Husmodeller = () => {
  return (
    <>
      <div className="px-6 pt-6 pb-16 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-darkBlack font-medium text-[30px]">
            Alle hus- og hyttemodeller
          </h1>

          <Button
            text="Legg til ny modell"
            className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
            path="/add-husmodell"
          />
        </div>
        <HusmodellerTable />
      </div>
    </>
  );
};
