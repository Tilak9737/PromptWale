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
            className="clay-soft cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
            <option>Newest First</option>
            <option>Most Copied</option>
            <option>Trending</option>
        </select>
    );
}
