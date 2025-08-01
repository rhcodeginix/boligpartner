import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../config/firebaseConfig";

export function formatPhoneNumber(number: any) {
  let cleaned = number.replace(/[^\d+]/g, "");

  const countryCode = cleaned.slice(0, 3);
  const rest = cleaned.slice(3);

  const grouped = rest.match(/.{1,2}/g).join(" ");

  return `${countryCode} ${grouped}`;
}

export const ExportView: React.FC<{
  rooms: any;
  kundeInfo: any;
  roomsData: any;
}> = ({ rooms, kundeInfo, roomsData }) => {
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
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {rooms &&
          rooms.length > 0 &&
          rooms.map((room: any, roomIndex: number) => (
            <div key={roomIndex}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {room.rooms &&
                  room.rooms.length > 0 &&
                  room.rooms.map((innerRoom: any, index: number) => {
                    return (
                      <div key={index} className="inner-room-block">
                        {index === 0 && (
                          <h3
                            style={{
                              color: "#101828",
                              fontSize: "24px",
                              fontWeight: 600,
                            }}
                          >
                            {room?.title}
                          </h3>
                        )}
                        {index === 0 && (
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <img
                              src={`${room?.image}`}
                              alt="floor"
                              style={{
                                width: "1000px",
                              }}
                            />
                          </div>
                        )}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                            background: "#f9f9fb",
                            padding: "16px",
                            borderRadius: "8px",
                          }}
                        >
                          <div
                            style={{
                              color: "#30374f",
                              fontSize: "24px",
                              fontWeight: 600,
                            }}
                          >
                            {innerRoom?.name_no || innerRoom?.name}
                          </div>
                          {innerRoom?.Kategorinavn &&
                            innerRoom.Kategorinavn.length > 0 &&
                            (() => {
                              const allSelectedProducts: any[] = [];
                              innerRoom.Kategorinavn.filter(
                                (kat: any) => kat.productOptions !== "Text"
                              ).forEach((kat: any) => {
                                kat?.produkter
                                  ?.filter(
                                    (prod: any) => prod?.isSelected === true
                                  )
                                  .forEach((prod: any) => {
                                    allSelectedProducts.push({
                                      ...prod,
                                      categoryName: kat?.navn,
                                      comment: kat?.comment ?? "",
                                    });
                                  });
                              });

                              return (
                                <div className="custom-grid">
                                  {allSelectedProducts.map(
                                    (prod: any, prodIndex: number) => {
                                      return (
                                        <div key={prodIndex}>
                                          <div
                                            style={{
                                              color: "#5d6b98",
                                              fontSize: "24px",
                                              fontWeight: 500,
                                              marginBottom: "2px",
                                            }}
                                          >
                                            {prod.categoryName}
                                          </div>
                                          <div
                                            style={{
                                              color: "#101828",
                                              fontSize: "20px",
                                            }}
                                          >
                                            {prod?.Produktnavn}{" "}
                                            {prod?.customText && (
                                              <span
                                                style={{
                                                  color: "#101828",
                                                }}
                                              >
                                                ({prod?.customText})
                                              </span>
                                            )}
                                          </div>
                                          <div
                                            style={{
                                              color: "#101828",
                                              fontSize: "20px",
                                              marginTop: "2px",
                                            }}
                                          >
                                            {prod.comment}
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              );
                            })()}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
