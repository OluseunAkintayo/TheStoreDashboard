import { IBrand } from "@/lib/types/IBrand";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import dayjs from "dayjs";
import { Eye } from "lucide-react";

interface IBrandsList {
  data: IBrand[];
}

export default function BrandsList({ data }: IBrandsList) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">S/N</TableHead>
          <TableHead>Brand Name</TableHead>
          <TableHead>Brand Manufacturer</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.map((item, index) => (
            <TableRow key={item.brandId}>
              <TableCell className="font-medium py-2">{index + 1}</TableCell>
              <TableCell className="py-2">{item.brandName}</TableCell>
              <TableCell className="py-2">{item.manufacturerName}</TableCell>
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
