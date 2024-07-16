import DBLayout from "@components/Dashboard/DBLayout";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { IBrandResponse } from "@/lib/types/IBrand";
import {  IProductResponse } from "@/lib/types/IProduct";
import { ICategoryResponse } from "@/lib/types/ICategory";
import ProductList from "@/components/Dashboard/Products/ProductList";
import { Button } from "@/components/ui/button";
import { NewProduct } from "@/components/Dashboard/Products/NewProduct";


export default function Products() {
  const [page,] = React.useState(1);
  const [newProductModal, setNewProductModal] = React.useState<boolean>(false);
  const token = sessionStorage.getItem('command');


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

  const onClose = () => {
    setNewProductModal(false);
    if (sessionStorage.getItem("manufacturerId")) sessionStorage.removeItem("manufacturerId");
    if (sessionStorage.getItem("categoryId")) sessionStorage.removeItem("categoryId");
    if (sessionStorage.getItem("brandId")) sessionStorage.removeItem("brandId");
  }

  return (
    <DBLayout>
      <section className="w-full">
        <div className="p-4">
          <div>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-700">Products</h1>
              <Button onClick={() => setNewProductModal(true)}>New</Button>
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
            {
              newProductModal && <NewProduct open={newProductModal} onClose={onClose} refetch={productsQuery.refetch} categoriesQuery={categoriesQuery} brandsQuery={brandsQuery} />
            }
          </React.Fragment>
        </div>
      </section>
    </DBLayout>
  )
}
