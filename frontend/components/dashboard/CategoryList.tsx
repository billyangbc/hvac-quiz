"use client";

import { useEffect, useState } from "react";
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useModalStore from "@/hooks/useModalStore";
import { getCategories } from "@/lib/actions/category-actions";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Category {
  id: number;
  documentId: string;
  categoryName: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [totalPages, setTotalPages] = useState(1);
  const { onOpen } = useModalStore();

  useEffect(() => {
    // Fixed the missing dependency warning "Warning: React Hook useEffect has a missing dependency"
    // https://stackoverflow.com/questions/55840294/how-to-fix-missing-dependency-warning-when-using-useeffect-react-hook
    const fetchCategories = async () => {
      try {
        const response = await getCategories({
          page: currentPage,
          pageSize: 25,
          sort: `${sortField}:${sortOrder}`,
          search: searchQuery
        });
        if (response.data) {
          setCategories(response.data);
          setTotalPages(response.meta?.pagination?.pageCount || 1);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [currentPage, sortField, sortOrder, searchQuery]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="px-4 space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="cursor-pointer" onClick={() => handleSort("categoryName")}>
              <div className="flex items-center">
                Name
                {sortField === "categoryName" && (
                  sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("createdAt")}>
              <div className="flex items-center">
                Created
                {sortField === "createdAt" && (
                  sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="cursor-pointer" onClick={() => handleSort("updatedAt")}>
              <div className="flex items-center">
                Updated
                {sortField === "updatedAt" && (
                  sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.documentId} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
              <TableCell className="font-medium">{category.categoryName}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(category.updatedAt).toLocaleDateString()}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => useModalStore.getState().onOpen("editCategory", {
                    category: {
                      documentId: category.documentId,
                    }
                  })}
                >
                  <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-600 hover:bg-red-50"
                  onClick={() => onOpen("deleteConfirmation",
                    {
                      delete: {
                        documentId: category.documentId,
                        target: "category"
                      }
                    }
                  )} >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <div>Page {currentPage} of {totalPages}</div>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
