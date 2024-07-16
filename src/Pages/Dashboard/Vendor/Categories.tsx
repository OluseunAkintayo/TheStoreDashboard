import React from "react";
import DBLayout from "@components/Dashboard/DBLayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { ICategory, ICategoryResponse } from "@/lib/types/ICategory";
import CategoryList from "@/components/Dashboard/Categories/CategoryList";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  categoryName: yup.string().required('Category name is required'),
  description: yup.string().required('Description is required')
});

export function Categories() {
  const { toast } = useToast()
  const [page,] = React.useState(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const token = sessionStorage.getItem('command');

  const categoryForm = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, register, reset, formState: { errors: categoryErrors } } = categoryForm;

  const categoriesQuery = useQuery({
    queryKey: ['categories', page],
    queryFn: async () => {
      const options: AxiosRequestConfig = {
        url: "products/categories/list",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
      const res = await axios.request(options);
      const data: ICategoryResponse = res.data;
      return data;
    },
    placeholderData: keepPreviousData,
    refetchInterval: 300000
  });

  const categoriesQueryError = categoriesQuery.error as AxiosError;

  const submit: SubmitHandler<ICategory> = async (values) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "products/categories/new",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: values
    }
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        categoriesQuery.refetch();
        setLoading(false);
        setOpen(false);
        reset();
        toast({
          title: "Success",
          description: "Product category updated successfully"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error " + res.status,
          description: "There was a problem completing your request, please try again later."
        });
      }
    } catch (error) {
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "An error has occurred on the server, please try again after sometime."
      });
    }
  }

  const onClose = () => {
    setOpen(false);
    reset();
  }

  return (
    <DBLayout>
      <section className="w-full">
        <div className="p-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-700">Categories</h1>
              <AlertDialog open={open} onOpenChange={() => categoryForm.reset()}>
                <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
                  <Button>New</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>New Category</AlertDialogTitle>
                    <AlertDialogDescription>
                      Adds a new item category
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <form onSubmit={handleSubmit(submit)} autoComplete="off" className="mt-4 space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="categoryName" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        categoryErrors.categoryName && "text-destructive"
                      )}>Category Name</label>
                      <Input placeholder="Enter category name" id="categoryName" {...register("categoryName")} />
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{categoryErrors.categoryName?.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="description" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        categoryErrors.description && "text-destructive"
                      )}>Description</label>
                      <Input placeholder="Enter description" id="description" {...register("description")} />
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{categoryErrors.description?.message}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button disabled={loading}>{loading ? <span className="animate-spin"><Loader /></span> : "Submit"}</Button>
                      <Button disabled={loading} onClick={onClose} type="button" variant="outline" className="hover:text-red-600 hover:border-red-600">Cancel</Button>
                    </div>
                  </form>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <Separator className="my-4" />
          </div>
          <React.Fragment>
            {
              categoriesQuery.isLoading && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">S/N</TableHead>
                      <TableHead>Manufacturer Name</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      Array(10).fill(0).map((i) => (
                        <TableRow key={i + 1}>
                          <TableCell className="font-medium"><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell className="grid place-items-center"><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                        </TableRow>
                      ))
                    }
                  </TableBody>
                </Table>
              )
            }
          </React.Fragment>
          <React.Fragment>
            {categoriesQuery.isError && (
              categoriesQueryError.response?.status === 401 ?
                (<div className="p-4"><p className="text-red-600 text-wrap break-words">Error {categoriesQueryError.response?.status}: your current session has expired. Click <Link className="text-gray-500" to="/auth/login">here</Link> to login again.</p></div>)
                :
                (<div className="p-4"><p className="text-red-600 text-wrap break-words">Error {categoriesQueryError.response?.status}: {categoriesQueryError.response?.statusText}</p></div>
                )
              )
            }
          </React.Fragment>
          <React.Fragment>
            {
              (!categoriesQuery.isError && categoriesQuery.data && categoriesQuery.data.data) && <CategoryList data={categoriesQuery.data.data} refetch={categoriesQuery.refetch} />
            }
          </React.Fragment>
        </div>
      </section>
    </DBLayout>
  )
}
