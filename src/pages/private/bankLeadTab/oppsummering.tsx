import React from "react";
import Button from "../../../components/common/button";
import { UserRoundCheck } from "lucide-react";

export const Oppsummering: React.FC<{
  setActiveTab: any;
}> = ({ setActiveTab }) => {
  return (
    <>
      <div
        className="mx-10 rounded-lg mb-28"
        style={{
          boxShadow: "0px 1px 2px 0px #1018280F, 0px 1px 3px 0px #1018281A",
        }}
      >
        <div className="py-4 px-5 flex items-center gap-3 border-b border-[#E8E8E8]">
          <UserRoundCheck />
          <span className="text-lg font-semibold">Oppsummering</span>
        </div>
        <div className="bg-[#F6F4F2] py-3 px-5 text-sm font-semibold">
          Informasjon om <span className="font-extrabold">kunden:</span>
        </div>
        <div className="p-5 grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Type
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                Perivatperson
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Navn:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                André Fenger
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Adresse:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                Sokkabekveien 81, 3478 Nærsnes
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Mobil:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                +47 481 79 760
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                E-post:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                andre.fenger@gmail.com
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Fødselsdato:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                17.08.1983
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Personnummer:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                170883 43999
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Type
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                Perivatperson
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Navn:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                André Fenger
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Adresse:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                Sokkabekveien 81, 3478 Nærsnes
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Mobil:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                +47 481 79 760
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                E-post:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                andre.fenger@gmail.com
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Fødselsdato:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                17.08.1983
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[150px] text-[#00000099] font-semibold">
                Personnummer:
              </div>
              <div className="w-[300px] text-[#000000] font-semibold">
                170883 43999
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#F6F4F2] py-3 px-5 text-sm font-semibold">
          Informasjon om <span className="font-extrabold">kunden:</span>
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Adresse:
              </div>
              <div className="w-full text-[#000000] font-semibold">
                Sokkabekkveien 81, 3478 Nærsnes
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Kunden eier tomten allerede:
              </div>
              <div className="w-full text-[#000000] font-semibold">Ja</div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Totale tomtekostnader:
              </div>
              <div className="w-full text-[#000000] font-semibold">
                5.657.490 NOK
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Kommentar:
              </div>
              <div className="w-full text-[#000000] font-semibold">
                Kunde skiller ut egen seksjon fra dagens boenhet.
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#F6F4F2] py-3 px-5 text-sm font-semibold">
          Informasjon om <span className="font-extrabold">husmodellen:</span>
        </div>
        <div className="p-5">
          <div className="flex flex-col gap-2">
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Husmodell
              </div>
              <div className="w-full text-[#000000] font-semibold">
                Almgaard
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Totale byggekostnader:
              </div>
              <div className="w-full text-[#000000] font-semibold">
                8.451.200 NOK
              </div>
            </div>
            <div className="flex gap-3 items-center mb-3">
              <div className="w-[300px] text-[#00000099] font-semibold">
                Kommentar:
              </div>
              <div className="w-full text-[#000000] font-semibold">
                Kunde skal ha tilknyttet garasje til husmodell, totalpris er
                inkludert i denne garasjen.
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#000000] font-semibold text-lg">
                Sum tomtekostnader
              </div>
              <div className="w-full text-[#000000] font-semibold text-lg flex gap-[60px] items-center">
                5.657.490 NOK
                <p className="text-[#00000099] text-base">
                  (prosjektregnskapet oversende banken)
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#000000] font-semibold text-lg">
                Sum byggkostnader
              </div>
              <div className="w-full text-[#000000] font-semibold text-lg flex gap-[60px] items-center">
                8.451.200 NOK
                <p className="text-[#00000099] text-base">
                  (prosjektregnskapet oversende banken)
                </p>
              </div>
            </div>
            <div className="border-t border-[#EAECF0] w-full"></div>
            <div className="flex gap-3 items-center">
              <div className="w-[300px] text-[#000000] font-semibold text-xl">
                Totale kostnader
              </div>
              <div className="w-full text-[#000000] font-semibold text-xl flex gap-[60px] items-center">
                14.108.690 NOK
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end w-full gap-5 items-center fixed bottom-0 bg-white z-50 border-t border-gray2 p-4 left-0">
        <div onClick={() => setActiveTab(2)} className="w-1/2 sm:w-auto">
          <Button
            text="Avbryt"
            className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          />
        </div>
        <Button
          text="Lagre"
          className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
          //   type="submit"
          onClick={() => setActiveTab(3)}
        />
      </div>
    </>
  );
};
