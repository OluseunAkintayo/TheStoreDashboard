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
import { ICategory } from "@/lib/types/ICategory";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosRequestConfig } from "axios";
import { Loader, X } from "lucide-react";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from 'yup';

interface IEditCategoryModal {
  setEditModal: (arg0: boolean) => void;
  open: boolean;
  category?: ICategory | null;
  setCategory: (arg0: ICategory | null) => void;
  refetch: () => void;
}

const EditCategorySchema = yup.object().shape({
  categoryName: yup.string().required("Required"),
  description: yup.string().required("Required"),
  isActive: yup.boolean().required("Required")
});

export function EditCategoryModal({ open, setEditModal, category, setCategory, refetch }: IEditCategoryModal) {
  const token = sessionStorage.getItem('command');
  const editCategoryForm = useForm({ resolver: yupResolver(EditCategorySchema) });
  const [loading, setLoading] = React.useState<boolean>(false);
  const close = () => {
    setEditModal(false);
    setCategory(null);
    editCategoryForm.reset();
  }

  const submit: SubmitHandler<ICategory> = async (values) => {
    if (category?.categoryName === values.categoryName && category.description === values.description && category.isActive === values.isActive) {
      close();
      return;
    }
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: `products/categories/update/${category?.categoryId}`,
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
          description: "Product category created successfully"
        });
        setLoading(false);
        close();
        refetch();
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error has occurred on the server"
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
    if (category) {
      editCategoryForm.setValue("categoryName", category.categoryName);
      editCategoryForm.setValue("description", category.description);
      editCategoryForm.setValue("isActive", category?.isActive ? true : false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={setEditModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit item '{category?.categoryName}'</AlertDialogTitle>
          <span
            className="absolute top-4 right-4 bg-accent w-6 h-6 grid place-items-center rounded-full cursor-pointer"
            onClick={() => setEditModal(false)}
          >
            <X className="w-4 h-4" />
          </span>
        </AlertDialogHeader>
        <div>
          <Form {...editCategoryForm}>
            <form onSubmit={editCategoryForm.handleSubmit(submit)}>
              <div className="space-y-4">
                <FormField
                  control={editCategoryForm.control}
                  name="categoryName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter category name" defaultValue={category?.categoryName} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCategoryForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category Description</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter password" {...field} defaultValue={category?.description} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editCategoryForm.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-4">
                      <FormControl>
                        <Checkbox
                          defaultChecked={category?.isActive}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          {editCategoryForm.watch("isActive") ? "Active" : "Inactive"}
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
