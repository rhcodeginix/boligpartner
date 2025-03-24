import { Plus } from "lucide-react";
import Button from "../../../components/common/button";
import { UserTable } from "./userTable";
export const UserManagement = () => {
  return (
    <>
      <div className="px-6 pt-6 pb-16 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <h1 className="text-darkBlack font-medium text-[30px]">Brukers</h1>
            <p className="text-gray">Liste over alle bruker</p>
          </div>
          <div className="flex gap-3">
            <Button
              text="Legg til"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
              icon={<Plus className="text-white w-5 h-5" />}
              path="/legg-til-bruker"
            />
          </div>
        </div>
        <UserTable />
      </div>
    </>
  );
};
