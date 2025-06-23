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
  Hovedkategoriname: z.string().min(1, {
    message: "Hovedkategoriname må bestå av minst 2 tegn.",
  }),
  isSelected: z.boolean().optional(),
});

export const AddNewCat: React.FC<{
  onClose: any;
  setCategory: any;
  editData: any;
  Category: any;
}> = ({ onClose, setCategory, editData, Category }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  useEffect(() => {
    if (editData?.data?.name) {
      form.setValue("Hovedkategoriname", editData?.data?.name);
    }
    if (editData?.data?.isSelected) {
      form.setValue("isSelected", editData?.data?.isSelected);
    }
  }, [form, editData?.data?.name, editData?.data?.isSelected]);
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const isDuplicate = Category.some((cat: any, idx: number) => {
      if (editData) {
        return (
          idx !== editData.index &&
          cat.name.toLowerCase() === data.Hovedkategoriname.toLowerCase()
        );
      }
      return cat.name.toLowerCase() === data.Hovedkategoriname.toLowerCase();
    });

    if (isDuplicate) {
      form.setError("Hovedkategoriname", {
        type: "manual",
        message: "Kategorinavnet finnes allerede.",
      });
      return;
    }

    onClose();
    if (editData) {
      setCategory((prev: any) =>
        prev.map((cat: any, idx: any) =>
          idx === editData.index
            ? {
                ...cat,
                name: data.Hovedkategoriname,
                isSelected: data.isSelected ?? false,
              }
            : cat
        )
      );
    } else {
      setCategory((prev: any) => [
        ...prev,
        {
          name: data.Hovedkategoriname,
          // Kategoriname: null,
          isSelected: data.isSelected ?? false,
        },
      ]);
    }
  };
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="relative w-full"
        >
          <div>
            <FormField
              control={form.control}
              name="Hovedkategoriname"
              render={({ field, fieldState }) => (
                <FormItem>
                  <p
                    className={`${
                      fieldState.error ? "text-red" : "text-black"
                    } mb-[6px] text-sm font-medium`}
                  >
                    Hovedkategoriname
                  </p>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Skriv inn Hovedkategoriname"
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
          </div>
          <div>
            <FormField
              control={form.control}
              name={`isSelected`}
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative flex items-center gap-2 mt-3">
                      <input
                        className={`bg-white rounded-[8px] accent-primary border text-black
                                  ${
                                    fieldState?.error
                                      ? "border-red"
                                      : "border-gray1"
                                  } h-4 w-4`}
                        type="radio"
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          if (isChecked) {
                            form.setValue("isSelected", isChecked);
                          }
                        }}
                        checked={field.value}
                      />
                      <p
                        className={`${
                          fieldState.error ? "text-red" : "text-black"
                        } text-sm font-medium`}
                      >
                        Is mandatory
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end w-full gap-5 items-center left-0 mt-8">
            <div
              onClick={() => {
                form.reset();
                onClose();
              }}
            >
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
