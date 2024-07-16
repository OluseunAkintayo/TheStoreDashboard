import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import dayjs from "dayjs";
import { Edit, EllipsisVertical, Trash2 } from "lucide-react";
import { ICategory } from "@/lib/types/ICategory";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import React from "react";
import { EditCategoryModal } from "./EditCategoryModal";
import { DeleteCategoryModal } from "./DeleteCategoryModal";

interface ICategoryList {
  data: Array<ICategory>;
  refetch: () => void;
}

export default function CategoryList({ data, refetch }: ICategoryList) {
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [category, setCategory] = React.useState<ICategory | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">S/N</TableHead>
            <TableHead>Category Name</TableHead>
            <TableHead>Category Description</TableHead>
            <TableHead>Date Created</TableHead>
            <TableHead>Status</TableHead>
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
                <TableCell className="py-2">{item.isActive ? "Active" : "Inactive"}</TableCell>
                <TableCell className="flex justify-center gap-2 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-accent w-8 h-8 rounded-full hover:bg-gray-200 grid place-items-center">
                      <EllipsisVertical className="text-gray-500 w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setCategory(item);
                        setEditModal(true);
                      }}>
                        <Edit className="w-4" />
                        <span className="ml-2">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setCategory(item);
                        setDeleteModal(true);
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
      {editModal && <EditCategoryModal open={editModal} category={category} refetch={refetch} setCategory={setCategory} setEditModal={setEditModal} />}
      {deleteModal && <DeleteCategoryModal open={deleteModal} category={category} setCategory={setCategory} refetch={refetch} setDeleteModal={setDeleteModal} />}
    </>
  )
}
