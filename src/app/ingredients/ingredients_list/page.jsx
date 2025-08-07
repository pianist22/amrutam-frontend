'use client';
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup
} from "@/components/ui/command";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { formatPathname } from "@/lib/formatPathName";
import { useUser } from "@clerk/nextjs";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 5;

const IngredientsList = () => {
  const [ingredients, setIngredients] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [commandValue, setCommandValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useUser();
  const pathname = usePathname();
  const router = useRouter();                  // <-- Add router for navigation
  const paths = formatPathname(pathname);
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch ingredients
  useEffect(() => {
    if (!user?.id) return;
    fetch(`${serverUrl}/api/v1/ingredients/user/${user.id}`)
      .then(res => res.json())
      .then(data => setIngredients(data.ingredients || []));
  }, [user?.id, serverUrl]);

  // Filter ingredients based on search input
  const filteredIngredients = useMemo(() =>
    ingredients.filter(ing =>
      ing?.generalInformation?.ingredientName.toLowerCase().includes(search.toLowerCase())
    ),
    [ingredients, search]
  );

  // Pagination
  const pageCount = Math.ceil(filteredIngredients.length / PAGE_SIZE);
  const pageIngredients = filteredIngredients.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Suggestions for Command
  const filteredSuggestions = useMemo(() =>
    commandValue.trim() === ''
      ? ingredients
      : ingredients.filter(ing =>
          ing?.generalInformation?.ingredientName.toLowerCase().includes(commandValue.toLowerCase())
        ),
    [ingredients, commandValue]
  );

  // On selection from suggestion dropdown
  const onSelect = (value) => {
    setSearch(value);
    setCommandValue('');
    setShowSuggestions(false);
    setPage(1);
  };

  // CSV Download as before
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

  return (
    <div className="mt-5">
      {/* Breadcrumb */}
      <div className="text-green-800 text-xl flex items-center gap-1">
        {paths.length > 1 ? (
          <>
            <div className="font-semibold">{paths[0]}</div>
            <ChevronRight className="w-4 h-4 text-green-800" />
            <div className='font-bold'>{paths[1]}</div>
          </>
        ) : (
          <div>{paths[0]}</div>
        )}
      </div>

      <div className="mt-2 p-4 sm:p-8 bg-white rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <h2 className="text-2xl font-bold text-green-800">Ingredients List</h2>
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Command
              value={commandValue}
              onValueChange={(value) => {
                setCommandValue(value);
                setShowSuggestions(true);
              }}
              className="w-full max-w-md border-2"
            >
              <CommandInput
                placeholder="Search here"
                autoComplete="on"
                className="placeholder-green-600 rounded-md py-2 px-3 text-green-700"
              />
              {showSuggestions && (
                <CommandList>
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

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ingredients</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageIngredients.map(ing => (
              <TableRow
                key={ing._id}
                className="cursor-pointer hover:bg-green-50 transition"
                onClick={() =>
                  router.push(
                    `/ingredients/ingredient-detail/${ing._id}`
                  )
                }
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    router.push(
                      `/ingredients/ingredient-detail/${ing._id}`
                    );
                  }
                }}
                aria-label={`View ingredient ${ing?.generalInformation?.ingredientName}`}
              >
                <TableCell className="flex items-center gap-2">
                  {ing?.generalInformation?.ingredientURL
                    ? <img src={ing?.generalInformation?.ingredientURL} alt={ing?.generalInformation?.ingredientName} className="w-6 h-6 rounded-full object-cover" />
                    : <div className="w-6 h-6 rounded-full bg-gray-200" />}
                  <span>{ing?.generalInformation?.ingredientName}</span>
                </TableCell>
                <TableCell title={ing?.generalInformation?.ingredientDescription} className="truncate max-w-xs">
                  {(ing?.generalInformation?.ingredientDescription || '').slice(0, 80) + (ing?.generalInformation?.ingredientDescription?.length > 80 ? "..." : "")}
                </TableCell>
                <TableCell className="text-green-700 text-right font-semibold">{ing?.status}</TableCell>
              </TableRow>
            ))}
            {pageIngredients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center">No ingredients found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex items-center justify-end mt-4 gap-1">
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
};

export default IngredientsList;
