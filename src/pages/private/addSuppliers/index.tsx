import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AddSuppliersForm } from "./addSuppliersForm";

export const AddSuppliers = () => {
  return (
    <>
      <div className="px-6 pt-6 pb-16 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Link to={"/Leverandorer"} className="text-gray text-sm font-medium">
            Leverandorer
          </Link>
          <ChevronRight className="text-gray2 w-4 h-4" />
          <span className="text-primary text-sm font-medium">
            Legg til nye leverandører
          </span>
        </div>
        <h1 className="text-darkBlack font-medium text-[30px]">
          Legg til leverandør
        </h1>
        <div className="flex items-start gap-8">
          <div className="w-max">
            <h5 className="text-black text-sm font-medium">Partnerdetaljer</h5>
            <p className="text-gray text-sm whitespace-nowrap">
              Legg til bilder og persondetaljer
            </p>
          </div>
          <div className="w-full shadow-shadow2 rounded-lg overflow-hidden">
            <AddSuppliersForm />
          </div>
        </div>
      </div>
    </>
  );
};
