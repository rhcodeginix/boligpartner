import { useEffect, useState } from "react";
// import Button from "../../../components/common/button";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { Spinner } from "../../../components/Spinner";
import { useNavigate } from "react-router-dom";

export const Husmodeller = () => {
  const navigate = useNavigate();
  const [houseModels, setHouseModels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHusmodellData = async () => {
    setIsLoading(true);
    try {
      let q = query(
        collection(db, "housemodell_configure_broker"),
        orderBy("updatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);

      const data: any = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHouseModels(data);
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHusmodellData();
  }, []);

  return (
    <>
      {isLoading && <Spinner />}

      <div className="p-8 flex gap-3 items-center justify-between bg-lightPurple">
        <div>
          <h1 className="text-darkBlack font-medium text-[32px] mb-2">
            Velg ønsket serie
          </h1>
          <p className="text-secondary text-lg">
            Velg ønsket serie og du vil kunne konfigurere boligen i henhold til
            ønsket seier
          </p>
        </div>
        {/* <Button
          text="Lag ny serie"
          className="border border-purple bg-purple text-white text-base rounded-[40px] h-[48px] font-medium relative px-5 py-3 flex items-center gap-2"
          path="/add-husmodell"
        /> */}
      </div>
      <div className="p-8 grid grid-cols-4 gap-x-6 gap-y-[40px]">
        {houseModels &&
          houseModels.length > 0 &&
          houseModels?.map((item: any, index: number) => {
            return (
              <div key={index}>
                <div className="w-full h-[243px] mb-4">
                  {item?.Husdetaljer?.photo ? (
                    <img
                      src={item?.Husdetaljer?.photo}
                      alt="house"
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#6670853b] rounded-lg"></div>
                  )}
                </div>

                {/* <div className="flex items-center gap-4 mb-3">
                  <div className="text-secondary text-sm">
                    <span className="text-black font-semibold">
                      {item?.Husdetaljer?.BRATotal}
                    </span>{" "}
                    m<sup>2</sup>
                  </div>
                  <div className="h-[12px] w-[1px] border-l border-[#DCDFEA]"></div>
                  <div className="text-secondary text-sm">
                    <span className="text-black font-semibold">
                      {item?.Husdetaljer?.Soverom}
                    </span>{" "}
                    soverom
                  </div>
                  <div className="h-[12px] w-[1px] border-l border-[#DCDFEA]"></div>
                  <div className="text-secondary text-sm">
                    <span className="text-black font-semibold">
                      {item?.Husdetaljer?.Bad}
                    </span>{" "}
                    bad
                  </div>
                </div> */}
                <div className="flex items-center gap-2 justify-between">
                  {/* <div className="flex flex-col gap-1">
                    <p className="text-secondary text-sm">Pris fra</p>
                    <h5 className="text-black text-base font-semibold">
                      {item?.Husdetaljer?.pris}
                    </h5>
                  </div> */}
                  <h4 className="text-darkBlack font-medium">
                    {item?.Husdetaljer?.husmodell_name}
                  </h4>
                  <div
                    className="border-purple border-2 rounded-[40px] py-2 px-5 text-purple font-medium h-[40px] flex items-center justify-center cursor-pointer"
                    // onClick={() => navigate(`/se-husmodell/${item?.id}`)}
                    onClick={() => navigate(`/edit-husmodell/${item?.id}`)}
                  >
                    Velg serie
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};
