import { Skeleton } from "@components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@components/ui/table";

export default function ManufacturerLoading() {
  return (
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
          Array(10).fill(0).map((i) => (
            <TableRow key={i}>
              <TableCell className="font-medium"><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
              <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
              <TableCell><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
              <TableCell className="grid place-items-center"><Skeleton className="h-[32px] w-full bg-gray-300" /></TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
