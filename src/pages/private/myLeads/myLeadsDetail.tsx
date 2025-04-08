import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchLeadData } from "../../../lib/utils";
import Ic_map from "../../../assets/images/Ic_map.svg";
import { Spinner } from "../../../components/Spinner";

export const MyLeadsDetail = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const [loading, setLoading] = useState(true);
  const [leadData, setLeadData] = useState<any>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchLeadData(id);
      if (data) {
        setLeadData(data);
      }
      setLoading(false);
    };

    getData();
  }, [id]);
  console.log(leadData);

  return (
    <>
      {loading && <Spinner />}
      <div className="bg-lightPurple py-4 px-6">
        <div className="mb-4 flex items-center gap-3">
          <Link to="/my-leads" className="text-gray text-sm font-medium">
            Leads
          </Link>
          <ChevronRight className="w-4 h-4 text-gray2" />
          <span className="text-primary text-sm font-medium">
            Leadsdetaljer
          </span>
        </div>
        <div className="text-darkBlack text-2xl font-medium">
          Lead for <span className="font-bold">Spåtind 66</span>
        </div>
      </div>
      <div className="p-6 flex flex-col gap-5">
        <div className="flex gap-6 items-center">
          <div className="flex items-center gap-6">
            <div
              className="w-[160px] h-[160px] rounded-full flex items-center justify-center border-[4px] border-[#fff] bg-lightPurple text-primary text-[48px] font-medium"
              style={{
                boxShadow:
                  "0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814",
              }}
            >
              {leadData?.leadData?.name
                .split(" ")
                .map((word: any) => word.charAt(0))
                .join("")}
            </div>
            <div>
              <h4 className="text-darkBlack text-[28px] font-medium mb-2">
                {leadData?.leadData?.name}
              </h4>
              <div className="flex items-center gap-4 mb-2">
                <span className="flex items-center gap-4">
                  {leadData?.leadData?.email && (
                    <>
                      <span className="text-gray text-lg">
                        {leadData?.leadData?.email}
                      </span>
                      <div className="border-l border-gray2 h-[14px]"></div>
                    </>
                  )}
                </span>
                <span className="text-gray text-lg">
                  {leadData?.leadData?.telefon}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray text-xs font-medium">Addresse:</span>
                <div className="flex items-start gap-3">
                  <img src={Ic_map} alt="map" className="w-8 h-8" />
                  <div>
                    <p className="text-black text-sm mb-[2px] font-medium">
                      Sokkabekveien 77
                    </p>
                    <span className="text-gray text-xs">3478 Nærsnes</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className=""></div>
        </div>
      </div>
    </>
  );
};
