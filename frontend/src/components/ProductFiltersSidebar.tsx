import React from "react";

export type ProductFilters = {
  category?: string[];
  type?: string[];
  operatingWeight?: string[];
  oilFlow?: string[];
  applicableCarrier?: string[];
};

const CATEGORY_OPTIONS = ["SQ Line", "SB Line", "SB-E Line", "ET-II Line"];
const TYPE_OPTIONS = [
  "Side",
  "Side Silenced",
  "Top Direct",
  "Top Cap",
  "TR-F",
  "TS-P",
  "SQ Easylube",
  "Backhoe",
  "Backhoe Silenced",
  "Skid Steer Loader",
];
const OPERATING_WEIGHT_OPTIONS = [
  "~500kg",
  "500-1400kg",
  "1400-2000kg",
  "2000-3000kg",
  "3000-5000kg",
  "5000kg+",
];
const OIL_FLOW_OPTIONS = [
  "~35l/min",
  "35-55l/min",
  "55-70l/min",
  "70-95/min",
  "95-165l/min",
  "165/min+",
];
const APPLICABLE_CARRIER_OPTIONS = [
  "~5ton",
  "5-14ton",
  "14-20ton",
  "20-30ton",
  "30-50ton",
  "50+ton",
];

interface Props {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
}

function handleCheckboxChange(
  arr: string[] | undefined,
  value: string,
  checked: boolean
): string[] {
  arr = arr || [];
  if (checked) return [...arr, value];
  return arr.filter((v) => v !== value);
}

const sectionClass =
  "mb-6 pb-4 border-b border-gray-200 last:border-b-0 last:mb-0 last:pb-0";

const labelClass =
  "block font-semibold mb-3 text-gray-700 text-base tracking-wide";

const checkboxClass =
  "accent-primary focus:ring-2 focus:ring-primary/50 rounded transition-all duration-150 w-5 h-5";

const ProductFiltersSidebar: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <aside
      className="sticky top-6 md:top-24 bg-white/90 backdrop-blur border border-gray-200 rounded-xl shadow-lg p-6 w-full md:w-64 max-w-full md:max-w-xs mx-auto md:mx-0 mb-6 md:mb-0"
      style={{ alignSelf: "flex-start" }}
    >
      <h4 className="font-extrabold text-2xl mb-7 text-primary tracking-tight text-center md:text-left">
        Filters
      </h4>
      <div className={sectionClass}>
        <label className={labelClass}>Category</label>
        <div className="flex flex-wrap gap-3">
          {CATEGORY_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-base font-medium bg-gray-100 px-3 py-2 rounded shadow-sm cursor-pointer hover:bg-primary/10 transition"
            >
              <input
                type="checkbox"
                className={checkboxClass}
                checked={filters.category?.includes(opt) || false}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    category: handleCheckboxChange(
                      filters.category,
                      opt,
                      e.target.checked
                    ),
                  })
                }
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className={sectionClass}>
        <label className={labelClass}>Type</label>
        <div className="flex flex-wrap gap-3">
          {TYPE_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-base font-medium bg-gray-100 px-3 py-2 rounded shadow-sm cursor-pointer hover:bg-primary/10 transition"
            >
              <input
                type="checkbox"
                className={checkboxClass}
                checked={filters.type?.includes(opt) || false}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    type: handleCheckboxChange(
                      filters.type,
                      opt,
                      e.target.checked
                    ),
                  })
                }
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className={sectionClass}>
        <label className={labelClass}>Operating Weight</label>
        <div className="flex flex-wrap gap-3">
          {OPERATING_WEIGHT_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-base font-medium bg-gray-100 px-3 py-2 rounded shadow-sm cursor-pointer hover:bg-primary/10 transition"
            >
              <input
                type="checkbox"
                className={checkboxClass}
                checked={filters.operatingWeight?.includes(opt) || false}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    operatingWeight: handleCheckboxChange(
                      filters.operatingWeight,
                      opt,
                      e.target.checked
                    ),
                  })
                }
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className={sectionClass}>
        <label className={labelClass}>Required Oil Flow</label>
        <div className="flex flex-wrap gap-3">
          {OIL_FLOW_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-base font-medium bg-gray-100 px-3 py-2 rounded shadow-sm cursor-pointer hover:bg-primary/10 transition"
            >
              <input
                type="checkbox"
                className={checkboxClass}
                checked={filters.oilFlow?.includes(opt) || false}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    oilFlow: handleCheckboxChange(
                      filters.oilFlow,
                      opt,
                      e.target.checked
                    ),
                  })
                }
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className={sectionClass}>
        <label className={labelClass}>Applicable Carrier</label>
        <div className="flex flex-wrap gap-3">
          {APPLICABLE_CARRIER_OPTIONS.map((opt) => (
            <label
              key={opt}
              className="flex items-center gap-2 text-base font-medium bg-gray-100 px-3 py-2 rounded shadow-sm cursor-pointer hover:bg-primary/10 transition"
            >
              <input
                type="checkbox"
                className={checkboxClass}
                checked={filters.applicableCarrier?.includes(opt) || false}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    applicableCarrier: handleCheckboxChange(
                      filters.applicableCarrier,
                      opt,
                      e.target.checked
                    ),
                  })
                }
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <button
        className="w-full bg-primary text-white font-semibold rounded-lg px-4 py-2 mt-4 shadow hover:bg-primary/90 transition text-lg"
        onClick={() => onChange({})}
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default ProductFiltersSidebar;
