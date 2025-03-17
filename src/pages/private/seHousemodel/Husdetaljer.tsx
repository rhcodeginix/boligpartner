import Img_product1 from "../../../assets/images/Img_product1.png";
import Img_product_logo1 from "../../../assets/images/Img_product_logo1.png";
import Img_product_map from "../../../assets/images/Img_product_map.png";
import Img_product_3d_img1 from "../../../assets/images/Img_product_3d_img1.png";
import Img_product_3d_img2 from "../../../assets/images/Img_product_3d_img2.png";
import Ic_download_primary from "../../../assets/images/Ic_download_primary.svg";
import { File } from "lucide-react";

export const Husdetaljer = () => {
  return (
    <>
      <div className="flex gap-6 h-[333px] mb-[74px]">
        <div className="w-2/3 h-full">
          <h4 className="mb-4 text-darkBlack text-lg font-semibold">
            Illustrasjoner
          </h4>
          <div className="gap-6 flex h-[calc(100%-40px)]">
            <div className="w-1/2">
              <img
                src={Img_product_3d_img1}
                alt="product"
                className="w-full h-full"
              />
            </div>
            <div className="w-1/2">
              <img
                src={Img_product_3d_img2}
                alt="product"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
        <div className="w-1/3 border border-gray2 shadow-shadow2 rounded-lg h-full">
          <div className="px-4 py-5 border-b border-gray2 text-darkBlack text-base font-semibold">
            Dokumenter
          </div>
          <div className="p-4 flex flex-col gap-4">
            <div className="border border-gray2 rounded-lg p-3 bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="border-[4px] border-lightPurple rounded-full flex items-center justify-center">
                  <div className="bg-darkPurple w-7 h-7 rounded-full flex justify-center items-center">
                    <File className="text-primary w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h5 className="text-darkBlack text-sm font-medium mb-1">
                    Document 1.pdf
                  </h5>
                  <p className="text-gray text-xs">200 KB</p>
                </div>
              </div>
              <img src={Ic_download_primary} alt="download" />
            </div>
            <div className="border border-gray2 rounded-lg p-3 bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="border-[4px] border-lightPurple rounded-full flex items-center justify-center">
                  <div className="bg-darkPurple w-7 h-7 rounded-full flex justify-center items-center">
                    <File className="text-primary w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h5 className="text-darkBlack text-sm font-medium mb-1">
                    Document 2.pdf
                  </h5>
                  <p className="text-gray text-xs">200 KB</p>
                </div>
              </div>
              <img src={Ic_download_primary} alt="download" />
            </div>
            <div className="border border-gray2 rounded-lg p-3 bg-[#F9FAFB] flex items-center justify-between">
              <div className="flex items-start gap-3">
                <div className="border-[4px] border-lightPurple rounded-full flex items-center justify-center">
                  <div className="bg-darkPurple w-7 h-7 rounded-full flex justify-center items-center">
                    <File className="text-primary w-4 h-4" />
                  </div>
                </div>
                <div>
                  <h5 className="text-darkBlack text-sm font-medium mb-1">
                    Document 3.pdf
                  </h5>
                  <p className="text-gray text-xs">200 KB</p>
                </div>
              </div>
              <img src={Ic_download_primary} alt="download" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-[60px] mt-8">
        <div className="w-[43%]">
          <h4 className="text-darkBlack mb-6 font-semibold text-2xl">
            Almgaard
          </h4>
          <div className="relative">
            <img
              src={Img_product1}
              alt="product-1"
              className="w-full h-[262px] object-cover rounded-[12px] overflow-hidden"
            />
            <img
              src={Img_product_logo1}
              alt="product-logo-1"
              className="absolute top-[12px] left-[12px] bg-[#FFFFFFB2] py-2 px-3 flex items-center justify-center rounded-[32px] w-auto"
            />
          </div>
          <div className="my-[20px] flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-gray text-base">Pris fra</p>
              <h4 className="text-xl font-semibold text-darkBlack">
                5.860.000 NOK
              </h4>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-gray text-sm">
                <span className="text-darkBlack font-semibold">233</span> m
                <sup>2</sup>
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-gray text-sm">
                <span className="text-darkBlack font-semibold">5</span> soverom
              </div>
              <div className="h-[12px] w-[1px] border-l border-gray"></div>
              <div className="text-gray text-sm">
                <span className="text-darkBlack font-semibold">3</span> bad
              </div>
            </div>
          </div>
          <div className="w-full flex gap-8 mb-[60px]">
            <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
              <table className="table-auto border-0 w-full text-left property_detail_tbl">
                <tbody>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      BRA total
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      244 m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      BRA bolig
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      233 m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      P-rom:
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      221 m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Bebygd Areal
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      152 m<sup>2</sup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      L x B:
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      14.3 x 12.8 m
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Soverom
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      5
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="w-1/2 border-t-2 border-b-0 border-l-0 border-r-0 border-purple pt-4">
              <table className="table-auto border-0 w-full text-left property_detail_tbl">
                <tbody>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Bad
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      3
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Innvendig bod
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      3
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Energimerking
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      B
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Tilgjengelig bolig
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      Ja
                    </td>
                  </tr>
                  <tr>
                    <td className="text-left pb-[16px] text-gray text-sm whitespace-nowrap">
                      Tomtetype
                    </td>
                    <td className="text-left pb-[16px] text-darkBlack text-sm font-semibold whitespace-nowrap">
                      Flat tomt
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <h2 className="mb-6 text-darkBlack text-2xl font-semibold">
            Plantegninger og fasader
          </h2>
          <img src={Img_product_map} alt="map" className="w-full" />
        </div>
        <div className="w-[57%]">
          <h2 className="text-darkBlack text-2xl font-semibold mb-4">
            Herskapelige Almgaard er en drømmebolig for familien
          </h2>
          <div className="flex flex-col gap-4 mb-[60px]">
            <p className="text-base text-gray">
              Lukk øynene. Se for deg opplevelsen av å komme inn i vakre
              Almgaard. Her venter den majestetiske hallen på deg med over fem
              meters takhøyde. Videre ledes du inn i selve hjertet i huset –
              stueområdet på tilsammen nær 60 kvadratmeter og det flotte
              kjøkkenet. Her er plass nok til å samle venner rundt langbordet
              mens den myke kveldssola kaster et varmt lys inn gjennom vinduene.
              Husets første etasje har også en avdeling med gjestesoverom med
              walk-in closet, bad, wc, vaskerom og bod.
            </p>
            <p className="text-base text-gray">
              Almgaard er et flott hus for flat tomt som kjennetegnes av
              mansardtaket. I inngangshallen faller blikket raskt mot den
              nydelige trappa som glir inn som et herskapelig møbel i rommet, og
              inviterer deg opp til galleriet i 2. etasje. Her oppe venter
              smarte løsninger med egen foreldreavdeling bestående av soverom
              walk-in closet og et romslig bad. I den andre fløyen av etasjen
              finner du barnas egen avdeling med tv-stue og to soverom med ett
              bad i mellom. I tillegg er det gjort plass til et
              hjemmekontor/ekstra soverom hvis det er behov for det. 
            </p>
            <p className="text-base text-gray">
              Almgaard ble lansert i januar 2016 som den smarte lillesøsteren
              til herskapelige Holmgaard – selve symbolet på den store
              boligdrømmen for mange. I Almgaard har vi bevart Holmgaards
              ettertraktede kvaliteter, men komprimert det inn på 233
              kvadratmeter. Dermed har vi designet en herskapelig familiedrøm. 
            </p>
          </div>
          <h2 className="text-darkBlack text-2xl font-semibold mb-4">
            Film av Almgaard
          </h2>

          <div
            style={{
              width: "100%",
              height: "400px",
            }}
            className="mb-8"
          >
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/JG5zEa754N8"
              title="Almgaard"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </>
  );
};
