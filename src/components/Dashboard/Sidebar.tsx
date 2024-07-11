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
          location.pathname === "/vendor/dashboard" && "bg-accent"
        )}>
          <Link to="/vendor/dashboard" className="block w-full">Home</Link>
        </button>
        <Separator className="my-2" />
        <div className="grid mt-2 gap-1">
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/vendor/products" && "bg-accent"
          )}>
            <Link to="/vendor/products" className="block w-full">Products List</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/vendor/categories" && "bg-accent"
          )}>
            <Link to="/vendor/categories" className="block w-full">Categories</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/vendor/brands" && "bg-accent"
          )}>
            <Link to="/vendor/brands" className="block w-full">Brands</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/vendor/manufacturers" && "bg-accent"
          )}>
            <Link to="/vendor/manufacturers" className="block w-full">Manufacturers</Link>
          </button>
        </div>
        <Separator className="my-2" />
        <div className="grid mt-2">
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/vendor/reporting" && "bg-accent"
          )}>
            <Link to="/vendor/products" className="w-full">Inventory Report</Link>
          </button>
          <button className={cn(
            "block text-left text-sm px-4 py-1 hover:bg-accent",
            location.pathname === "/vendor/reporting" && "bg-accent"
          )}>
            <Link to="/vendor/products" className="w-full">Sales Report</Link>
          </button>
        </div>
        <Separator className="my-2" />
      </div>
    </div>
  )
}
