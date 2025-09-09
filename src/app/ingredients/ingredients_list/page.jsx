
'use client';
import { useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Download, Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { formatPathname } from "@/lib/formatPathName";

const PAGE_SIZE = 5;

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [commandValue, setCommandValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  const paths = formatPathname(pathname);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  const commandRef = useRef(null);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    fetch(`${serverUrl}/api/v1/ingredients/user/${user.id}`)
      .then(res => res.json())
      .then(data => {
        setIngredients(data.ingredients || []);
      })
      .catch(() => setIngredients([]))
      .finally(() => setLoading(false));
  }, [user?.id, serverUrl]);

  // Filter suggestions according to commandValue dynamically
  const filteredSuggestions = useMemo(() => {
    if (commandValue.trim() === '') {
      // Show all ingredients if input is empty
      return ingredients;
    }
    // Show filtered ingredients based on search query (case insensitive)
    return ingredients.filter(ing =>
      ing?.generalInformation?.ingredientName?.toLowerCase().includes(commandValue.toLowerCase())
    );
  }, [ingredients, commandValue]);

  // For paginated list filtered by current search from CommandInput or manual search
  const filteredIngredients = useMemo(() => {
    if (search.trim() === '') return ingredients;
    return ingredients.filter(ing =>
      ing?.generalInformation?.ingredientName?.toLowerCase().includes(search.toLowerCase())
    );
  }, [ingredients, search]);

  const pageCount = Math.ceil(filteredIngredients.length / PAGE_SIZE);
  const pageIngredients = filteredIngredients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Handle selecting a suggestion from Command dropdown
  const onSelect = (value) => {
    setSearch(value);
    setCommandValue('');
    setShowSuggestions(false);
    setPage(1);
  };

  // Close suggestion list when clicking outside command dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (commandRef.current && !commandRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setCommandValue('');
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const downloadCsv = () => {
    const headers = ["Name", "Description", "Status"];
    const rows = filteredIngredients.map(ing => [
      ing.generalInformation?.ingredientName,
      ing.generalInformation?.ingredientDescription || "",
      ing.status
    ]);
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredients.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] justify-center items-center">
        <Loader2 className="w-14 h-14 text-green-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="mt-24 sm:mt-20 px-2 sm:px-4">
      {/* Breadcrumb */}
      <div className="text-green-800 text-lg sm:text-xl flex items-center gap-1 flex-wrap">
        {paths.length > 1 ? (
          <>
            <div className="font-semibold">{paths[0]}</div>
            <ChevronRight className="w-4 h-4 text-green-800" />
            <div className='font-bold'>
              <span
                className="cursor-pointer hover:underline"
                onClick={() => window.location.href = `/ingredients/ingredients_list`}
              >
                {paths[1]}
              </span>
            </div>
          </>
        ) : (
          <div>{paths}</div>
        )}
      </div>

      <div className="mt-2 p-4 sm:p-6 bg-white rounded-xl shadow-md">
        {/* Header + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-green-800">Ingredients List</h2>
          <div className="flex items-center gap-2 w-full sm:w-auto" ref={commandRef}>

            <Command
              value={commandValue}
              onValueChange={(value) => {
                setCommandValue(value);
                setShowSuggestions(true);
              }}
              className="w-full sm:w-64 border-2"
            >
              <CommandInput
                placeholder="Search here"
                className="placeholder-green-600 rounded-md py-2 px-3 text-green-700"
              />
              {showSuggestions && (
                <CommandList className="max-h-60 overflow-y-auto">
                  {filteredSuggestions.length === 0 ? (
                    <CommandEmpty>No ingredients found.</CommandEmpty>
                  ) : (
                    <CommandGroup>
                      {filteredSuggestions.map(ing => (
                        <CommandItem
                          key={ing._id}
                          value={ing?.generalInformation?.ingredientName || ''}
                          onSelect={onSelect}
                        >
                          {ing?.generalInformation?.ingredientName || ''}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              )}
            </Command>

            <Button variant="outline" size="icon" onClick={downloadCsv} title="Download CSV">
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="whitespace-nowrap w-[34%] sm:w-[30%]">Ingredients</TableHead>
                <TableHead className="whitespace-nowrap w-[48%] sm:w-[55%]">Description</TableHead>
                <TableHead className="text-right whitespace-nowrap w-[18%] sm:w-[15%]">Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageIngredients.map(ing => (
                <TableRow
                  key={ing._id}
                  className="cursor-pointer hover:bg-green-50 transition"
                  onClick={() => router.push(`/ingredients/ingredient-detail/${ing._id}`)}
                  tabIndex={0}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      router.push(`/ingredients/ingredient-detail/${ing._id}`);
                    }
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2 min-w-0">
                      {ing?.generalInformation?.ingredientURL
                        ? <img src={ing?.generalInformation?.ingredientURL} alt={ing?.generalInformation?.ingredientName} className="w-6 h-6 rounded-full object-cover" />
                        : <div className="w-6 h-6 rounded-full bg-gray-200" />}
                      <span className="truncate whitespace-nowrap block min-w-0">
                        {ing?.generalInformation?.ingredientName}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell title={ing?.generalInformation?.ingredientDescription} className="min-w-0 truncate whitespace-nowrap block">
                    {(ing?.generalInformation?.ingredientDescription || '').length > 80
                      ? (ing?.generalInformation?.ingredientDescription || '').slice(0, 80) + "..."
                      : ing?.generalInformation?.ingredientDescription || ''}
                  </TableCell>

                  <TableCell
                    className={`text-right font-semibold whitespace-nowrap ${
                      ing?.status === 'Inactive'
                        ? 'text-red-600'
                        : ing?.status === 'Active'
                        ? 'text-green-700'
                        : 'text-gray-600'
                    }`}
                  >
                    {ing?.status}
                  </TableCell>
                </TableRow>
              ))}

              {pageIngredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">No ingredients found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-end mt-4 gap-1 flex-wrap">
            <Button size="icon" variant="ghost" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {[...Array(pageCount).keys()].map(n => (
              <Button
                key={n + 1}
                size="icon"
                variant={page === n + 1 ? "default" : "ghost"}
                onClick={() => setPage(n + 1)}
                className={page === n + 1 ? "bg-green-700 text-white" : ""}
              >
                {n + 1}
              </Button>
            ))}
            <Button size="icon" variant="ghost" disabled={page >= pageCount} onClick={() => setPage(p => Math.min(pageCount, p + 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

