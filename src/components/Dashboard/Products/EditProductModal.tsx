import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { IProduct } from "@/lib/types/IProduct";
import { X } from "lucide-react";

interface IEditProductModal {
  setOpenEditModal: (arg0: boolean) => void;
  open: boolean;
  product: IProduct | null;
}

export function EditProductModal({ open, setOpenEditModal, product }: IEditProductModal) {
  console.log({ product });
  return (
    <AlertDialog open={open} onOpenChange={setOpenEditModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <span
            className="absolute top-4 right-4 bg-accent w-6 h-6 grid place-items-center rounded-full cursor-pointer"
            onClick={() => setOpenEditModal(false)}
          >
            <X className="w-4 h-4" />
          </span>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
