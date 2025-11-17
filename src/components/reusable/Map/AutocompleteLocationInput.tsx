import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { toast } from "sonner";

interface LocationResult {
  lat: number;
  lng: number;
  display: string;
}

interface LocationSearchProps {
  onLocationSelect: (coords: { lat: number; lng: number }) => void;
}

export default function AutocompleteLocationInput({
  onLocationSelect,
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [ignoreNextEffect, setIgnoreNextEffect] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch autocomplete suggestions
  useEffect(() => {
    if (ignoreNextEffect) {
      setIgnoreNextEffect(false);
      return;
    }

    if (query.trim().length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`;

        const res = await fetch(url, {
          headers: { "Accept-Language": "en" },
        });
        const data = await res.json();

        const formatted = data.map((item: any) => ({
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            display: item.display_name,
        }));

        setResults(formatted);
        setShowDropdown(true);
      } catch (err) {
        toast.error("Failed to fetch locations.");
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, ignoreNextEffect]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (item: LocationResult) => {
    setQuery(item.display);
    setShowDropdown(false);
    setIgnoreNextEffect(true); // Prevent refetch
    onLocationSelect({ lat: item.lat, lng: item.lng });
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex gap-2">
        <Input
          className="border-primary-500 placeholder:text-neutral-500"
          placeholder="Search for a location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
        />
        <Button disabled={loading}>
          {loading ? "..." : <Search size={18} />}
        </Button>
      </div>

      {/* Autocomplete dropdown */}
      {showDropdown && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border rounded-md shadow-md max-h-60 overflow-auto z-50">
          {results.map((item) => (
            <li
              key={item.display}
              className="p-3 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSelect(item)}
            >
              {item.display}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {showDropdown && !loading && results.length === 0 && query.length >= 3 && (
        <div className="absolute top-full left-0 right-0 p-3 bg-white border rounded-md shadow-md text-sm text-neutral-500">
          No results
        </div>
      )}
    </div>
  );
}
