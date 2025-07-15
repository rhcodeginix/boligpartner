import { useEffect, useState } from "react";
// import Ic_logo from "../../../../assets/images/Ic_logo.svg";
import { AllSummury } from "./allSummury";
import { useLocation } from "react-router-dom";
import { fetchRoomData } from "../../../../lib/utils";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";

export function formatPhoneNumber(number: any) {
  let cleaned = number.replace(/[^\d+]/g, "");

  const countryCode = cleaned.slice(0, 3);
  const rest = cleaned.slice(3);

  const grouped = rest.match(/.{1,2}/g).join(" ");

  return `${countryCode} ${grouped}`;
}

export const ExportViewData: React.FC<{
  kundeInfo: any;
}> = ({ kundeInfo }) => {
  const [roomsData, setRoomsData] = useState<any>([]);
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const id = pathSegments.length > 2 ? pathSegments[2] : null;

  useEffect(() => {
    if (!id) {
      return;
    }
    const getData = async () => {
      const data = await fetchRoomData(id);

      if (data) {
        setRoomsData(data);
      }
    };

    getData();
  }, [id]);

  const [offices, setOffices] = useState<any>(null);
  const fetchOfficeData = async () => {
    try {
      if (roomsData?.createDataBy?.office) {
        const husmodellDocRef = doc(
          db,
          "office",
          roomsData?.createDataBy?.office
        );
        const docSnap = await getDoc(husmodellDocRef);

        if (docSnap.exists()) {
          setOffices(docSnap.data());
        }
      }
    } catch (error) {
      console.error("Error fetching husmodell data:", error);
    }
  };

  useEffect(() => {
    if (roomsData?.createDataBy?.office) {
      fetchOfficeData();
    }
  }, [roomsData]);

  return (
    // <div className="p-8">
    //   <div className="inner-room-block">
    //     <div className="mb-5 flex items-center justify-between">
    //       <h4 className="text-darkBlack font-semibold text-xl">
    //         Her følger oppsummering
    //       </h4>
    //       {/* <img src={Ic_logo} alt="logo" className="w-[200px] lg:w-auto" /> */}
    //     </div>
    //     <div className="mb-5 flex items-center gap-2 justify-between">
    //       <div className="flex flex-col gap-2">
    //         <p className="text-darkBlack">
    //           <span className="font-semibold">Kundenavn:</span>{" "}
    //           {kundeInfo?.Kundenavn}
    //         </p>
    //         <p className="text-darkBlack">
    //           <span className="font-semibold">BP prosjektnummer:</span>{" "}
    //           {kundeInfo?.Kundenummer}
    //         </p>
    //         {kundeInfo?.Serie && (
    //           <p className="text-darkBlack">
    //             <span className="font-semibold">Serie:</span> {kundeInfo?.Serie}
    //           </p>
    //         )}
    //         <p className="text-darkBlack">
    //           <span className="font-semibold">Mobile:</span>{" "}
    //           {kundeInfo?.mobile
    //             ? formatPhoneNumber(kundeInfo?.mobile)
    //             : kundeInfo?.mobileNummer &&
    //               formatPhoneNumber(kundeInfo?.mobileNummer)}
    //         </p>
    //       </div>
    //       {/* <img
    //         src={roomsData?.image}
    //         alt="room"
    //         className="w-[120px] h-[120px]"
    //       /> */}
    //     </div>
    //   </div>
    //   <AllSummury roomsData={roomsData} />
    // </div>
    <div>
      <div
        style={{
          marginBottom: "1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h4
            style={{
              color: "#101828",
              fontWeight: 600,
              fontSize: "28px",
              marginBottom: "10px",
            }}
          >
            Her følger oppsummering
          </h4>
          <div
            style={{
              // marginBottom: "1.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <p style={{ color: "#101828", fontSize: "20px" }}>
                <span style={{ fontWeight: 600 }}>Kundenavn:</span>{" "}
                {kundeInfo?.Kundenavn}
              </p>
              <p style={{ color: "#101828", fontSize: "20px" }}>
                <span style={{ fontWeight: 600 }}>BP prosjektnummer:</span>{" "}
                {kundeInfo?.Kundenummer}
              </p>
              {kundeInfo?.Serie && (
                <p style={{ color: "#101828", fontSize: "20px" }}>
                  <span style={{ fontWeight: 600 }}>Serie:</span>{" "}
                  {kundeInfo?.Serie}
                </p>
              )}
              <p style={{ color: "#101828", fontSize: "20px" }}>
                <span style={{ fontWeight: 600 }}>Mobile:</span>{" "}
                {kundeInfo?.mobile
                  ? formatPhoneNumber(kundeInfo?.mobile)
                  : kundeInfo?.mobileNummer &&
                    formatPhoneNumber(kundeInfo?.mobileNummer)}
              </p>
            </div>
            {/* <img
          src={roomsData?.image}
          alt="room"
          style={{ width: "120px", height: "120px" }}
        /> */}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          <img
            src={
              "https://firebasestorage.googleapis.com/v0/b/l-plot.firebasestorage.app/o/images%2F1752575284585_Frame%201686570139.png?alt=media&token=a4a3f0bc-3144-4e62-997e-483f4a957839"
            }
            alt="logo"
            // style={{ width: "200px" }}
            style={{ marginBottom: "10px" }}
          />
          {roomsData?.createDataBy && (
            <p style={{ color: "#101828", fontSize: "20px" }}>
              <span style={{ fontWeight: 600 }}>Laget av:</span>{" "}
              {roomsData?.createDataBy?.f_name
                ? `${roomsData?.createDataBy?.f_name} ${roomsData?.createDataBy?.l_name}`
                : roomsData?.createDataBy?.name}
            </p>
          )}
          {roomsData?.createDataBy && (
            <p style={{ color: "#101828", fontSize: "20px" }}>
              <span style={{ fontWeight: 600 }}>E-post:</span>{" "}
              {roomsData?.createDataBy?.email}
            </p>
          )}
          {roomsData?.createDataBy && (
            <p style={{ color: "#101828", fontSize: "20px" }}>
              <span style={{ fontWeight: 600 }}>Office:</span>{" "}
              {offices?.data?.name}
            </p>
          )}
        </div>
      </div>

      <AllSummury roomsData={roomsData} />
    </div>
  );
};
