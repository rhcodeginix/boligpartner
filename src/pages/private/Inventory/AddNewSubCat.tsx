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
});

export const AddNewSubCat: React.FC<{
  onClose: any;
  formData: any;
  activeTabData: any;
  setCategory: any;
  editIndex?: any;
  defaultValue?: string;
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
    defaultValues: {
      Kategorinavn: defaultValue || "",
    },
  });
  useEffect(() => {
    if (editIndex != null && defaultValue) {
      form.setValue("Kategorinavn", defaultValue);
    } else {
      form.setValue("Kategorinavn", "");
    }
  }, [defaultValue, editIndex]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    onClose();
    const updatedName = data.Kategorinavn;

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
      // Add new
      const newSubCategory = { navn: updatedName, produkter: [] };
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
    form.reset();
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <div className="p-6">
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
                        value={field.value || ""}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div
            className="flex fixed bottom-0 justify-end w-full gap-5 items-center left-0 px-8 py-4"
            style={{
              boxShadow:
                "0px -3px 4px -2px #1018280F, 0px -4px 8px -2px #1018281A",
            }}
          >
            <div onClick={() => form.reset()} className="w-1/2 sm:w-auto">
              <Button
                text="Avbryt"
                className="border border-lightPurple bg-lightPurple text-purple text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              />
            </div>
            <Button
              text="Lagre"
              className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-12 py-2 flex items-center gap-2"
              type="submit"
            />
          </div>
        </form>
      </Form>
    </>
  );
};
