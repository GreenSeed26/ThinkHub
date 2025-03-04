import React from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <form>
      <div className="relative">
        <Input placeholder="Search" className="sm:pe-10" />
        <Search className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform text-muted-foreground" />
      </div>
    </form>
  );
}
