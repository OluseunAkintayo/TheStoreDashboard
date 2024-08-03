import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { ArrowBigUpDash, Edit, EllipsisVertical, Eye, Trash2 } from "lucide-react";
import { IProduct } from "@/lib/types/IProduct";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { EditProductModal } from "@components/Dashboard/Products/EditProductModal";
import { UpdateStockModal } from "@components/Dashboard/Products/UpdateStockModal";
import { DeleteProductModal } from "./DeleteProductModal";
import { UseQueryResult } from "@tanstack/react-query";
import { ICategoryResponse } from "@/lib/types/ICategory";
import { IBrandResponse } from "@/lib/types/IBrand";

interface IProductList {
  data: IProduct[];
  refetch: () => void;
  categoriesQuery: UseQueryResult<ICategoryResponse, Error>;
  brandsQuery: UseQueryResult<IBrandResponse, Error>;
}

export default function ProductList({ data, refetch, brandsQuery, categoriesQuery }: IProductList) {
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [viewModal, setViewModal] = React.useState<boolean>(false);
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [stockModal, setStockModal] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<IProduct | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Code</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-center">Avail. Qty</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-2">{item.productCode}</TableCell>
                <TableCell className="py-2">{item.productName}</TableCell>
                <TableCell className="py-2">{item.brandName}</TableCell>
                <TableCell className="py-2">{item.categoryName}</TableCell>
                <TableCell className="py-2 text-center">{item.quantity}</TableCell>
                <TableCell className="py-2 text-right">{item.cost.toLocaleString()}</TableCell>
                <TableCell className="py-2 text-right">{item.price.toLocaleString()}</TableCell>
                <TableCell className="grid place-items-center py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-accent w-8 h-8 rounded-full hover:bg-gray-200 grid place-items-center">
                      <EllipsisVertical className="text-gray-500 w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => setProduct(item)}>
                        <Eye className="w-4" />
                        <span className="ml-2">View Product</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setEditModal(true);
                        setProduct(item);
                      }}>
                        <Edit className="w-4" />
                        <span className="ml-2">Edit Product</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setStockModal(true);
                        setProduct(item);
                      }}>
                        <ArrowBigUpDash className="w-4" />
                        <span className="ml-2">Update Stock</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setDeleteModal(true);
                        setProduct(item);
                      }}>
                        <Trash2 className="w-4" />
                        <span className="ml-2">Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      {editModal && <EditProductModal open={editModal} onClose={() => { setProduct(null); setEditModal(false); }} product={product} refetch={refetch} categoriesQuery={categoriesQuery} brandsQuery={brandsQuery} />}
      {/* {stockModal && <UpdateStockModal open={stockModal} setStockModal={setStockModal} />} */}
      {deleteModal && <DeleteProductModal open={deleteModal} setDeleteModal={setDeleteModal} product={product} setProduct={setProduct} refetch={refetch} />}
    </>
  )
}
