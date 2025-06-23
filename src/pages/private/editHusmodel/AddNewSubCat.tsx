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
import Button from "../../../components/common/button";
import { Input } from "../../../components/ui/input";
import { useEffect } from "react";

const formSchema = z.object({
  Kategorinavn: z.string().min(1, {
    message: "Kategorinavn må bestå av minst 2 tegn.",
  }),
  productOptions: z.string({ required_error: "Required" }),
});

export const AddNewSubCat: React.FC<{
  onClose: any;
  formData: any;
  activeTabData: any;
  setCategory: any;
  editIndex?: any;
  defaultValue?: any;
}> = ({
  onClose,
  formData,
  activeTabData,
  setCategory,
  editIndex,
  defaultValue,
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   Kategorinavn: defaultValue.navn || "",
    // },
  });
  useEffect(() => {
    if (defaultValue) {
      form.setValue("Kategorinavn", defaultValue?.navn);
      form.setValue("productOptions", defaultValue?.productOptions);
    }
  }, [defaultValue]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    onClose();
    const updatedName = data.Kategorinavn;
    const updatedOption = data.productOptions;

    const existingCategories =
      formData.getValues(`hovedkategorinavn.${activeTabData}.Kategorinavn`) ||
      [];
    // setCategory((prev: any) => {
    //   const updatedCategory = [...prev];
    //   updatedCategory[activeTabData] = {
    //     ...updatedCategory[activeTabData],
    //     Kategorinavn: [...existingCategories, newSubCategory],
    //   };
    //   return updatedCategory;
    // });
    // formData.setValue(
    //   `hovedkategorinavn.${activeTabData}.Kategorinavn`,
    //   [...existingCategories, newSubCategory],
    //   { shouldValidate: true }
    // );
    if (editIndex !== null && existingCategories[editIndex]) {
      // Edit existing
      const updatedCategories = [...existingCategories];
      updatedCategories[editIndex].navn = updatedName;
      updatedCategories[editIndex].productOptions = updatedOption;

      setCategory((prev: any) => {
        const updatedCategory = [...prev];
        updatedCategory[activeTabData] = {
          ...updatedCategory[activeTabData],
          Kategorinavn: updatedCategories,
        };
        return updatedCategory;
      });

      formData.setValue(
        `hovedkategorinavn.${activeTabData}.Kategorinavn`,
        updatedCategories,
        { shouldValidate: true }
      );
    } else {
      const newSubCategory = {
        navn: updatedName,
        productOptions: updatedOption,
        produkter: [],
      };
      setCategory((prev: any) => {
        const updatedCategory = [...prev];
        updatedCategory[activeTabData] = {
          ...updatedCategory[activeTabData],
          Kategorinavn: [...existingCategories, newSubCategory],
        };
        return updatedCategory;
      });
      formData.setValue(
        `hovedkategorinavn.${activeTabData}.Kategorinavn`,
        [...existingCategories, newSubCategory],
        { shouldValidate: true }
      );
    }
  };

  const productOptions = ["Multi Select", "Single Select", "Text"];

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <div className="p-6 flex flex-col gap-4">
            <FormField
              control={form.control}
              name="Kategorinavn"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    className={`${
                      fieldState.error ? "text-red" : "text-black"
                    } mb-[6px] text-sm font-medium`}
                  >
                    Kategorinavn
                  </p>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Skriv inn Kategorinavn"
                        {...field}
                        className={`bg-white rounded-[8px] border text-black
                                          ${
                                            fieldState?.error
                                              ? "border-red"
                                              : "border-gray1"
                                          } `}
                        type="text"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormField
                control={form.control}
                name={`productOptions`}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <p
                      className={`mb-2 ${
                        fieldState.error ? "text-red" : "text-black"
                      } text-sm`}
                    >
                      Skorstein Enkel/Dobbel
                    </p>
                    <FormControl>
                      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap">
                        {productOptions.map((option) => (
                          <div
                            key={option}
                            className="relative flex items-center gap-2"
                          >
                            <input
                              className={`bg-white rounded-[8px] border text-black
        ${
          fieldState?.error ? "border-red" : "border-gray1"
        } h-4 w-4 accent-[#444CE7]`}
                              type="radio"
                              value={option}
                              onChange={(e) => {
                                form.setValue(`productOptions`, e.target.value);
                              }}
                              checked={field.value === option}
                            />
                            <p className={`text-black text-sm`}>{option}</p>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div
            className="flex fixed bottom-0 justify-end w-full gap-5 items-center left-0 px-8 py-4"
            style={{
              boxShadow:
                "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
            }}
          >
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
    </>
  );
};
