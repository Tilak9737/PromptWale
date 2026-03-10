"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

export default function CategorySort({ currentSort }: { currentSort: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams.toString());
        if (val === "Newest First") {
            params.delete("sort");
        } else {
            params.set("sort", val);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            value={currentSort}
            onChange={handleSortChange}
            className="px-4 py-2 border border-border rounded-full bg-background hover:bg-muted transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
        >
            <option>Newest First</option>
            <option>Most Copied</option>
            <option>Trending</option>
        </select>
    );
}
