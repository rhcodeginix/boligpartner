import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchRoomData } from "../../../../lib/utils";
// import { Rooms } from "./rooms";
import { OppsummeringData } from "./oppsummeringData";

export const Oppsummering: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;
  const [loading, setLoading] = useState(true);
  const [roomsData, setRoomsData] = useState<any>([]);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const getData = async () => {
      const data = await fetchRoomData(id);

      if (data) {
        setRoomsData(data);
      }
      setLoading(false);
    };

    getData();
  }, [id]);

  return (
    <>
      {/* <div className="bg-lightPurple px-8 py-3">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Romkonfigurator
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Her laster du opp plantegninger som bruker AI til å trekke ut alle
          rommene, du kan så konfigurere hvert enkelt rom.
        </p>
      </div> */}
      <div className="bg-lightPurple px-4 lg:px-8 py-4">
        <h3 className="text-darkBlack font-medium text-xl md:text-[24px] lg:text-[28px] desktop:text-[2rem] desktop:leading-[44.8px] mb-2">
          Oppsummering
        </h3>
        <p className="text-secondary text-sm md:text-base desktop:text-lg">
          Ser kan du se over oppmeldingen din før du bekrefter og laster ned
          endelig konfigurering som du deler med BoligPartner.
        </p>
      </div>
      {/* <Rooms
        rooms={roomsData?.Plantegninger}
        Prev={Prev}
        roomsData={roomsData}
        loading={loading}
      /> */}
      <OppsummeringData roomsData={roomsData} loading={loading} />
    </>
  );
};
