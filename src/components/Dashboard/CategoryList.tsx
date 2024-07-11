import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import dayjs from "dayjs";
import { Eye, Trash } from "lucide-react";
import { ICategory } from "@/lib/types/ICategory";

interface ICategoryList {
  data: Array<ICategory>;
}

export default function CategoryList({ data }: ICategoryList) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">S/N</TableHead>
          <TableHead>Category Name</TableHead>
          <TableHead>Category Description</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {
          data.map((item, index) => (
            <TableRow key={item.categoryName}>
              <TableCell className="font-medium py-2">{index + 1}</TableCell>
              <TableCell className="py-2">{item.categoryName}</TableCell>
              <TableCell className="py-2">{item.description}</TableCell>
              <TableCell className="py-2">{dayjs(item.createdAt).format("D/M/YYYY h:mm A")}</TableCell>
              <TableCell className="flex justify-center gap-2 py-2">
                <button className="grid place-items-center bg-accent w-8 h-8 rounded-full hover:bg-gray-200">
                  <Eye className="text-gray-500 w-4 h-4" />
                </button>
                <button className="grid place-items-center bg-accent w-8 h-8 rounded-full hover:bg-gray-200">
                  <Trash className="text-gray-500 w-4 h-4" />
                </button>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
