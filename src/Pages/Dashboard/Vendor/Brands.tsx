import DBLayout from "@components/Dashboard/DBLayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import React from "react";
import { Navigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
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
import { IBrandResponse } from "@/lib/types/IBrand";
import BrandsList from "@/components/Dashboard/BrandsList";
import { IManufacturerResponse } from "@/lib/types/IManufacturer";
import { cn } from "@/lib/utils";

interface INewBrand {
  brandName: string;
  manufacturerId: string;
}

const schema = yup.object().shape({
  brandName: yup.string().required('Brand name is required'),
  manufacturerId: yup.string().required('Manufacturer is required')
});

export function Brands() {
  const { toast } = useToast()
  const [page,] = React.useState(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openMenu, setOpenMenu] = React.useState<boolean>(false);
  const token = sessionStorage.getItem('command');

  const brandForm = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, register, reset, setValue, watch, formState: { errors: brandErrors } } = brandForm;

  const getManufacturers = async () => {
    const options: AxiosRequestConfig = {
      url: "products/manufacturer/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.request(options);
    const data: IManufacturerResponse = res.data;
    return data;
  }

  const manufacturersQuery = useQuery({
    queryKey: ['manufacturers'],
    queryFn: getManufacturers,
    placeholderData: keepPreviousData,
    refetchInterval: 30000
  });

  const manufacturers = manufacturersQuery.data;

  const getBrands = async () => {
    const options: AxiosRequestConfig = {
      url: "products/brands/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.request(options);
    const data: IBrandResponse = res.data;
    return data;
  }

  const brands = useQuery({
    queryKey: ['brands', page],
    queryFn: getBrands,
    placeholderData: keepPreviousData,
    refetchInterval: 300000
  });

  if (!token || (token && token.length === 0)) {
    return <Navigate to="/auth/login" />
  }

  const submit: SubmitHandler<INewBrand> = async (values) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "products/brands/new",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        brandName: values.brandName,
        manufacturerId: sessionStorage.getItem("manufacturerId")
      }
    }
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        brands.refetch();
        setLoading(false);
        setOpen(false);
        reset();
        sessionStorage.removeItem("manufacturerId");
        toast({
          title: "Success",
          description: "Brand created successfully"
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
    if(sessionStorage.getItem("manufacturerId")) sessionStorage.removeItem("manufacturerId");
  }

  return (
    <DBLayout>
      <section className="w-full">
        <div className="p-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-700">Manufacturers</h1>
              <AlertDialog open={open} onOpenChange={() => brandForm.reset()}>
                <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
                  <Button>New</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>New Brand</AlertDialogTitle>
                    <AlertDialogDescription>
                      Adds a new brand item
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <form onSubmit={handleSubmit(submit)} autoComplete="off" className="mt-4 space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="brandName" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        brandErrors.brandName && "text-destructive"
                      )}>Brand Name</label>
                      <Input placeholder="Enter brand name" id="brandName" {...register("brandName")} />
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{brandErrors.brandName?.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="manufacturerId" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        brandErrors.manufacturerId && "text-destructive"
                      )}>Brand Manufacturer</label>
                      <Popover open={openMenu} onOpenChange={setOpenMenu}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openMenu}
                            className="w-full justify-between"
                          >
                            {(watch(["manufacturerId"])[0] && !manufacturersQuery.isError && manufacturers?.data)
                              ? manufacturers.data.find((item) => item.manufacturerName === watch(["manufacturerId"])[0])?.manufacturerName
                              : "Select manufacturer"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder="Search..." />
                            <CommandList>
                              <CommandEmpty>No manufacturer found.</CommandEmpty>
                              <CommandGroup>
                                {(!manufacturersQuery.isError && manufacturers?.data) && manufacturers.data.map((manufacturer) => (
                                  <CommandItem
                                    key={manufacturer.id}
                                    value={manufacturer.manufacturerName}
                                    onSelect={(currentValue) => {
                                      setValue("manufacturerId", currentValue);
                                      sessionStorage.setItem('manufacturerId', manufacturer.id);
                                      setOpenMenu(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        watch(["manufacturerId"])[0] === manufacturer.manufacturerName ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {manufacturer.manufacturerName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{brandErrors.manufacturerId?.message}</p>
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
              brands.isLoading && (
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
            {
              (brands.isError) && (
                <div className="p-4">
                  <p className="text-red-600 text-wrap break-words">{JSON.stringify(brands.error, null, 2)}</p>
                </div>
              )
            }
          </React.Fragment>
          <React.Fragment>
            {
              (!brands.isError && brands.data && brands.data.success) && <BrandsList data={brands.data.data} />
            }
          </React.Fragment>
        </div>
      </section>
    </DBLayout>
  )
}
