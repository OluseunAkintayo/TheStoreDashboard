import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import { ArrowBigUpDash, Edit, EllipsisVertical, Trash2 } from "lucide-react";
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

interface IProductList {
  data: IProduct[];
}

export default function ProductList({ data }: IProductList) {
  const [openEditModal, setOpenEditModal] = React.useState<boolean>(false);
  const [openUpdateStockModal, setUpdateStockModal] = React.useState<boolean>(false);
  const [product, setProduct] = React.useState<IProduct | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Avail. Qty</TableHead>
            <TableHead className="text-right">Cost</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            data.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="py-2">{item.productName}</TableCell>
                <TableCell className="py-2">{item.brandId}</TableCell>
                <TableCell className="py-2">{item.categoryId}</TableCell>
                <TableCell className="py-2">2</TableCell>
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
                      <DropdownMenuItem onClick={() => {
                        setOpenEditModal(true);
                        setProduct(item);
                      }}>
                        <Edit className="w-4" />
                        <span className="ml-2">Edit Product</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ArrowBigUpDash className="w-4" />
                        <span className="ml-2">Update Stock</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
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
      {openEditModal && <EditProductModal open={openEditModal} product={product} setOpenEditModal={setOpenEditModal} />}
      {openEditModal && <UpdateStockModal open={openUpdateStockModal} setUpdateStockModal={setUpdateStockModal} />}
    </>
  )
}
