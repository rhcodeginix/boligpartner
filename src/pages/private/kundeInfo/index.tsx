import Button from "../../../components/common/button";
import { HusmodellerTable } from "./HusmodellerTable";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export const KundeInfo = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  return (
    <>
      <div className="py-4 px-4 md:px-6 bg-lightGreen">
        <div className="flex items-center gap-1.5 mb-4 md:mb-6">
          <Link to={"/Husmodell"} className="text-primary text-sm font-medium">
            Husmodeller
          </Link>
          <ChevronRight className="text-[#5D6B98] w-4 h-4" />
          <span className="text-gray text-sm">Kundeopplysninger</span>
        </div>
        <div className="flex sm:items-center gap-3 justify-between mb-4 md:mb-5">
          <h1 className="text-darkBlack font-semibold text-2xl md:text-[28px] desktop:text-[32px]">
            Kundeopplysninger
          </h1>
          <div>
            <Button
              text="Ny konfigurasjon"
              className="border border-primary bg-primary text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              path={`/se-series/${id}/add-husmodell`}
            />
          </div>
        </div>
      </div>
      <div className="py-4 px-4 md:px-6">
        <HusmodellerTable />
      </div>
    </>
  );
};
