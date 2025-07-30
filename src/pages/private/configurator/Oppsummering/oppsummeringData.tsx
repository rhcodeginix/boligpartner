import React, { useState } from "react";
import Button from "../../../../components/common/button";
import Drawer from "../../../../components/ui/drawer";
import { X } from "lucide-react";
import { AddFinalSubmission } from "./AddFinalSubmission";
import { useNavigate } from "react-router-dom";
import { displayValue, formatDate } from "./allSummury";
import { formatPhoneNumber } from "./exportView";

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
      <div className="px-4 md:px-6 py-6 md:py-8 mb-[120px]">
        <div className="bg-gray3 border border-[#EFF1F5] rounded-lg p-1.5 md:p-2 flex items-center gap-2 mb-5 md:mb-8">
          <div
            className={`w-max py-2 px-3 rounded-lg bg-white text-purple font-semibold text-sm md:text-base`}
            style={{
              boxShadow: "0px 1px 2px 0px #1018280D",
            }}
          >
            Oppsummering
          </div>
        </div>
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              PROSJEKTDETALJER
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Type prosjekt</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.TypeProsjekt)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">BP prosjektnummer</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Kundenr)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Tiltakshaver</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Tiltakshaver)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Byggeadresse</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Byggeadresse)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Postnr</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Postnr)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Poststed</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Poststed)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Kommune</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Kommune)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Tlf. Mobil</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Har kunden godkjent finansiering?
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.Finansiering)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Serie og leveransebeskrivelse
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg serie</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.VelgSerie)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Dato BoligPartner leveransebeskrivelse
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
            <div className="text-darkBlack font-medium text-sm">
              Prosjekteringsunderlag
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Tegn.nummer</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.TegnNummer)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Signert 1:100 tegning datert
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Gjeldende 1:50 tegning datert
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Situasjonsplan (dato)
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {(roomsData?.Prosjektdetaljer?.Situasjonsplan &&
                      formatDate(
                        roomsData?.Prosjektdetaljer?.Situasjonsplan
                      )) ??
                      "-"}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Kalkyledato</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Type kalkyle</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Prosjektdetaljer?.TypeKalkyle)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Leveransedetaljer
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Ønsket leveranseuke for første utkjøring
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Takstoler leveres uke
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Vinduer leveres uke</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Prosjektdetaljer?.VinduerLeveresUke
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Vedlegg til kontrakt datert
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Bestillingsoversikt datert
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Kommentar til prosjekt- og leveransedetaljer
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Grunnmur og pipe
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Type grunn og fundament
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                    <p className="text-secondary text-xs">Type grunnmur</p>
                  )}
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-darkBlack text-sm">
                      {displayValue(
                        roomsData?.GrunnerOgSkorstein?.TypeGrunnmur
                      )}
                    </p>
                  )}
                </div>
              )}
              {roomsData?.GrunnerOgSkorstein?.TypeGrunnmur === "Termomur" && (
                <div className="flex flex-col gap-1.5">
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-secondary text-xs">
                      Detaljnummer for Termomur
                    </p>
                  )}
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-darkBlack text-sm">
                      {displayValue(
                        roomsData?.GrunnerOgSkorstein?.detaljnummer
                      )}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Pipe og Ildsted
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Skorstein type</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.GrunnerOgSkorstein?.SkorsteinType)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Skorstein Enkel/Dobbel
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Skorstein Leveres av</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Ildsted Type</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.GrunnerOgSkorstein?.SkorsteinType)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Ildsted leveres av</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.GrunnerOgSkorstein?.IldstedLeveresAv
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Gulv og bjelkelag
            </h4>
            <div className="text-darkBlack font-medium text-sm">
              Bjelkelag mellom etasjer
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Kommentar til etasjeskiller
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Bjelkelag forsterkes for påstøp i følgende rom
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.GulvBjelkelagHimling
                        ?.BjelkelagForsterkesFølgende
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Loft</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.GulvBjelkelagHimling?.Loft)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Kommentar til loft</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.GulvBjelkelagHimling?.KommentarLoft
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <h4 className="text-darkBlack font-bold text-base uppercase">
                Yttervegger
              </h4>
              <p className="text-secondary text-xs">
                Oppbygging på yttervegg leveres med standard 198+48mm
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Kledningstype</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Yttervegger?.kledningstype)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Skriv type</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Yttervegger?.kledningstypeText)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Overflater</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Yttervegger?.Overflater?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Beskriv eventuelle leveransedetaljer til overflater
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Yttervegger?.Overflater?.colorCode
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Garasje</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5 col-span-4">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Beskriv eventuelle leveransedetaljer på kledningstype og
                    farge som avviker fra husleveransen
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Yttervegger?.Garasje)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Tak og taktekking
            </h4>
            <div className="text-darkBlack font-medium text-sm">Undertak</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Kommentar til undertak
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.TakogTaktekkingTakogTaktekking
                        ?.KommentarUndertak
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Taktekking</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.TakogTaktekkingTakogTaktekking?.Taktekking
                        ?.type
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Beskriv type og farge
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Takstein type</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Takstein kode</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Takstein farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Takstein struktur</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.TakogTaktekkingTakogTaktekking
                        ?.TaksteinStruktur
                    )}
                  </p>
                )}
              </div>
              <div className={`text-sm flex gap-2 items-center text-black`}>
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
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-[#444CE7] rounded-sm"></div>
                  <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4 text-[#444CE7]"
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
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Tak Annet</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Snøfangere</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Snøfangere farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Snøfangerkroker i grad
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Gradrenner/beslag farge
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Feieplatå</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Avløpslufter</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.TakogTaktekkingTakogTaktekking?.Avløpslufter
                    )}
                  </p>
                )}
              </div>
              <div className="text-secondary text-xs col-span-4">
                Ved innvendige nedløp må dette leveres av lokal rørlegger
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Oppbygging innervegg
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Innervegger?.Innervegger?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Beskriv hvilke vegger dette gjelder
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Innervegger?.Innervegger?.colorCode
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="flex flex-col gap-4 md:gap-6">
              {rooms &&
                rooms.length > 0 &&
                rooms.map((room: any, roomIndex: number) => (
                  <div key={roomIndex}>
                    <div className="flex flex-col gap-4">
                      {room.rooms &&
                        room.rooms.length > 0 &&
                        room.rooms.map((innerRoom: any, index: number) => {
                          return (
                            <div key={index} className="inner-room-block">
                              {index === 0 && (
                                <h3 className="mb-4 text-darkBlack text-sm font-medium">
                                  {room?.title}
                                </h3>
                              )}
                              <div className="flex flex-col gap-3 bg-gray3 p-3 md:p-4 rounded-lg">
                                <div className="text-black font-semibold text-sm">
                                  {innerRoom?.name_no || innerRoom?.name}
                                </div>
                                {innerRoom?.Kategorinavn &&
                                  innerRoom.Kategorinavn.length > 0 &&
                                  (() => {
                                    const allSelectedProducts: any[] = [];
                                    innerRoom.Kategorinavn.filter(
                                      (kat: any) =>
                                        kat.productOptions !== "Text"
                                    ).forEach((kat: any) => {
                                      kat?.produkter
                                        ?.filter(
                                          (prod: any) =>
                                            prod?.isSelected === true
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
                                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 lg:gap-4">
                                        {allSelectedProducts.map(
                                          (prod: any, prodIndex: number) => {
                                            return (
                                              <div
                                                key={prodIndex}
                                                className="flex flex-col"
                                              >
                                                <div>
                                                  <h4 className="text-sm font-medium text-secondary mb-0.5">
                                                    {prod.categoryName}
                                                  </h4>
                                                  <h3 className="text-darkBlack">
                                                    {prod?.Produktnavn}{" "}
                                                    {prod?.customText && (
                                                      <span className="text-darkBlack">
                                                        ({prod?.customText})
                                                      </span>
                                                    )}
                                                  </h3>
                                                  <div className="text-darkBlack mt-0.5 text-sm">
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
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              DØRER
            </h4>
            <div className="text-darkBlack font-medium text-sm">
              Inngangsdør
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Inngangsdør?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Skriv kode</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Inngangsdør?.colorCode)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Dør</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Inngangsdør?.dør)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Dørfarge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Inngangsdør?.Dørfarge)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Andre valg</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Utforing farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.UtforingFarge)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Slagretning tofløyet dør
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.SlagretningTofløyetDør)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Sikkerhetslås type</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.SikkerhetslåsType)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Tilleggslås type</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.TilleggslåsType)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til inngangsdør
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.KommentarInngangsdør)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="flex flex-col gap-1">
              <div className="text-darkBlack font-medium text-sm">Boddør</div>
              <div className="text-darkBlack text-xs">Ikke relevant</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Boddør?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Skriv fargekode</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Boddør?.colorCode)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Likelås med hoveddør</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.LikelåsMedHoveddør)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Kommentar til boddør</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.KommentarBoddør)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="flex flex-col gap-1">
              <div className="text-darkBlack font-medium text-sm">
                Balkong/Terrassedør
              </div>
              <div className="text-darkBlack text-xs">
                Standard hvitmalt utvendig/innvendig
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Dørfarge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Utforing farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Slagretning tofløyet dør/skyveretning
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Dører?.BalkongTerrassedør
                        ?.SlagretningTofløyetDør
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Med terskelforing</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Likelås med hoveddør</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Utvendig/innvendig sylinder
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Kommentar til balkongdør
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Dører?.BalkongTerrassedør?.KommentarBalkongdør
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Innvendige Dører
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Dørfarge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Glassdør</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.InnvendigeDører?.Glassdør)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Skyvedør med glass</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Skyvedørskarm separat ordre
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Utforing farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Slagretning tofløyet dør
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Dempelister</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Dører?.InnvendigeDører?.Dempelister
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Terskeltype</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {roomsData?.Dører?.InnvendigeDører?.Terskeltype &&
                    roomsData?.Dører?.InnvendigeDører?.Terskeltype.length > 0
                      ? roomsData?.Dører?.InnvendigeDører?.Terskeltype.join(
                          ", "
                        )
                      : "-"}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til terskeltype
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Hengsler</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.InnvendigeDører?.Hengsler)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Spor for belegg</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Dører?.InnvendigeDører?.SporBelegg
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til innvendige dører
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Dører?.InnvendigeDører
                        ?.KommentarTilInnvendigeDører
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Dørvridere</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Dørvridere?.type)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Dører i kjellerrom
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.DørerKjellerrom?.type)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Garasjeport
            </div>
            <div className="flex flex-col sm:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Beskriv her</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Bredde x høyde</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Dører?.Garasjeport?.BreddeXhøyde)}
                  </p>
                )}
              </div>
              <div className={`text-sm flex gap-2 items-center text-black`}>
                <label className="relative">
                  <input
                    type="checkbox"
                    id="Garasjeport.Portåpner"
                    checked={roomsData?.Dører?.Garasjeport?.Portåpner || false}
                    readOnly
                    className="peer sr-only"
                  />
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-[#444CE7] rounded-sm"></div>
                  <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4 text-[#444CE7]"
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
                  <p className="text-secondary text-xs">Micro-sender antall</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Fargekode på garasjeport
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Dører?.Garasjeport?.FargekodePåGarasjeport
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Vinduer
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.Vinduer?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Skriv fargekode</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.Vinduer?.colorCode)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Alubeslått utvendig</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.AlubeslåttUtvendigText)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Utforing farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.UtforingFarge)}
                  </p>
                )}
              </div>
              <div className={`text-sm flex gap-2 items-center text-black`}>
                <label className="relative">
                  <input
                    type="checkbox"
                    id="Vinduer.VinduerNedTilGulv"
                    checked={roomsData?.Vinduer?.VinduerNedTilGulv || false}
                    readOnly
                    className="peer sr-only"
                  />
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-[#444CE7] rounded-sm"></div>
                  <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4 text-[#444CE7]"
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
              <div className={`text-sm flex gap-2 items-center text-black`}>
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
                  <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-[#444CE7] rounded-sm"></div>
                  <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                    <svg
                      className="w-3 md:w-4 h-3 md:h-4 text-[#444CE7]"
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
                  <p className="text-secondary text-xs">
                    Foringer separat ordre
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Kommentar til vindu</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.KommentarVindu)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="flex gap-8">
              <div>
                <div className="text-darkBlack font-medium text-sm mb-4">
                  Valg om soldemping
                </div>
                <div className="flex flex-col gap-1.5">
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-secondary text-xs">
                      Ønsker soldemping i glass
                    </p>
                  )}
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-darkBlack text-sm">
                      {displayValue(
                        roomsData?.Vinduer?.ØnskerSoldempingGlassText
                      )}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <div className="text-darkBlack font-medium text-sm mb-4">
                  Valg om screen
                </div>
                <div className="flex flex-col gap-1.5">
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-secondary text-xs">Ønsker screens</p>
                  )}
                  {loading ? (
                    <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                  ) : (
                    <p className="text-darkBlack text-sm">
                      {displayValue(roomsData?.Vinduer?.ØnskerScreensText)}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Takvindu Velux
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.TakvinduVelux?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Utforing farge</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.Vinduer?.TakvinduVeluxUtforingFarge
                    )}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til takvindu og eventuelt tilvalg
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Vinduer?.TakvinduVeluxKommentar)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Trapp og Luker
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Trapp?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Beskriv trappemodell</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Trapp?.colorCode)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Type trinn</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.TypeTrinn)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Opptrinn</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Opptrinn)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Sidevanger</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {roomsData?.TrappogLuker?.Sidevanger ?? "-"}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Rekkverk</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Rekkverk)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Håndlist</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Håndlist)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Spiler</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Spiler)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Bodløsning i trapperom
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.BodløsningTrapperom)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Montering</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Montering)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Måltaking</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.Måltaking)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Isolerte inspeksjonsluker
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Himling</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.HimlingText)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Vegg</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TrappogLuker?.VeggText)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til inspeksjonsluker
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.TrappogLuker?.KommentarInspeksjonsluker
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Balkong & Terrasse
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Velg ett alternativ</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.BalkongTerrasse?.Rekkverk?.type)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5 col-span-3">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Beskriv type, modell og farge
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Ønsker megler</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.BalkongTerrasse?.ØnskerMeglerText)}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Velg gulv balkong
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Beskriv type og farge
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.BalkongTerrasse?.VelgGulvBalkong?.colorCode
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">Platting</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Ønsker platting?</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.BalkongTerrasse?.ØnskerPlatting)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">Beskrivelse platting</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Fotskraperist</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.BalkongTerrasse?.Fotskraperist)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til balkong og terrasse
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.BalkongTerrasse?.KommentarTerrasse
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Ventilasjon og Sentralstøvsuger
            </h4>
            <div className="text-darkBlack font-medium text-sm">
              Ventilasjon
            </div>
            <div className={`text-sm flex gap-2 items-center text-black`}>
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
                <div className="w-4 md:w-5 h-4 md:h-5 border-2 border-[#444CE7] rounded-sm"></div>
                <div className="pointer-events-none absolute left-0.5 top-0.5 hidden peer-checked:block">
                  <svg
                    className="w-3 md:w-4 h-3 md:h-4 text-[#444CE7]"
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
            <div className="text-darkBlack font-medium text-sm">
              Fargeønske utvendig kombirist
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.VentilasjonSentralstøvsuger
                        ?.FargeønskeUtvendigKombirist
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Fargeønske innvendig ventiler
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Kommentar til ventilasjon
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.VentilasjonSentralstøvsuger
                        ?.KommentarVentilasjon
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="border-t border-[#EBEBEB] w-full"></div>
            <div className="text-darkBlack font-medium text-sm">
              Sentralstøvsuger
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Antall sugekontakter</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Sugebrett</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">
                    Kommentar til sentralstøvsuger
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(
                      roomsData?.VentilasjonSentralstøvsuger?.Kommentar
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Brannvern
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Brannvern?.Brannvern)}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-secondary text-xs">
                    Kommentar til brannvern
                  </p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.Brannvern?.BrannvernKommentar)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-[#EBEBEB] w-full"></div>
          <div className="flex flex-col gap-4">
            <h4 className="text-darkBlack font-bold text-base uppercase">
              Tekniske Installasjoner
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
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
                  <p className="text-secondary text-xs">Punkt (referanse)</p>
                )}
                {loading ? (
                  <div className="w-[100px] h-[20px] rounded-lg custom-shimmer"></div>
                ) : (
                  <p className="text-darkBlack text-sm">
                    {displayValue(roomsData?.TekniskeInstallasjoner?.Punkt)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
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
          text="Generer PDF"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          onClick={() => setFinalSubmission(true)}
        />
      </div>

      <Drawer isOpen={FinalSubmission} onClose={handleFinalSubmissionPopup}>
        <h4 className="text-darkBlack font-medium text-lg md:text-xl lg:text-2xl bg-[#F9F9FB] flex items-center gap-2 justify-between p-4 md:p-6">
        Generer PDF
          <X
            onClick={() => setFinalSubmission(false)}
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
