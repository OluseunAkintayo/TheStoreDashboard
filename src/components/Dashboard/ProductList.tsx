import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import dayjs from "dayjs";
import { Eye } from "lucide-react";
import { IProduct } from "@/lib/types/IProduct";

interface IProductList {
  data: IProduct[];
}

export default function ProductList({ data }: IProductList) {
  return (
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
          data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="py-2">{item.productName}</TableCell>
              <TableCell className="py-2">{item.brandId}</TableCell>
              <TableCell className="py-2">{item.categoryId}</TableCell>
              <TableCell className="py-2">2</TableCell>
              <TableCell className="py-2">{item.cost}</TableCell>
              <TableCell className="py-2">{item.price}</TableCell>
              <TableCell className="py-2">{dayjs(item.createdAt).format("D MMM YYYY")}</TableCell>
              <TableCell className="grid place-items-center py-2">
                <button className="grid place-items-center bg-accent w-8 h-8 rounded-full hover:bg-gray-200">
                  <Eye className="text-gray-500 w-5 h-5" />
                </button>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}


