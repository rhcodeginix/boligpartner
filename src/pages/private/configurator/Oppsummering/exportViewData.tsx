import { useEffect, useState } from "react";
import { AllSummury } from "./allSummury";
import { useLocation } from "react-router-dom";
import { fetchHusmodellData } from "../../../../lib/utils";
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
  const kundeId = pathSegments.length > 3 ? pathSegments[3] : null;
  const [createDataBy, setCreatedDataBy] = useState<any>();

  useEffect(() => {
    if (!id || !kundeId) {
      return;
    }
    const getData = async () => {
      const data = await fetchHusmodellData(id);
      setCreatedDataBy(data?.createDataBy);

      if (data && data.KundeInfo) {
        const finalData = data.KundeInfo.find(
          (item: any) => item.uniqueId === kundeId
        );
        setRoomsData(finalData);
      }
    };

    getData();
  }, [id, kundeId]);

  const [offices, setOffices] = useState<any>(null);
  const fetchOfficeData = async () => {
    try {
      if (createDataBy && createDataBy?.office) {
        const husmodellDocRef = doc(db, "office", createDataBy?.office);
        const docSnap = await getDoc(husmodellDocRef);

        if (docSnap.exists()) {
          setOffices(docSnap.data());
        }
      }
    } catch (error) {
      console.error("Error fetching office data:", error);
    }
  };

  useEffect(() => {
    if (createDataBy) {
      fetchOfficeData();
    }
  }, [createDataBy]);

  return (
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
            Skjema for oppmelding
          </h4>
          <div
            style={{
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
            style={{ marginBottom: "10px" }}
          />
          {createDataBy && (
            <p style={{ color: "#101828", fontSize: "20px" }}>
              <span style={{ fontWeight: 600 }}>Laget av:</span>{" "}
              {createDataBy?.f_name
                ? `${createDataBy?.f_name} ${createDataBy?.l_name}`
                : createDataBy?.name}
            </p>
          )}
          {createDataBy && (
            <p style={{ color: "#101828", fontSize: "20px" }}>
              <span style={{ fontWeight: 600 }}>E-post:</span>{" "}
              {createDataBy?.email}
            </p>
          )}
          {createDataBy && (
            <p style={{ color: "#101828", fontSize: "20px" }}>
              <span style={{ fontWeight: 600 }}>Kontor:</span>{" "}
              {offices?.data?.name}
            </p>
          )}
          <p style={{ color: "#101828", fontSize: "20px" }}>
            <span style={{ fontWeight: 600 }}>Dato og klokkeslett:</span>{" "}
            {new Date().toLocaleString("nb-NO", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      <AllSummury roomsData={roomsData} />
    </div>
  );
};
