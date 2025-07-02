import { useEffect, useState } from "react";
import Button from "../../../components/common/button";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { HusmodellerTable } from "./HusmodellerTable";
import Modal from "../../../components/common/modal";
import { Check, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../../components/ui/form";

const formSchema = z.object({
  options: z.string({ required_error: "Required" }),
});

export const Husmodeller = () => {
  const navigate = useNavigate();
  const [houseModels, setHouseModels] = useState([]);

  const fetchHusmodellData = async () => {
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

  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    navigate(`/se-series/${data.options}/add-husmodell`);
  };

  return (
    <>
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
        <div>
          <Button
            text="Legg til"
            className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          />
        </div>
      </div>
      <div className="px-4 md:px-6 py-5 md:py-8 desktop:p-8">
        <HusmodellerTable />
      </div>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)} isOpen={true}>
          <div className="relative bg-white rounded-[12px] p-5 w-full sm:w-[90vw] max-w-[500px]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3"
            >
              <X className="text-primary" />
            </button>
            <h3 className="text-darkBlack font-semibold text-xl mb-5">
              Velg én
            </h3>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="relative w-full"
              >
                <div>
                  <FormField
                    control={form.control}
                    name={`options`}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormControl>
                          <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-3">
                            {houseModels.map((option: any, index: number) => {
                              const loaded = imageLoaded[index];
                              return (
                                <div
                                  key={index}
                                  className="relative cursor-pointer rounded-lg"
                                  onClick={() => {
                                    form.setValue("options", option.id);
                                  }}
                                >
                                  <input
                                    className={`hidden bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                                    type="radio"
                                    value={option.id}
                                    onChange={(e) => {
                                      form.setValue(`options`, e.target.value);
                                    }}
                                    style={{ display: "none" }}
                                  />
                                  <div className="w-full h-[160px] mb-2.5 md:mb-4 relative">
                                    {!loaded && (
                                      <div className="w-full h-full rounded-lg custom-shimmer"></div>
                                    )}
                                    {option?.photo && (
                                      <img
                                        src={option?.photo}
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
                                  <p className="mt-2">
                                    {option?.husmodell_name}
                                  </p>
                                  {field.value === option.id && (
                                    <div className="bg-white absolute top-2 right-2 h-7 w-7 rounded-full flex items-center justify-center">
                                      <Check className="w-5 h-5 text-primary" />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex mt-4 justify-end w-full gap-5 items-center left-0">
                  <div onClick={() => form.reset()}>
                    <Button
                      text="Avbryt"
                      className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
                    />
                  </div>
                  <Button
                    text="Neste"
                    className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
                    type="submit"
                  />
                </div>
              </form>
            </Form>
          </div>
        </Modal>
      )}
    </>
  );
};
