import { Plus } from "lucide-react";
import Ic_download_cloud from "../../../assets/images/Ic_download_cloud.svg";
import Button from "../../../components/common/button";
import { SupplierTable } from "./supplierTable";

export const Suppliers = () => {
  return (
    <>
      <div className="px-6 pt-6 pb-16 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-darkBlack font-medium text-[30px]">
              Leverandører
            </h1>
            <p className="text-gray">Liste over alle leverandører</p>
          </div>
          <div className="flex gap-3">
            <div className="border border-gray1 rounded-[8px] flex gap-2 items-center py-[10px] px-4 cursor-pointer shadow-shadow1 h-[40px]">
              <img src={Ic_download_cloud} alt="download" />
              <span className="text-black text-sm font-medium">
                Last ned CSV
              </span>
            </div>
            <Button
              text="Legg til"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              icon={<Plus className="text-white w-5 h-5" />}
              path="/legg-til-leverandor"
            />
          </div>
        </div>
        <SupplierTable />
      </div>
    </>
  );
};
