import { IManufacturer } from "@/lib/types/IManufacturer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";
import dayjs from "dayjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@components/ui/dropdown-menu";
import { Edit, EllipsisVertical, Trash2 } from "lucide-react";
import React from "react";
import { EditManufacturerModal } from "./EditManufacturerModal";
import { DeleteManufacturerModal } from "./DeleteManufacturerModal";

interface IManufacturersList {
  data: IManufacturer[];
  refetch: () => void;
}

export default function ManufacturersList({ data, refetch }: IManufacturersList) {
  const [editModal, setEditModal] = React.useState<boolean>(false);
  const [deleteModal, setDeleteModal] = React.useState<boolean>(false);
  const [manufacturer, setManufacturer] = React.useState<IManufacturer | null>(null);

  return (
    <React.Fragment>
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
            data.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium py-2">{index + 1}</TableCell>
                <TableCell className="py-2">{item.manufacturerName}</TableCell>
                <TableCell className="py-2">{dayjs(item.createdAt).format("D MMM YYYY")}</TableCell>
                <TableCell className="grid place-items-center py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="bg-accent w-8 h-8 rounded-full hover:bg-gray-200 grid place-items-center">
                      <EllipsisVertical className="text-gray-500 w-5 h-5" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setManufacturer(item);
                        setEditModal(true);
                      }}>
                        <Edit className="w-4" />
                        <span className="ml-2">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer" onClick={() => {
                        setManufacturer(item);
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
      <React.Fragment>
        { editModal && <EditManufacturerModal open={editModal} setEditModal={setEditModal} setManufacturer={setManufacturer} manufacturer={manufacturer} refetch={refetch} /> }
      </React.Fragment>
      <React.Fragment>
        {
          deleteModal && <DeleteManufacturerModal refetch={refetch} open={deleteModal} setDeleteModal={setDeleteModal} setManufacturer={setManufacturer} manufacturer={manufacturer} />
        }
      </React.Fragment>
    </React.Fragment>
  )
}
