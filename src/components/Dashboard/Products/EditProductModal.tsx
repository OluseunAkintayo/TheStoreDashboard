import { Textarea } from "@/components/ui/textarea"
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
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup';
import React, { ChangeEvent } from 'react';
import { IEditProduct, IProduct } from '@/lib/types/IProduct';
import axios, { AxiosRequestConfig } from 'axios';
import { toast } from '@/components/ui/use-toast';
import { ICategoryResponse } from '@/lib/types/ICategory';
import { IBrandResponse } from '@/lib/types/IBrand';
import { UseQueryResult } from '@tanstack/react-query';
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Label } from '@/components/ui/label';


interface IEditProductModal {
  open: boolean;
  onClose: () => void;
  refetch: () => void;
  product: IProduct | null;
  categoriesQuery: UseQueryResult<ICategoryResponse, Error>;
  brandsQuery: UseQueryResult<IBrandResponse, Error>;
}

const schema = yup.object().shape({
  productCode: yup.string().required('Product code is required'),
  productName: yup.string().required('Product name is required'),
  description: yup.string().required('Product description is required'),
  categoryId: yup.string().required('Category is required'),
  brandId: yup.string().required('Brand is required'),
  cost: yup.number().typeError('Must be a number').required('Required'),
  price: yup.number().typeError('Must be a number').required('Required'),
  pictures: yup.array().typeError("Must be an array").of(yup.string())
    // .required("Required")
});


