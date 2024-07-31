import { Avatar, AvatarFallback } from "@components/ui/avatar";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@components/ui/menubar"
import { LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";


export default function DashboardHeader() {
  return (
    <header className="p-4 shadow-md">
      <div className="flex items-center gap-4 justify-between">
        <div>
          <h3>Dashboard</h3>
        </div>
        <div className="flex gap-4 items-center">
          <Menubar className="border-none p-0 h-auto">
            <MenubarMenu>
              <MenubarTrigger className="cursor-pointer flex gap-2 items-center">
                <span>Michaelson</span>
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">M</AvatarFallback>
                </Avatar>
              </MenubarTrigger>
              <MenubarContent>
                <MenubarItem className="flex gap-1" disabled>
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">M</AvatarFallback>
                  </Avatar>
                  <span>Michaelson</span>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex gap-2">
                  <Settings className="scale-75" />
                  <Link className="w-full" to="/profile/edit-profile">Edit Profile</Link>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem className="flex gap-2" onClick={() => sessionStorage.clear()}>
                  <LogOut className="scale-75" />
                  <Link className="w-full" to="/auth/login">Logout</Link>
                </MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
      </div>
    </header>
  )
}
