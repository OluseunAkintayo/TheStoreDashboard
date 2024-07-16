import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { ICategory } from "@/lib/types/ICategory";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import axios, { AxiosRequestConfig } from "axios";
import { Loader, TriangleAlert, X } from "lucide-react";
import React from "react";

interface IDeleteCategoryModal {
  setDeleteModal: (arg0: boolean) => void;
  setCategory: (arg0: ICategory | null) => void;
  open: boolean;
  category?: ICategory | null;
  refetch: () => void;
}

export function DeleteCategoryModal({ open, setDeleteModal, category, setCategory, refetch }: IDeleteCategoryModal) {
  const close = () => {
    setDeleteModal(false);
    setCategory(null);
  }

  const [loading, setLoading] = React.useState<boolean>(false);

  const submit = async () => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: `products/categories/delete/${category?.categoryId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('command')}`
      }
    }
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Product category deleted"
        });
        setLoading(false);
        close();
        refetch();
        return;
      }
      toast({
        variant: "destructive",
        title: "Error",
        description: "Unable to complete request at this time."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Server Error",
        description: "An error has occurred on the server"
      });
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={close}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete item '{category?.categoryName}'
          </AlertDialogTitle>
          <AlertDialogDescription className="text-red-600 text-lg flex items-center gap-3 py-3">
            <TriangleAlert />
            This action is irreversible
          </AlertDialogDescription>
          <span
            className="absolute top-4 right-4 bg-accent w-6 h-6 grid place-items-center rounded-full cursor-pointer"
            onClick={close}
          >
            <X className="w-4 h-4" />
          </span>
        </AlertDialogHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <Button disabled={loading} onClick={submit} className="bg-red-600 hover:bg-red-700">{loading ? <span className="animate-spin"><Loader /></span> : "Delete"}</Button>
          <Button disabled={loading} variant="outline" onClick={close}>Cancel</Button>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
