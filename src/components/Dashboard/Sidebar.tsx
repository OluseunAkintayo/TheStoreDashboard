import { Link, useLocation } from "react-router-dom";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="shadow-md w-[200px]" style={{ height: 'calc(100dvh - 64px)' }}>
      <div className="p-4">
        <button className={cn(
          "block w-full text-left text-sm px-4 py-1 hover:bg-accent",
          location.pathname === "/admin" && "bg-accent"
        )}>
          <Link to="/admin" className="block w-full">Home</Link>
        </button>
        <Separator className="my-2" />
        <div className="grid mt-2 gap-1">
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/admin/products" && "bg-accent"
          )}>
            <Link to="/admin/products" className="block w-full">Products List</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/admin/categories" && "bg-accent"
          )}>
            <Link to="/admin/categories" className="block w-full">Categories</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/admin/brands" && "bg-accent"
          )}>
            <Link to="/admin/brands" className="block w-full">Brands</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/admin/manufacturers" && "bg-accent"
          )}>
            <Link to="/admin/manufacturers" className="block w-full">Manufacturers</Link>
          </button>
        </div>
        <Separator className="my-2" />
        <div className="grid mt-2">
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/admin/reporting" && "bg-accent"
          )}>
            <Link to="/admin/products" className="w-full">Inventory Report</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/admin/reporting" && "bg-accent"
          )}>
            <Link to="/admin/products" className="w-full">Sales Report</Link>
          </button>
        </div>
        <Separator className="my-2" />
      </div>
    </div>
  )
}
