import React, { useState } from "react";
import Button from "../../../../components/common/button";
import Drawer from "../../../../components/ui/drawer";
import { X } from "lucide-react";
import { AddFinalSubmission } from "./AddFinalSubmission";
import { useNavigate } from "react-router-dom";
import { AllSummury } from "./allSummury";

export const OppsummeringData: React.FC<{
  roomsData: any;
  loading: any;
}> = ({ roomsData, loading }) => {
  const rooms = roomsData?.Plantegninger;
  const navigate = useNavigate();

  const [FinalSubmission, setFinalSubmission] = useState(false);

  const handleFinalSubmissionPopup = () => {
    if (FinalSubmission) {
      setFinalSubmission(false);
    } else {
      setFinalSubmission(true);
    }
  };

  return (
    <>
      <div className="px-4 md:px-6 py-8 mb-[120px]">
        <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-2 flex items-center gap-2 mb-8">
          <div
            className={`w-max py-2 px-3 rounded-lg bg-white text-purple font-semibold`}
            style={{
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
          >
            Oppsummering
          </div>
        </div>
        <AllSummury loading={loading} roomsData={roomsData} />
      </div>
      <div
        className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white border-t border-gray2 p-4 left-0"
        id="export_div"
      >
        <Button
          text="Lagre og lukk"
          className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => navigate("/Bolig-configurator")}
        />
        <Button
          text="Send til oppmelding"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => setFinalSubmission(true)}
        />
      </div>

      <Drawer isOpen={FinalSubmission} onClose={handleFinalSubmissionPopup}>
        <h4 className="text-darkBlack font-medium text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-6">
          Fullfør innsending av tilak
          <X
            onClick={handleFinalSubmissionPopup}
            className="text-primary cursor-pointer"
          />
        </h4>
        <AddFinalSubmission
          onClose={() => setFinalSubmission(false)}
          rooms={rooms}
          roomsData={roomsData}
        />
      </Drawer>
    </>
  );
};
