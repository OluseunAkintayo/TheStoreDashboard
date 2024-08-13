import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { IEditManufacturer } from "@/lib/types/ICategory";
import { IManufacturer } from "@/lib/types/IManufacturer";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosRequestConfig } from "axios";
import { Loader, X } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';

interface IEditManufacturerModal {
  setEditModal: (arg0: boolean) => void;
  open: boolean;
  manufacturer?: IManufacturer | null;
  setManufacturer: (arg0: IManufacturer | null) => void;
  refetch: () => void;
}

const EditManufacturerSchema = yup.object().shape({
  manufacturerName: yup.string().required("Required"),
  isActive: yup.boolean().required("Required")
});

export function EditManufacturerModal({ open, setEditModal, manufacturer, setManufacturer, refetch }: IEditManufacturerModal) {
  const token = sessionStorage.getItem('command');
  const editManufacturerForm = useForm({ resolver: yupResolver(EditManufacturerSchema) });
  const [loading, setLoading] = React.useState<boolean>(false);
  const close = () => {
    setEditModal(false);
    setManufacturer(null);
    editManufacturerForm.reset();
  }

  const submit: SubmitHandler<IEditManufacturer> = async (values) => {
    if (manufacturer?.manufacturerName === values.manufacturerName && manufacturer.isActive === values.isActive) {
      close();
      return;
    }
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: `products/manufacturer/update/${manufacturer?.id}`,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: values
    }
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Manufacturer updated successfully"
        });
        setLoading(false);
        close();
        refetch();
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Cannot update manufacturer at this time. Please try after sometime"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error has occurred on the server"
      });
    }
  };


  React.useEffect(() => {
    if (manufacturer) {
      editManufacturerForm.setValue("manufacturerName", manufacturer.manufacturerName);
      editManufacturerForm.setValue("isActive", manufacturer?.isActive ? true : false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setEditModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit item '{manufacturer?.manufacturerName}'</AlertDialogTitle>
          <span
            className="absolute top-4 right-4 bg-accent w-6 h-6 grid place-items-center rounded-full cursor-pointer"
            onClick={() => setEditModal(false)}
          >
            <X className="w-4 h-4" />
          </span>
        </AlertDialogHeader>
        <div>
          <Form {...editManufacturerForm}>
            <form onSubmit={editManufacturerForm.handleSubmit(submit)}>
              <div className="space-y-4">
                <FormField
                  control={editManufacturerForm.control}
                  name="manufacturerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" defaultValue={manufacturer?.manufacturerName} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editManufacturerForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                      <FormControl>
                        <Checkbox
                          defaultChecked={manufacturer?.isActive}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {editManufacturerForm.watch("isActive") ? "Active" : "Inactive"}
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <Button type="submit" disabled={loading}>{loading ? <span className="animate-spin"><Loader /></span> : "Submit"}</Button>
                  <Button variant="outline" disabled={loading} type="button" onClick={close}>Cancel</Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
