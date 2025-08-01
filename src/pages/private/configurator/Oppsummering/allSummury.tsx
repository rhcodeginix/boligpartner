import React from "react";
import { formatPhoneNumber } from "./exportView";

export function formatDate(inputDate: string) {
  if (inputDate === "") {
    return "-";
  }

  const dateObj = new Date(`${inputDate}T00:00:00`);
  dateObj.setDate(dateObj.getDate());

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();

  return `${day}.${month}.${year}`;
}

export function displayValue(value: any) {
  if (value === undefined || value === null) return "-";
  if (typeof value === "string" && value.trim() === "") return "-";
  return value;
}

export const AllSummury: React.FC<{
  roomsData: any;
  loading?: any;
}> = ({ roomsData, loading }) => {
  const rooms = roomsData?.Plantegninger;

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">PROSJEKTDETALJER</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Type prosjekt
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.TypeProsjekt)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                BP prosjektnummer
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Kundenr)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Tiltakshaver</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Tiltakshaver)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Byggeadresse</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Byggeadresse)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Postnr</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Postnr)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Poststed</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Poststed)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Kommune</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Kommune)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Tlf. Mobil</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.TelefonMobile &&
                  formatPhoneNumber(
                    roomsData?.Prosjektdetaljer?.TelefonMobile
                  )) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Har kunden godkjent finansiering?
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.Finansiering)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Serie og leveransebeskrivelse
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Velg serie</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.VelgSerie)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Dato BoligPartner leveransebeskrivelse
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer
                  ?.DatoBoligPartnerLeveransebeskrivelse &&
                  formatDate(
                    roomsData?.Prosjektdetaljer
                      ?.DatoBoligPartnerLeveransebeskrivelse
                  )) ??
                  "-"}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Prosjekteringsunderlag
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Tegn.nummer</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.TegnNummer)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Signert 1:100 tegning datert
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.SignertDato &&
                  formatDate(roomsData?.Prosjektdetaljer?.SignertDato)) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Gjeldende 1:50 tegning datert
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.GjeldendeDato &&
                  formatDate(roomsData?.Prosjektdetaljer?.GjeldendeDato)) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Situasjonsplan (dato)
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.Situasjonsplan &&
                  formatDate(roomsData?.Prosjektdetaljer?.Situasjonsplan)) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Kalkyledato</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.Kalkyledato &&
                  formatDate(roomsData?.Prosjektdetaljer?.Kalkyledato)) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Type kalkyle</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.TypeKalkyle)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Leveransedetaljer
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Ønsket leveranseuke for første utkjøring
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Prosjektdetaljer
                    ?.ØnsketLeveranseukeForFørsteKtkjøring
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Takstoler leveres uke
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.TakstolerLeveresUke)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Vinduer leveres uke
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Prosjektdetaljer?.VinduerLeveresUke)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Vedlegg til kontrakt datert
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.VedleggTilKontraktDatert &&
                  formatDate(
                    roomsData?.Prosjektdetaljer?.VedleggTilKontraktDatert
                  )) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Bestillingsoversikt datert
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Prosjektdetaljer?.BestillingsoversiktDatert &&
                  formatDate(
                    roomsData?.Prosjektdetaljer?.BestillingsoversiktDatert
                  )) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til prosjekt- og leveransedetaljer
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Prosjektdetaljer
                    ?.KommentarProsjektLeveransedetaljer
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Grunnmur og pipe</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Type grunn og fundament
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.GrunnerOgSkorstein?.TypeGrunnFundament
                )}
              </p>
            </div>
            {roomsData?.GrunnerOgSkorstein?.TypeGrunnFundament ===
              "Sokkel/kjeller" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                  Type grunnmur
                </p>

                <p style={{ fontSize: "24px", color: "#101828" }}>
                  {displayValue(roomsData?.GrunnerOgSkorstein?.TypeGrunnmur)}
                </p>
              </div>
            )}
            {roomsData?.GrunnerOgSkorstein?.TypeGrunnmur === "Termomur" && (
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                  Detaljnummer for Termomur
                </p>

                <p style={{ fontSize: "24px", color: "#101828" }}>
                  {displayValue(roomsData?.GrunnerOgSkorstein?.detaljnummer)}
                </p>
              </div>
            )}
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Pipe og Ildsted
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skorstein type
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.GrunnerOgSkorstein?.SkorsteinType)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skorstein Enkel/Dobbel
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.GrunnerOgSkorstein?.SkorsteinEnkelDobbel
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skorstein Leveres av
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.GrunnerOgSkorstein?.SkorsteinLeveresAv
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Ildsted Type</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.GrunnerOgSkorstein?.SkorsteinType)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Ildsted leveres av
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.GrunnerOgSkorstein?.IldstedLeveresAv)}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Gulv OG bjelkelag</h4>
          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Bjelkelag mellom etasjer
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.GulvBjelkelagHimling?.BjelkelagMellomEtasjer
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til etasjeskiller
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.GulvBjelkelagHimling?.KommentarEtasjeskiller
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Bjelkelag forsterkes for påstøp i følgende rom
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.GulvBjelkelagHimling?.BjelkelagForsterkesFølgende
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Loft
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.GulvBjelkelagHimling?.Loft)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til loft
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.GulvBjelkelagHimling?.KommentarLoft)}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <h4 className="upperCaseHeading">Yttervegger</h4>
            <p style={{ fontSize: "20px", color: "#5d6b98" }}>
              Oppbygging på yttervegg leveres med standard 198+48mm
            </p>
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kledningstype
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Yttervegger?.kledningstype)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Skriv type</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Yttervegger?.kledningstypeText)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Overflater
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Yttervegger?.Overflater?.type)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskriv eventuelle leveransedetaljer til overflater
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Yttervegger?.Overflater?.colorCode)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Garasje
          </div>
          <div className="custom-grid">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                gridColumn: "span 4 / span 4",
              }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskriv eventuelle leveransedetaljer på kledningstype og farge
                som avviker fra husleveransen
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Yttervegger?.Garasje)}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            background: "#f9f9fb",
            padding: "0 16px 16px 16px",
          }}
        >
          <h4 className="upperCaseHeading">Tak og taktekking</h4>
          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Undertak
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.Undertak
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til undertak
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.KommentarUndertak
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Taktekking
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.Taktekking?.type
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskriv type og farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.Taktekking
                    ?.colorCode
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Takstein type
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinType
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Takstein kode
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinKode
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Takstein farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinFarge
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Takstein struktur
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinStruktur
                )}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "24px",
                color: "#30374f",
              }}
            >
              <label style={{ position: "relative" }}>
                <input
                  type="checkbox"
                  id="TakogTaktekkingTakogTaktekking?.HeisesPåTak"
                  checked={
                    roomsData?.TakogTaktekkingTakogTaktekking?.HeisesPåTak ||
                    false
                  }
                  readOnly
                  className="peer sr-only"
                />
                <div className="checkbox-box"></div>
                <div
                  className="checkmark"
                  style={{
                    display: roomsData?.TakogTaktekkingTakogTaktekking
                      ?.HeisesPåTak
                      ? "block"
                      : "none",
                  }}
                >
                  <svg
                    className="checkmark-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
              Heises på tak
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Tak Annet
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Snøfangere</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.Snøfangere
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Snøfangere farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.SnøfangereFarge
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Snøfangerkroker i grad
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking
                    ?.SnøfangerkrokerIGrad
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Gradrenner/beslag farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking
                    ?.GradrennerBeslagFarge
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Feieplatå</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.Feieplatå
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Avløpslufter</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TakogTaktekkingTakogTaktekking?.Avløpslufter
                )}
              </p>
            </div>
            <div
              style={{
                gridColumn: "span 4 / span 4",
                fontSize: "20px",
                color: "#5d6b98",
              }}
            >
              Ved innvendige nedløp må dette leveres av lokal rørlegger
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "16px" }}
          >
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
                            {index === 0 && roomIndex === 0 && (
                              <>
                                <h4 className="upperCaseHeading">
                                  Oppbygging innervegg
                                </h4>
                                <div className="custom-grid">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "6px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontSize: "20px",
                                        color: "#5d6b98",
                                      }}
                                    >
                                      Velg ett alternativ
                                    </p>

                                    <p
                                      style={{
                                        fontSize: "24px",
                                        color: "#101828",
                                      }}
                                    >
                                      {displayValue(
                                        roomsData?.Innervegger?.Innervegger
                                          ?.type
                                      )}
                                    </p>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      gap: "6px",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontSize: "20px",
                                        color: "#5d6b98",
                                      }}
                                    >
                                      Beskriv hvilke vegger dette gjelder
                                    </p>

                                    <p
                                      style={{
                                        fontSize: "24px",
                                        color: "#101828",
                                      }}
                                    >
                                      {displayValue(
                                        roomsData?.Innervegger?.Innervegger
                                          ?.colorCode
                                      )}
                                    </p>
                                  </div>
                                </div>
                                <div
                                  className="horizontal-divider"
                                  style={{ margin: "16px 0" }}
                                ></div>
                              </>
                            )}
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
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">DØRER</h4>
          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Inngangsdør
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Inngangsdør?.type)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Skriv kode</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Inngangsdør?.colorCode)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Dør</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Inngangsdør?.dør)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Dørfarge</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Inngangsdør?.Dørfarge)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Andre valg
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Utforing farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.UtforingFarge)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Slagretning tofløyet dør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.SlagretningTofløyetDør)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Sikkerhetslås type
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.SikkerhetslåsType)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Tilleggslås type
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.TilleggslåsType)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til inngangsdør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.KommentarInngangsdør)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}
            >
              Boddør
            </div>
            <div style={{ color: "#101828", fontSize: "20px" }}>
              Ikke relevant
            </div>
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Boddør?.type)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skriv fargekode
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Boddør?.colorCode)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Likelås med hoveddør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.LikelåsMedHoveddør)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til boddør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.KommentarBoddør)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <div
              style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}
            >
              Balkong/Terrassedør
            </div>
            <div style={{ color: "#101828", fontSize: "20px" }}>
              Standard hvitmalt utvendig/innvendig
            </div>
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.BalkongTerrassedør?.type
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Dørfarge</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.BalkongTerrassedør
                    ?.colorCode
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Utforing farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.UtforingFarge
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Slagretning tofløyet dør/skyveretning
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.SlagretningTofløyetDør
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Med terskelforing
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.MedTerskelforing
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Likelås med hoveddør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.LikelåsMedHoveddør
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Utvendig/innvendig sylinder
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør
                    ?.UtvendigInnvendigSylinder
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til balkongdør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.BalkongTerrassedør?.KommentarBalkongdør
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Innvendige Dører
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.InnvendigeDører?.InnvendigeDører?.type
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Dørfarge</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.InnvendigeDører?.InnvendigeDører?.colorCode
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Glassdør</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.InnvendigeDører?.Glassdør)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skyvedør med glass
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.InnvendigeDører?.SkyvedørMedGlass
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skyvedørskarm separat ordre
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Dører?.InnvendigeDører
                  ?.SkyvedørskarmSeparatOrdre &&
                  formatDate(
                    roomsData?.Dører?.InnvendigeDører?.SkyvedørskarmSeparatOrdre
                  )) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Utforing farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.InnvendigeDører?.UtforingFarge)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Slagretning tofløyet dør
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.InnvendigeDører?.SlagretningTofløyetDør
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Dempelister</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.InnvendigeDører?.Dempelister)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Terskeltype</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {roomsData?.Dører?.InnvendigeDører?.Terskeltype &&
                roomsData?.Dører?.InnvendigeDører?.Terskeltype.length > 0
                  ? roomsData?.Dører?.InnvendigeDører?.Terskeltype.join(", ")
                  : "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til terskeltype
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.InnvendigeDører?.TerskeltypeText
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Hengsler</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.InnvendigeDører?.Hengsler)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Spor for belegg
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.InnvendigeDører?.SporBelegg)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til innvendige dører
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.InnvendigeDører?.KommentarTilInnvendigeDører
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Dørvridere
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Dørvridere?.type)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Dører i kjellerrom
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.DørerKjellerrom?.type)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Garasjeport
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Garasjeport?.Garasjeport?.type)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                gridColumn: "span 3 / span 3",
              }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Beskriv her</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.Garasjeport?.Garasjeport?.colorCode
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Bredde x høyde
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Garasjeport?.BreddeXhøyde)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "24px",
                color: "#30374f",
              }}
            >
              <label style={{ position: "relative" }}>
                <input
                  type="checkbox"
                  id="Garasjeport.Portåpner"
                  checked={roomsData?.Dører?.Garasjeport?.Portåpner || false}
                  readOnly
                  className="peer sr-only"
                />
                <div className="checkbox-box"></div>
                <div
                  className="checkmark"
                  style={{
                    display: roomsData?.Dører?.Garasjeport?.Portåpner
                      ? "block"
                      : "none",
                  }}
                >
                  <svg
                    className="checkmark-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
              Portåpner
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Micro-sender antall
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Dører?.Garasjeport?.MicroSenderAntall)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Fargekode på garasjeport
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.Dører?.Garasjeport?.FargekodePåGarasjeport
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Vinduer</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.Vinduer?.type)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Skriv fargekode
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.Vinduer?.colorCode)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Alubeslått utvendig
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.AlubeslåttUtvendigText)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Utforing farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.UtforingFarge)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "24px",
                color: "#30374f",
              }}
            >
              <label style={{ position: "relative" }}>
                <input
                  type="checkbox"
                  id="Vinduer.VinduerNedTilGulv"
                  checked={roomsData?.Vinduer?.VinduerNedTilGulv || false}
                  readOnly
                  className="peer sr-only"
                />
                <div className="checkbox-box"></div>
                <div
                  className="checkmark"
                  style={{
                    display: roomsData?.Vinduer?.VinduerNedTilGulv
                      ? "block"
                      : "none",
                  }}
                >
                  <svg
                    className="checkmark-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
              Vinduer ned til gulv
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "24px",
                color: "#30374f",
              }}
            >
              <label style={{ position: "relative" }}>
                <input
                  type="checkbox"
                  id="Vinduer.HeltreUutforingPpristillegg"
                  checked={
                    roomsData?.Vinduer?.HeltreUutforingPpristillegg || false
                  }
                  readOnly
                  className="peer sr-only"
                />
                <div className="checkbox-box"></div>
                <div
                  className="checkmark"
                  style={{
                    display: roomsData?.Vinduer?.HeltreUutforingPpristillegg
                      ? "block"
                      : "none",
                  }}
                >
                  <svg
                    className="checkmark-icon"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </label>
              Heltre utforing (pristillegg)
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Foringer separat ordre
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {(roomsData?.Vinduer?.ForingerSeparatOrdre &&
                  formatDate(roomsData?.Vinduer?.ForingerSeparatOrdre)) ??
                  "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til vindu
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.KommentarVindu)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div className="flex gap-8">
            <div>
              <div
                style={{
                  color: "#101828",
                  marginBottom: "16px",
                  fontSize: "24px",
                  fontWeight: 500,
                }}
              >
                Valg om soldemping
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                  Ønsker soldemping i glass
                </p>

                <p style={{ fontSize: "24px", color: "#101828" }}>
                  {displayValue(roomsData?.Vinduer?.ØnskerSoldempingGlassText)}
                </p>
              </div>
            </div>
            <div>
              <div
                style={{
                  color: "#101828",
                  marginBottom: "16px",
                  fontSize: "24px",
                  fontWeight: 500,
                }}
              >
                Valg om screen
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                  Ønsker screens
                </p>

                <p style={{ fontSize: "24px", color: "#101828" }}>
                  {displayValue(roomsData?.Vinduer?.ØnskerScreensText)}
                </p>
              </div>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Takvindu Velux
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.TakvinduVelux?.type)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Utforing farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.TakvinduVeluxUtforingFarge)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til takvindu og eventuelt tilvalg
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Vinduer?.TakvinduVeluxKommentar)}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Trapp og Luker</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Trapp?.type)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskriv trappemodell
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Trapp?.colorCode)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Type trinn</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.TypeTrinn)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Opptrinn</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Opptrinn)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Sidevanger</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {roomsData?.TrappogLuker?.Sidevanger ?? "-"}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Rekkverk</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Rekkverk)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Håndlist</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Håndlist)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Spiler</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Spiler)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Bodløsning i trapperom
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.BodløsningTrapperom)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Montering</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Montering)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Måltaking</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.Måltaking)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Isolerte inspeksjonsluker
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TrappogLuker?.IsolerteInspeksjonsluker
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Himling</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.HimlingText)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Vegg</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TrappogLuker?.VeggText)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til inspeksjonsluker
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TrappogLuker?.KommentarInspeksjonsluker
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Balkong & Terrasse</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Velg ett alternativ
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.Rekkverk?.type)}
              </p>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                gridColumn: "span 3 / span 3",
              }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskriv type, modell og farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.Rekkverk?.colorCode)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Ønsker megler
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.ØnskerMeglerText)}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Velg gulv balkong
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.BalkongTerrasse?.VelgGulvBalkong?.type
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskriv type og farge
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.BalkongTerrasse?.VelgGulvBalkong?.colorCode
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Platting
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Ønsker platting?
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.ØnskerPlatting)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Beskrivelse platting
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.BeskrivelsePlatting)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Fotskraperist
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.Fotskraperist)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til balkong og terrasse
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.BalkongTerrasse?.KommentarTerrasse)}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Ventilasjon og Sentralstøvsuger</h4>
          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Ventilasjon
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "24px",
              color: "#30374f",
            }}
          >
            <label style={{ position: "relative" }}>
              <input
                type="checkbox"
                id="VentilasjonSentralstøvsuger?.Ventilasjon"
                checked={
                  roomsData?.VentilasjonSentralstøvsuger?.Ventilasjon || false
                }
                readOnly
                className="peer sr-only"
              />
              <div className="checkbox-box"></div>
              <div
                className="checkmark"
                style={{
                  display: roomsData?.VentilasjonSentralstøvsuger?.Ventilasjon
                    ? "block"
                    : "none",
                }}
              >
                <svg
                  className="checkmark-icon"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </label>
            Ikke relevant
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Fargeønske utvendig kombirist
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger
                    ?.FargeønskeUtvendigKombirist
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Fargeønske innvendig ventiler
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger
                    ?.FargeønskeInnvendigVentiler
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til ventilasjon
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger?.KommentarVentilasjon
                )}
              </p>
            </div>
          </div>
          <div className="horizontal-divider"></div>

          <div style={{ fontWeight: 500, fontSize: "24px", color: "#101828" }}>
            Sentralstøvsuger
          </div>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger?.Sentralstøvsuger
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Antall sugekontakter
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger?.AntallKontakter
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>Sugebrett</p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger?.Sugebrett
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til sentralstøvsuger
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.VentilasjonSentralstøvsuger?.Kommentar
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Brannvern</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Brannvern?.Brannvern)}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Kommentar til brannvern
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.Brannvern?.BrannvernKommentar)}
              </p>
            </div>
          </div>
        </div>
        <div className="horizontal-divider"></div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <h4 className="upperCaseHeading">Tekniske Installasjoner</h4>
          <div className="custom-grid">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(
                  roomsData?.TekniskeInstallasjoner?.TekniskeInstallasjoner
                )}
              </p>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "6px" }}
            >
              <p style={{ fontSize: "20px", color: "#5d6b98" }}>
                Punkt (referanse)
              </p>

              <p style={{ fontSize: "24px", color: "#101828" }}>
                {displayValue(roomsData?.TekniskeInstallasjoner?.Punkt)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
