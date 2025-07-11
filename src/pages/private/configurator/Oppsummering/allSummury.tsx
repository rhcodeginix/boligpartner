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
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            PROSJEKTDETALJER
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Type prosjekt</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.TypeProsjekt)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kundenr</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Kundenr)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Tiltakshaver</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Tiltakshaver)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Byggeadresse</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Byggeadresse)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Postnr</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Postnr)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Poststed</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Poststed)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kommune</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Kommune)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Tlf. Mobil</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.TelefonMobile &&
                    formatPhoneNumber(
                      roomsData?.Prosjektdetaljer?.TelefonMobile
                    )) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Har kunden godkjent finansiering?
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.Finansiering)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Serie og leveransebeskrivelse
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg serie</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.VelgSerie)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Dato BoligPartner leveransebeskrivelse
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer
                    ?.DatoBoligPartnerLeveransebeskrivelse &&
                    formatDate(
                      roomsData?.Prosjektdetaljer
                        ?.DatoBoligPartnerLeveransebeskrivelse
                    )) ??
                    "-"}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Prosjekteringsunderlag
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Tegn.nummer</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.TegnNummer)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Signert 1:100 tegning datert
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.SignertDato &&
                    formatDate(roomsData?.Prosjektdetaljer?.SignertDato)) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Gjeldende 1:50 tegning datert
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.GjeldendeDato &&
                    formatDate(roomsData?.Prosjektdetaljer?.GjeldendeDato)) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Situasjonsplan (dato)
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.Situasjonsplan &&
                    formatDate(roomsData?.Prosjektdetaljer?.Situasjonsplan)) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kalkyledato</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.Kalkyledato &&
                    formatDate(roomsData?.Prosjektdetaljer?.Kalkyledato)) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Type kalkyle</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.TypeKalkyle)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Leveransedetaljer
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Ønsket leveranseuke for første utkjøring
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Prosjektdetaljer
                      ?.ØnsketLeveranseukeForFørsteKtkjøring
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Takstoler leveres uke
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Prosjektdetaljer?.TakstolerLeveresUke
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Vinduer leveres uke</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Prosjektdetaljer?.VinduerLeveresUke)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Vedlegg til kontrakt datert
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.VedleggTilKontraktDatert &&
                    formatDate(
                      roomsData?.Prosjektdetaljer?.VedleggTilKontraktDatert
                    )) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Bestillingsoversikt datert
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Prosjektdetaljer?.BestillingsoversiktDatert &&
                    formatDate(
                      roomsData?.Prosjektdetaljer?.BestillingsoversiktDatert
                    )) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til prosjekt- og leveransedetaljer
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Prosjektdetaljer
                      ?.KommentarProsjektLeveransedetaljer
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Grunnmur og pipe
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Type grunn og fundament
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GrunnerOgSkorstein?.TypeGrunnFundament
                  )}
                </p>
              )}
            </div>
            {roomsData?.GrunnerOgSkorstein?.TypeGrunnFundament ===
              "Sokkel/kjeller" && (
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-base">Type grunnmur</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-lg">
                    {displayValue(roomsData?.GrunnerOgSkorstein?.TypeGrunnmur)}
                  </p>
                )}
              </div>
            )}
            {roomsData?.GrunnerOgSkorstein?.TypeGrunnmur === "Termomur" && (
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-base">
                    Detaljnummer for Termomur
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-lg">
                    {displayValue(roomsData?.GrunnerOgSkorstein?.detaljnummer)}
                  </p>
                )}
              </div>
            )}
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Pipe og Ildsted
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skorstein type</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.GrunnerOgSkorstein?.SkorsteinType)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Skorstein Enkel/Dobbel
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GrunnerOgSkorstein?.SkorsteinEnkelDobbel
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skorstein Leveres av</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GrunnerOgSkorstein?.SkorsteinLeveresAv
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Ildsted Type</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.GrunnerOgSkorstein?.SkorsteinType)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Ildsted leveres av</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GrunnerOgSkorstein?.IldstedLeveresAv
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Gulv OG bjelkelag
          </h4>
          <div className="text-darkBlack font-medium text-lg">
            Bjelkelag mellom etasjer
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GulvBjelkelagHimling?.BjelkelagMellomEtasjer
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til etasjeskiller
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GulvBjelkelagHimling?.KommentarEtasjeskiller
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Bjelkelag forsterkes for påstøp i følgende rom
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.GulvBjelkelagHimling?.BjelkelagForsterkesFølgende
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Loft</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.GulvBjelkelagHimling?.Loft)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kommentar til loft</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.GulvBjelkelagHimling?.KommentarLoft)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <div className="flex flex-col gap-1">
            <h4 className="text-darkBlack font-bold text-xl uppercase">
              Yttervegger
            </h4>
            <p className="text-secondary text-base">
              Oppbygging på yttervegg leveres med standard 198+48mm
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kledningstype</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Yttervegger?.kledningstype)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skriv type</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Yttervegger?.kledningstypeText)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Overflater</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Yttervegger?.Overflater?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Beskriv eventuelle leveransedetaljer til overflater
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Yttervegger?.Overflater?.colorCode)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Garasje</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5 col-span-4">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Beskriv eventuelle leveransedetaljer på kledningstype og farge
                  som avviker fra husleveransen
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Yttervegger?.Garasje)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Tak og taktekking
          </h4>
          <div className="text-darkBlack font-medium text-lg">Undertak</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.Undertak
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til undertak
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.KommentarUndertak
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Taktekking</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.Taktekking?.type
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Beskriv type og farge
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.Taktekking
                      ?.colorCode
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Takstein type</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinType
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Takstein kode</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinKode
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Takstein farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinFarge
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Takstein struktur</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.TaksteinStruktur
                  )}
                </p>
              )}
            </div>
            <div className={`text-lg flex gap-2 items-center text-black`}>
              <label className="relative">
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
                <div className="w-5 h-5 border-2 border-[#444CE7] rounded-sm"></div>
                <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                  <svg
                    className="w-4 h-4 text-[#444CE7]"
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
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Tak Annet</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Snøfangere</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.Snøfangere
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Snøfangere farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.SnøfangereFarge
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Snøfangerkroker i grad
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking
                      ?.SnøfangerkrokerIGrad
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Gradrenner/beslag farge
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking
                      ?.GradrennerBeslagFarge
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Feieplatå</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.Feieplatå
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Avløpslufter</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TakogTaktekkingTakogTaktekking?.Avløpslufter
                  )}
                </p>
              )}
            </div>
            <div className="text-secondary text-base col-span-4">
              Ved innvendige nedløp må dette leveres av lokal rørlegger
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
            {rooms &&
              rooms.length > 0 &&
              rooms.map((room: any, roomIndex: number) => (
                <div key={roomIndex}>
                  <div className="flex flex-col gap-4">
                    {room.rooms &&
                      room.rooms.length > 0 &&
                      room.rooms.map((innerRoom: any, index: number) => {
                        return (
                          <div key={index} className="inner-room-block px-8">
                            {index === 0 && roomIndex === 0 && (
                              <>
                                <h4 className="text-darkBlack font-bold text-xl uppercase">
                                  Oppbygging innervegg
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    {loading ? (
                                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                                    ) : (
                                      <p className="text-secondary text-base">
                                        Velg ett alternativ
                                      </p>
                                    )}
                                    {loading ? (
                                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                                    ) : (
                                      <p className="text-darkBlack text-lg">
                                        {displayValue(
                                          roomsData?.Innervegger?.Innervegger
                                            ?.type
                                        )}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    {loading ? (
                                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                                    ) : (
                                      <p className="text-secondary text-base">
                                        Beskriv hvilke vegger dette gjelder
                                      </p>
                                    )}
                                    {loading ? (
                                      <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                                    ) : (
                                      <p className="text-darkBlack text-lg">
                                        {displayValue(
                                          roomsData?.Innervegger?.Innervegger
                                            ?.colorCode
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="border-t border-[#EBEBEB] w-full my-4"></div>
                              </>
                            )}
                            {index === 0 && (
                              <h3 className="mb-4 text-darkBlack text-lg font-medium">
                                {room?.title}
                              </h3>
                            )}
                            <div className="flex flex-col gap-3 bg-gray3 p-4 rounded-lg">
                              <div className="text-black font-semibold text-lg">
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
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 lg:gap-4">
                                      {allSelectedProducts.map(
                                        (prod: any, prodIndex: number) => {
                                          return (
                                            <div
                                              key={prodIndex}
                                              className="flex gap-2 items-center"
                                            >
                                              {/* {prod?.Hovedbilde?.[0] ? (
                                                <div className="w-[100px]">
                                                  <img
                                                    src={`${prod?.Hovedbilde?.[0]}`}
                                                    alt="floor"
                                                    className="w-[100px] h-[76px] border border-[#EFF1F5] rounded-[4px]"
                                                  />
                                                </div>
                                              ) : (
                                                // <div className="w-[100px] h-[76px] bg-[#EFF1F5] rounded-[4px]"></div>
                                                <div className="w-[100px]">
                                                  <img
                                                    src={
                                                      "https://firebasestorage.googleapis.com/v0/b/l-plot.firebasestorage.app/o/images%2F1750687902123_Boligpartner%20(1).png?alt=media&token=42303718-f3a6-4b4d-a1c6-2b948e5df40a"
                                                    }
                                                    alt="floor"
                                                    className="w-[100px] h-[76px] border border-[#EFF1F5] rounded-[4px]"
                                                  />
                                                </div>
                                              )} */}
                                              <div>
                                                <h4 className="text-lg font-medium text-black mb-0.5">
                                                  {prod.categoryName}
                                                </h4>
                                                <h3 className="text-secondary">
                                                  {prod?.Produktnavn}{" "}
                                                  {prod?.customText && (
                                                    <span className="text-darkBlack">
                                                      ({prod?.customText})
                                                    </span>
                                                  )}
                                                </h3>
                                                <div className="text-darkBlack mt-0.5 text-base">
                                                  {prod.comment}
                                                </div>
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
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">DØRER</h4>
          <div className="text-darkBlack font-medium text-lg">Inngangsdør</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Inngangsdør?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skriv kode</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Inngangsdør?.colorCode)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Dør</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Inngangsdør?.dør)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Dørfarge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Inngangsdør?.Dørfarge)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Andre valg</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Utforing farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.UtforingFarge)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Slagretning tofløyet dør
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.SlagretningTofløyetDør)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Sikkerhetslås type</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.SikkerhetslåsType)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Tilleggslås type</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.TilleggslåsType)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til inngangsdør
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.KommentarInngangsdør)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-1">
            <div className="text-darkBlack font-medium text-lg">Boddør</div>
            <div className="text-darkBlack text-base">Ikke relevant</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Boddør?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skriv fargekode</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Boddør?.colorCode)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Likelås med hoveddør</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.LikelåsMedHoveddør)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kommentar til boddør</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.KommentarBoddør)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-1">
            <div className="text-darkBlack font-medium text-lg">
              Balkong/Terrassedør
            </div>
            <div className="text-darkBlack text-base">
              Standard hvitmalt utvendig/innvendig
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.BalkongTerrassedør
                      ?.type
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Dørfarge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.BalkongTerrassedør
                      ?.colorCode
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Utforing farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.UtforingFarge
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Slagretning tofløyet dør/skyveretning
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.SlagretningTofløyetDør
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Med terskelforing</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.MedTerskelforing
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Likelås med hoveddør</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.LikelåsMedHoveddør
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Utvendig/innvendig sylinder
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør
                      ?.UtvendigInnvendigSylinder
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til balkongdør
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.BalkongTerrassedør?.KommentarBalkongdør
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Innvendige Dører
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører?.InnvendigeDører?.type
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Dørfarge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører?.InnvendigeDører
                      ?.colorCode
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Glassdør</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.InnvendigeDører?.Glassdør)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skyvedør med glass</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører?.SkyvedørMedGlass
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Skyvedørskarm separat ordre
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Dører?.InnvendigeDører
                    ?.SkyvedørskarmSeparatOrdre &&
                    formatDate(
                      roomsData?.Dører?.InnvendigeDører
                        ?.SkyvedørskarmSeparatOrdre
                    )) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Utforing farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører?.UtforingFarge
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Slagretning tofløyet dør
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører?.SlagretningTofløyetDør
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Dempelister</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.InnvendigeDører?.Dempelister)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Terskeltype</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {roomsData?.Dører?.InnvendigeDører?.Terskeltype &&
                  roomsData?.Dører?.InnvendigeDører?.Terskeltype.length > 0
                    ? roomsData?.Dører?.InnvendigeDører?.Terskeltype.join(", ")
                    : "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til terskeltype
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører?.TerskeltypeText
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Hengsler</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.InnvendigeDører?.Hengsler)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Spor for belegg</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.InnvendigeDører?.SporBelegg)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til innvendige dører
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.InnvendigeDører
                      ?.KommentarTilInnvendigeDører
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Dørvridere</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Dørvridere?.type)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Dører i kjellerrom
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.DørerKjellerrom?.type)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Garasjeport</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.Garasjeport?.Garasjeport?.type
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 col-span-3">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Beskriv her</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.Garasjeport?.Garasjeport?.colorCode
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Bredde x høyde</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Dører?.Garasjeport?.BreddeXhøyde)}
                </p>
              )}
            </div>
            <div className={`text-lg flex gap-2 items-center text-black`}>
              <label className="relative">
                <input
                  type="checkbox"
                  id="Garasjeport.Portåpner"
                  checked={roomsData?.Dører?.Garasjeport?.Portåpner || false}
                  readOnly
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-[#444CE7] rounded-sm"></div>
                <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                  <svg
                    className="w-4 h-4 text-[#444CE7]"
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
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Micro-sender antall</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.Garasjeport?.MicroSenderAntall
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Fargekode på garasjeport
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.Dører?.Garasjeport?.FargekodePåGarasjeport
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Vinduer
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.Vinduer?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Skriv fargekode</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.Vinduer?.colorCode)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Alubeslått utvendig</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.AlubeslåttUtvendigText)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Utforing farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.UtforingFarge)}
                </p>
              )}
            </div>
            <div className={`text-lg flex gap-2 items-center text-black`}>
              <label className="relative">
                <input
                  type="checkbox"
                  id="Vinduer.VinduerNedTilGulv"
                  checked={roomsData?.Vinduer?.VinduerNedTilGulv || false}
                  readOnly
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-[#444CE7] rounded-sm"></div>
                <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                  <svg
                    className="w-4 h-4 text-[#444CE7]"
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
            <div className={`text-lg flex gap-2 items-center text-black`}>
              <label className="relative">
                <input
                  type="checkbox"
                  id="Vinduer.HeltreUutforingPpristillegg"
                  checked={
                    roomsData?.Vinduer?.HeltreUutforingPpristillegg || false
                  }
                  readOnly
                  className="peer sr-only"
                />
                <div className="w-5 h-5 border-2 border-[#444CE7] rounded-sm"></div>
                <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                  <svg
                    className="w-4 h-4 text-[#444CE7]"
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
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Foringer separat ordre
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {(roomsData?.Vinduer?.ForingerSeparatOrdre &&
                    formatDate(roomsData?.Vinduer?.ForingerSeparatOrdre)) ??
                    "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Kommentar til vindu</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.KommentarVindu)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex gap-8">
            <div>
              <div className="text-darkBlack font-medium text-lg mb-4">
                Valg om soldemping
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-base">
                    Ønsker soldemping i glass
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-lg">
                    {displayValue(
                      roomsData?.Vinduer?.ØnskerSoldempingGlassText
                    )}
                  </p>
                )}
              </div>
            </div>
            <div>
              <div className="text-darkBlack font-medium text-lg mb-4">
                Valg om screen
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-base">Ønsker screens</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-lg">
                    {displayValue(roomsData?.Vinduer?.ØnskerScreensText)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Takvindu Velux
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.TakvinduVelux?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Utforing farge</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.TakvinduVeluxUtforingFarge)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til takvindu og eventuelt tilvalg
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Vinduer?.TakvinduVeluxKommentar)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Trapp og Luker
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Trapp?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Beskriv trappemodell</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Trapp?.colorCode)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Type trinn</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.TypeTrinn)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Opptrinn</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Opptrinn)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Sidevanger</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {roomsData?.TrappogLuker?.Sidevanger ?? "-"}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Rekkverk</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Rekkverk)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Håndlist</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Håndlist)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Spiler</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Spiler)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Bodløsning i trapperom
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.BodløsningTrapperom)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Montering</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Montering)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Måltaking</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.Måltaking)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Isolerte inspeksjonsluker
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TrappogLuker?.IsolerteInspeksjonsluker
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Himling</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.HimlingText)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Vegg</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TrappogLuker?.VeggText)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til inspeksjonsluker
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TrappogLuker?.KommentarInspeksjonsluker
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Balkong & Terrasse
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Velg ett alternativ</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.BalkongTerrasse?.Rekkverk?.type)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 col-span-3">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Beskriv type, modell og farge
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.BalkongTerrasse?.Rekkverk?.colorCode
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Ønsker megler</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.BalkongTerrasse?.ØnskerMeglerText)}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Velg gulv balkong
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.BalkongTerrasse?.VelgGulvBalkong?.type
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Beskriv type og farge
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.BalkongTerrasse?.VelgGulvBalkong?.colorCode
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">Platting</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Ønsker platting?</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.BalkongTerrasse?.ØnskerPlatting)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Beskrivelse platting</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.BalkongTerrasse?.BeskrivelsePlatting
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Fotskraperist</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.BalkongTerrasse?.Fotskraperist)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til balkong og terrasse
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.BalkongTerrasse?.KommentarTerrasse)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Ventilasjon og Sentralstøvsuger
          </h4>
          <div className="text-darkBlack font-medium text-lg">Ventilasjon</div>
          <div className={`text-lg flex gap-2 items-center text-black`}>
            <label className="relative">
              <input
                type="checkbox"
                id="VentilasjonSentralstøvsuger?.Ventilasjon"
                checked={
                  roomsData?.VentilasjonSentralstøvsuger?.Ventilasjon || false
                }
                readOnly
                className="peer sr-only"
              />
              <div className="w-5 h-5 border-2 border-[#444CE7] rounded-sm"></div>
              <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                <svg
                  className="w-4 h-4 text-[#444CE7]"
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
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Fargeønske utvendig kombirist
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger
                      ?.FargeønskeUtvendigKombirist
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Fargeønske innvendig ventiler
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger
                      ?.FargeønskeInnvendigVentiler
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til ventilasjon
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger?.KommentarVentilasjon
                  )}
                </p>
              )}
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="text-darkBlack font-medium text-lg">
            Sentralstøvsuger
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger?.Sentralstøvsuger
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Antall sugekontakter</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger?.AntallKontakter
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Sugebrett</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger?.Sugebrett
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til sentralstøvsuger
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.VentilasjonSentralstøvsuger?.Kommentar
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Brannvern
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Brannvern?.Brannvern)}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">
                  Kommentar til brannvern
                </p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.Brannvern?.BrannvernKommentar)}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="border-t border-[#EBEBEB] w-full"></div>
        <div className="flex flex-col gap-4 inner-room-block px-8">
          <h4 className="text-darkBlack font-bold text-xl uppercase">
            Tekniske Installasjoner
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(
                    roomsData?.TekniskeInstallasjoner?.TekniskeInstallasjoner
                  )}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-secondary text-base">Punkt (referanse)</p>
              )}
              {loading ? (
                <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
              ) : (
                <p className="text-darkBlack text-lg">
                  {displayValue(roomsData?.TekniskeInstallasjoner?.Punkt)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
