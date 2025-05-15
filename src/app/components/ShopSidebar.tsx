import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Category } from "@/app/types/category.types";
import { Filter } from "@/app/types/product.types";

interface ShopSidebarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categories: Category[];
  selectedCategory: string[];
  onCategoryChange: (categoryId: string) => void;
  sortOrder: string;
  onSortChange: (value: Filter["sortOrder"]) => void;
  t: (key: string) => string;
  isMobileFiltersOpen: boolean;
}

export function ShopSidebar({
  searchTerm,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sortOrder,
  onSortChange,
  t,
  isMobileFiltersOpen,
}: ShopSidebarProps) {
  return (
    <aside
      className={`lg:w-1/4 ${
        isMobileFiltersOpen ? "block" : "hidden"
      } lg:block`}
    >
      <div className="bg-gray rounded-lg shadow-lg p-6 sticky top-4 space-y-6">
        {/* Search */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-darkGray">
            {t("shop.search")}
          </h3>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("shop.searchPlaceholder")}
            className="w-full focus-visible:ring-primary bg-white text-darkGray placeholder:text-lightGray"
          />
        </div>

        {/* Categories */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-darkGray">
            {t("shop.categories")}
          </h3>
          <div className="space-y-3">
            {categories?.map((category) => (
              <div
                key={category.id}
                className={`p-2 border-[1px] border-darkGray rounded-lg transition-all duration-200 ${
                  selectedCategory.includes(category.id!)
                    ? "bg-primary/10 shadow-md"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <label className="flex items-center gap-4 cursor-pointer group">
                  <Checkbox
                    id={category.id}
                    checked={selectedCategory.includes(category.id!)}
                    onCheckedChange={() => onCategoryChange(category.id!)}
                    className="border-2 border-darkGray data-[state=checked]:border-primary data-[state=checked]:bg-primary hover:border-primary transition-colors"
                  />
                  <span
                    className={`font-medium transition-colors duration-200 ${
                      selectedCategory.includes(category.id!)
                        ? "text-primary"
                        : "text-darkGray group-hover:text-primary"
                    }`}
                  >
                    {category.name}
                  </span>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-darkGray">
            {t("shop.sortBy")}
          </h3>
          <Select
            value={sortOrder}
            onValueChange={(value) =>
              onSortChange(value as Filter["sortOrder"])
            }
          >
            <SelectTrigger className="w-full focus:ring-primary bg-white text-darkGray">
              <SelectValue placeholder={t("shop.sortBy")} />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="DESC" className="text-darkGray hover:text-primary hover:bg-gray/50">{t("shop.newest")}</SelectItem>
              <SelectItem value="ASC" className="text-darkGray hover:text-primary hover:bg-gray/50">{t("shop.oldest")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </aside>
  );
}
