import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem } from "../../../../components/ui/form";
import Button from "../../../../components/common/button";
import { z } from "zod";

const formSchema = z.object({
  IkkeRelevant: z.boolean().optional(),
  StkPulverapparat: z.boolean().optional(),
  LeveresDKFH: z.boolean().optional(),
});

export const Brannvern: React.FC<{
  handleNext: any;
  handlePrevious: any;
}> = ({ handleNext, handlePrevious }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    handleNext();
    localStorage.setItem("currVerticalIndex", String(16));
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="relative">
          <div className="border border-[#B9C0D4] rounded-lg">
            <div className="text-darkBlack font-semibold text-lg p-5 border-b border-[#B9C0D4]">
              Brannvern
            </div>
            <div className="p-4 md:p-5">
              <div className="flex flex-col md:grid md:grid-cols-2 desktop:grid-cols-3 gap-4 md:gap-5">
                <div>
                  <FormField
                    control={form.control}
                    name="IkkeRelevant"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="IkkeRelevant"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Ikke relevant
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="StkPulverapparat"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="StkPulverapparat"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          1 stk. 6 kg pulverapparat
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="LeveresDKFH"
                    render={({ field }) => (
                      <FormItem>
                        <p
                          className={`text-sm flex gap-2 items-baseline ${
                            field.value ? "text-black" : "text-black"
                          }`}
                        >
                          <input
                            type="checkbox"
                            id="LeveresDKFH"
                            checked={field.value || false}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Leveres av DK/FH
                        </p>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end w-full gap-5 items-center sticky bottom-0 bg-white z-50 border-t border-[#B9C0D4] rounded-b-lg p-4">
              <div
                onClick={() => {
                  form.reset();
                  handlePrevious();
                  localStorage.setItem("currVerticalIndex", String(14));
                }}
              >
                <Button
                  text="Tilbake"
                  className="border border-gray2 text-black text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                />
              </div>
              <Button
                text="Neste"
                className="border border-purple bg-purple text-white text-sm rounded-[8px] h-[40px] font-medium relative px-4 py-[10px] flex items-center gap-2"
                type="submit"
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};