export function EditProductModal({ open, onClose, refetch, product, categoriesQuery, brandsQuery }: IEditProductModal) {
  const token = sessionStorage.getItem("command");
  const editProductForm = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, register, reset, setValue, watch, formState: { errors: productErrors } } = editProductForm;
  const [loading, setLoading] = React.useState<boolean>(false);
  const [openBrandMenu, setOpenBrandMenu] = React.useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = React.useState<boolean>(false);

  const submit: SubmitHandler<IEditProduct> = async (values) => {
    console.log(values);
    return;
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "products/update/" + product?.id,
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: {
        ...values,
        brandId: sessionStorage.getItem("brandId"),
        categoryId: sessionStorage.getItem("categoryId")
      }
    }
    try {
      const res = await axios.request(options);
      if (res.status === 200) {
        refetch();
        setLoading(false);
        reset();
        toast({
          title: "Success",
          description: "Product created successfully"
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error " + res.status,
          description: "There was a problem completing your request, please try again later."
        });
      }
    } catch (error) {
      console.log({ error });
      setLoading(false);
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "An error has occurred on the server, please try again after sometime."
      });
    }
  }

  const [images, setImages] = React.useState<{ fileNames: Array<string>, tempUris: Array<string>, imgUris: Array<string> }>({ fileNames: [], tempUris: [], imgUris: [] });
  const onFileUpLoad = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const formData = new FormData();
      for (const file of files) {
        if (!images.fileNames.includes(file.name)) {
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          }).then((item) => {
            const url = item as string;
            setImages(prev => ({ ...prev, tempUris: prev.tempUris.concat([url]), fileNames: prev.fileNames.concat([file.name]) }));
            formData.append("files", file);
          }).catch(error => {
            console.log(error);
            throw new Error(error);
          });
        }
      }
    }
  }

  React.useEffect(() => {
    console.log({ product });
    if(product) {
      setValue("pictures", product?.pictures);
      setValue("categoryId", product?.categoryId)
    }
    return () => {
      if (sessionStorage.getItem("manufacturerId")) sessionStorage.removeItem("manufacturerId");
      if (sessionStorage.getItem("categoryId")) sessionStorage.removeItem("categoryId");
      if (sessionStorage.getItem("brandId")) sessionStorage.removeItem("brandId");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React.useEffect(() => {
  //   console.log(watch());
  // }, [watch]);
  
  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="max-h-[80dvh] overflow-y-auto max-w-[1440px]">
        <AlertDialogHeader className='relative'>
          <AlertDialogTitle>New Product</AlertDialogTitle>
          <AlertDialogDescription>
            Adds a new product
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(submit)} autoComplete="off" className="mt-4 space-y-5">
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <div>
              <div className="space-y-2">
                <Label htmlFor="productCode" className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  productErrors.productCode && "text-destructive"
                )}>Product Code</Label>
                <div className="relative">
                  <Input placeholder="Enter product code" disabled id="productCode" {...register("productCode", {
                    value: product?.productCode
                  })} />
                </div>
                <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.productCode?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productName" className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  productErrors.productName && "text-destructive"
                )}>Product Name</Label>
                <Input placeholder="Enter product name" id="productName" {...register("productName", {
                  value: product?.productName
                })} />
                <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.productName?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription" className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  productErrors.description && "text-destructive"
                )}>Product Summary</Label>
                <Textarea placeholder="Enter product summary" id="productDescription" defaultValue={product?.productDescription} {...register("description")} />
                <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.description?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryId" className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  productErrors.categoryId && "text-destructive"
                )}>Product Category</Label>
                <Popover open={openCategoryMenu} onOpenChange={setOpenCategoryMenu}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openCategoryMenu}
                      className="w-full justify-between"
                    >
                      {(watch(["categoryId"])[0] && !categoriesQuery.isError && categoriesQuery.data?.data)
                        ? categoriesQuery.data.data.find((item) => item.categoryName === watch(["categoryId"])[0])?.categoryName
                        : "Select category"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search..." />
                      <CommandList>
                        <CommandEmpty>No items found.</CommandEmpty>
                        <CommandGroup>
                          {(!categoriesQuery.isError && categoriesQuery.data?.data !== null) && categoriesQuery.data?.data.map((category) => (
                            <CommandItem
                              key={category.categoryId}
                              value={category.categoryName}
                              onSelect={(currentValue) => {
                                console.log({ currentValue, category });
                                setValue("categoryId", currentValue);
                                sessionStorage.setItem('categoryId', category?.categoryId);
                                setOpenCategoryMenu(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watch(["categoryId"])[0] === category.categoryName ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {category.categoryName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.categoryId?.message}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brandId" className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  productErrors.brandId && "text-destructive"
                )}>Brand</Label>
                <Popover open={openBrandMenu} onOpenChange={setOpenBrandMenu}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openBrandMenu}
                      className="w-full justify-between"
                    >
                      {(watch(["brandId"])[0] && !brandsQuery.isError && brandsQuery.data?.data)
                        ? brandsQuery.data.data.find((item) => item.brandName === watch(["brandId"])[0])?.brandName
                        : "Select brand"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <Command>
                      <CommandInput placeholder="Search..." />
                      <CommandList>
                        <CommandEmpty>No brand found.</CommandEmpty>
                        <CommandGroup>
                          {(!brandsQuery.isError && brandsQuery.data?.data) && brandsQuery.data.data.map((brand) => (
                            <CommandItem
                              key={brand.brandId}
                              value={brand.brandName}
                              onSelect={(currentValue) => {
                                setValue("brandId", currentValue);
                                sessionStorage.setItem('brandId', brand.brandId);
                                setOpenBrandMenu(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  watch(["brandId"])[0] === brand.brandName ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {brand.brandName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.brandId?.message}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost" className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    productErrors.cost && "text-destructive"
                  )}>Product Cost</Label>
                  <Input placeholder="Cost" id="cost" defaultValue={product?.cost} {...register("cost")} />
                  <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.cost?.message}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className={cn(
                    "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                    productErrors.price && "text-destructive"
                  )}>Price</Label>
                  <Input placeholder="Price" id="price" defaultValue={product?.price} {...register("price")} />
                  <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.price?.message}</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="productDescription" className={cn(
                  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                  productErrors.pictures && "text-destructive")}>Product Images</Label>
                <Input className='hidden' type='file' id="pictures" accept=".jpg, .jpeg, .png, .webp" multiple {...register("pictures", {
                  onChange: onFileUpLoad
                })} />
                <br />
                <Label className='inline-block border bg-accent cursor-pointer p-2 rounded-sm  text-xs' htmlFor='pictures'>Upload pictures</Label>
                <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.pictures?.message}</p>
              </div>
            </div>
            <div className='sm:px-10 mt-4 sm:mt-0'>
              {
                (product?.pictures && images.tempUris) && (
                  <Carousel>
                    <CarouselContent>
                      {
                        [...images.tempUris, ...product.pictures].map((item, i) => (
                          <CarouselItem key={i} className='grid place-items-center'>
                            <img src={item} alt="" className='w-[90%] mx-auto' />
                          </CarouselItem>
                        ))
                      }
                    </CarouselContent>
                    <CarouselPrevious className='-left-6' type="button" />
                    <CarouselNext className='-right-6' type="button" />
                  </Carousel>
                )
              }
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:pt-8">
            <Button disabled={loading}>{loading ? <span className="animate-spin"><Loader /></span> : "Submit"}</Button>
            <Button disabled={loading} onClick={onClose} type="button" variant="outline" className="hover:text-red-600 hover:border-red-600">Cancel</Button>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
