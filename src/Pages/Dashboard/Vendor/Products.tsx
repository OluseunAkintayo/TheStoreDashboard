import DBLayout from "@components/Dashboard/DBLayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React from "react";
import { RotateCcw } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { cn } from "@/lib/utils";
import { INewProduct, IProductResponse } from "@/lib/types/IProduct";
import { ICategoryResponse } from "@/lib/types/ICategory";
import ProductList from "@/components/Dashboard/Products/ProductList";

const schema = yup.object().shape({
  productCode: yup.string().required('Product code is required'),
  productName: yup.string().required('Product name is required'),
  productDescription: yup.string().required('Product summary is required'),
  cost: yup.number().typeError('Must be a number').required('Required'),
  price: yup.number().typeError('Must be a number').required('Required'),
  categoryId: yup.string().required('Category is required'),
  brandId: yup.string().required('Brand is required')
});

export default function Products() {
  const { toast } = useToast()
  const [page,] = React.useState(1);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [open, setOpen] = React.useState<boolean>(false);
  const [openBrandMenu, setOpenBrandMenu] = React.useState<boolean>(false);
  const [openCategoryMenu, setOpenCategoryMenu] = React.useState<boolean>(false);
  const token = sessionStorage.getItem('command');

  const productForm = useForm({ resolver: yupResolver(schema) });
  const { handleSubmit, register, reset, setValue, watch, formState: { errors: productErrors } } = productForm;

  const getProducts = async () => {
    const options: AxiosRequestConfig = {
      url: "products/list",
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const res = await axios.request(options);
    const data: IProductResponse = res.data;
    return data;
  }

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    placeholderData: keepPreviousData,
    refetchInterval: 30000
  });
  const products = productsQuery.data;

  const brandsQuery = useQuery({
    queryKey: ['brands', page],
    queryFn: async () => {
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
    },
    placeholderData: keepPreviousData,
    refetchInterval: 300000
  });
  const brands = brandsQuery.data;
  const brandsQueryError = brandsQuery.error as AxiosError;

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
  const categories = categoriesQuery.data;

  const submit: SubmitHandler<INewProduct> = async (values) => {
    setLoading(true);
    const options: AxiosRequestConfig = {
      url: "products/new",
      method: "POST",
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
        productsQuery.refetch();
        setLoading(false);
        setOpen(false);
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

  const onClose = () => {
    setOpen(false);
    reset();
    if (sessionStorage.getItem("manufacturerId")) sessionStorage.removeItem("manufacturerId");
    if (sessionStorage.getItem("categoryId")) sessionStorage.removeItem("categoryId");
    if (sessionStorage.getItem("brandId")) sessionStorage.removeItem("brandId");
  }

  function generateProductCode() {
    const randomNumber = Math.floor(Math.random() * 9999999999);
    const result = randomNumber.toString().padStart(10, '0');
    setValue("productCode", result);
  }

  React.useEffect(() => {
    generateProductCode();
    if (sessionStorage.getItem("manufacturerId")) sessionStorage.removeItem("manufacturerId");
    if (sessionStorage.getItem("categoryId")) sessionStorage.removeItem("categoryId");
    if (sessionStorage.getItem("brandId")) sessionStorage.removeItem("brandId");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DBLayout>
      <section className="w-full">
        <div className="p-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-700">Products</h1>
              <AlertDialog open={open} onOpenChange={() => productForm.reset()}>
                <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
                  <Button>New</Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-h-[80dvh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>New Product</AlertDialogTitle>
                    <AlertDialogDescription>
                      Adds a new product
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <form onSubmit={handleSubmit(submit)} autoComplete="off" className="mt-4 space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="productCode" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        productErrors.productCode && "text-destructive"
                      )}>Product Code</label>
                      <div className="relative">
                        <Input placeholder="Enter product code" id="productCode" {...register("productCode")} />
                        <button title="Generate code" type="button" onClick={generateProductCode} className="bg-accent w-8 h-8 rounded-full grid place-items-center absolute right-2 top-1"><RotateCcw className="text-gray-700 w-4 h-4" /></button>
                      </div>
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.productCode?.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="productName" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        productErrors.productName && "text-destructive"
                      )}>Product Name</label>
                      <Input placeholder="Enter product name" id="productName" {...register("productName")} />
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.productName?.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="productDescription" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        productErrors.productDescription && "text-destructive"
                      )}>Product Summary</label>
                      <Textarea placeholder="Enter product summary" id="productDescription" {...register("productDescription")} />
                      <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.productDescription?.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="categoryId" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        productErrors.categoryId && "text-destructive"
                      )}>Product Category</label>
                      <Popover open={openCategoryMenu} onOpenChange={setOpenCategoryMenu}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openCategoryMenu}
                            className="w-full justify-between"
                          >
                            {(watch(["categoryId"])[0] && !categoriesQuery.isError && categories?.data)
                              ? categories.data.find((item) => item.categoryName === watch(["categoryId"])[0])?.categoryName
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
                                {(!categoriesQuery.isError && categories?.data) && categories.data.map((category) => (
                                  <CommandItem
                                    key={category.categoryId}
                                    value={category.categoryName}
                                    onSelect={(currentValue) => {
                                      setValue("categoryId", currentValue);
                                      sessionStorage.setItem('categoryId', category.categoryId);
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
                      <label htmlFor="brandId" className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                        productErrors.brandId && "text-destructive"
                      )}>Brand</label>
                      <Popover open={openBrandMenu} onOpenChange={setOpenBrandMenu}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openBrandMenu}
                            className="w-full justify-between"
                          >
                            {(watch(["brandId"])[0] && !brandsQuery.isError && brands?.data)
                              ? brands.data.find((item) => item.brandName === watch(["brandId"])[0])?.brandName
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
                                {(!brandsQuery.isError && brands?.data) && brands.data.map((brand) => (
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
                        <label htmlFor="cost" className={cn(
                          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                          productErrors.cost && "text-destructive"
                        )}>Product Cost</label>
                        <Input placeholder="Cost" id="cost" {...register("cost")} />
                        <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.cost?.message}</p>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="price" className={cn(
                          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                          productErrors.price && "text-destructive"
                        )}>Price</label>
                        <Input placeholder="Price" id="price" {...register("price")} />
                        <p className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-destructive">{productErrors.price?.message}</p>
                      </div>
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
              productsQuery.isLoading && (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Avail. Qty</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Date Created</TableHead>
                      <TableHead className="text-center">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      Array(10).fill(0).map((i) => (
                        <TableRow key={i + 1}>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
                          <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
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
              (productsQuery.isError) && (
                <div className="p-4">
                  <p className="text-red-600 text-wrap break-words">Error {brandsQueryError.status + ": " + brandsQueryError.response?.statusText}</p>
                </div>
              )
            }
          </React.Fragment>
          <React.Fragment>
            {
              (!productsQuery.isError && productsQuery.data && products?.success) && <ProductList data={products.data} />
            }
          </React.Fragment>
        </div>
      </section>
    </DBLayout>
  )
}
