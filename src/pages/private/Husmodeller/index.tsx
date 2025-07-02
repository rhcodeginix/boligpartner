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

  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>(
    {}
  );

  const handleImageLoad = (index: number) => {
    setImageLoaded((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <>
      {isLoading && <Spinner />}

      <div className="px-4 md:px-6 py-5 md:py-8 desktop:p-8 flex gap-3 items-center justify-between bg-lightPurple">
        <div>
          <h1 className="text-darkBlack font-medium text-2xl md:text-[28px] desktop:text-[32px] mb-2">
            Velg ønsket serie
          </h1>
          <p className="text-secondary text-sm md:text-base desktop:text-lg">
            Velg ønsket serie og du vil kunne konfigurere boligen i henhold til
            ønsket seier
          </p>
        </div>
      </div>
      <div className="px-4 md:px-6 py-5 md:py-8 desktop:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 desktop:gap-6">
        {houseModels &&
          houseModels.length > 0 &&
          houseModels?.map((item: any, index: number) => {
            const loaded = imageLoaded[index];

            return (
              <div key={index}>
                <div className="w-full h-[243px] mb-2.5 md:mb-4 relative">
                  {!loaded && (
                    <div className="w-full h-full rounded-lg custom-shimmer"></div>
                  )}
                  {item?.photo && (
                    <img
                      src={item?.photo}
                      alt="house"
                      className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${
                        loaded ? "opacity-100" : "opacity-0"
                      }`}
                      onLoad={() => handleImageLoad(index)}
                      onError={() => handleImageLoad(index)}
                      loading="lazy"
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 justify-between">
                  <h4 className="text-darkBlack font-medium">
                    {item?.husmodell_name}
                  </h4>
                  <div
                    className="border-purple border-2 rounded-[40px] py-2 px-5 text-purple font-medium h-[40px] flex items-center justify-center cursor-pointer whitespace-nowrap"
                    // onClick={() => navigate(`/se-husmodell/${item?.id}`)}
                    onClick={() => navigate(`/se-series/${item?.id}`)}
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
