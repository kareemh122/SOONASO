// React and library imports
import { useState } from "react";
import { Link } from "react-router-dom";
// Sidebar filter component and types
import ProductFiltersSidebar, {
  ProductFilters,
} from "@/components/ProductFiltersSidebar";
// UI card components for product display
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// UI input and button components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// Icon for search field
import { Search } from "lucide-react";
// Custom hook for fetching products
import { useProducts } from "@/hooks/useProducts";
// i18n translation hook
import { useTranslation } from "react-i18next";

// Main Products page component
const Products = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState("");
  // State for sidebar filters
  const [filters, setFilters] = useState<ProductFilters>({});
  // State for SI/lb-ft unit toggle
  const [unitSystem, setUnitSystem] = useState<"si" | "imperial">("si");
  // Fetch products from backend (filtered or all)
  const {
    data: products = [],
    isLoading: loading,
    error,
    isFetching,
    isError,
  } = useProducts(filters);
  // Translation function
  const { t } = useTranslation();

  // Filter products by search term (name, model, serial)
  const filteredProducts = products.filter(
    (product) =>
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.serial_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- Conversion helper functions ---
  // Convert kg to lb
  const kgToLb = (kg: number) => Math.round(kg * 2.20462);
  // Convert ton to lb
  const tonToLb = (ton: number) => Math.round(ton * 2204.62);
  // Convert liters per minute to gallons per minute
  const lpmToGpm = (lpm: number) => (lpm * 0.264172).toFixed(1);
  // Convert mm to inches
  const mmToInch = (mm: number) => (mm * 0.0393701).toFixed(1);

  // Parse and convert range strings (e.g., "20~40")
  const convertRange = (
    val: string,
    fn: (n: number) => number | string,
    unit: string
  ) => {
    if (!val) return "-";
    const match = val.match(/([\d.]+)[~-]([\d.]+)/); // removed unnecessary escape
    if (match) {
      const n1 = parseFloat(match[1]);
      const n2 = parseFloat(match[2]);
      return `${fn(n1)}~${fn(n2)} ${unit}`;
    }
    const single = parseFloat(val);
    if (!isNaN(single)) return `${fn(single)} ${unit}`;
    return val;
  };

  // Convert applicable carrier string based on unit system
  const convertCarrier = (val: string, system: "si" | "imperial") => {
    if (!val) return "-";
    const match = val.match(/([\d.]+)[~-]([\d.]+)\s*ton/); // removed unnecessary escape
    if (system === "imperial" && match) {
      const n1 = parseFloat(match[1]);
      const n2 = parseFloat(match[2]);
      return `${tonToLb(n1)}~${tonToLb(n2)} lb`;
    }
    if (system === "si" && match) {
      return `${match[1]}~${match[2]} ton`;
    }
    // fallback for single value
    const single = val.match(/([\d.]+)\s*ton/);
    if (system === "imperial" && single)
      return `${tonToLb(parseFloat(single[1]))} lb`;
    if (system === "si" && single) return `${single[1]} ton`;
    return val;
  };

  // Calculate warranty status for a product
  const getWarrantyStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const warrantyStart = new Date(startDate);
    const warrantyEnd = new Date(endDate);
    const diffTime = warrantyEnd.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 365)
      return { status: "Active", variant: "default" as const };
    if (diffDays > 90)
      return { status: "Expiring Soon", variant: "secondary" as const };
    if (diffDays > 0)
      return { status: "Expires Soon", variant: "destructive" as const };
    return { status: "Expired", variant: "outline" as const };
  };

  // --- UI rendering ---
  // (Error UI is commented out for now)
  // if (isError && !loading && !isFetching) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-foreground mb-4">
  //           Error Loading Products
  //         </h2>
  //         <p className="text-muted-foreground">
  //           Please try refreshing the page
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-background">
      {/* --- Header section: Title, description, search --- */}
      <section className="bg-gradient-to-r from-[#f7fafd] via-[#eaf3fa] to-[#f7fafd] dark:from-[#101a2b] dark:via-[#1a2333] dark:to-[#101a2b] py-12 md:py-16 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#003366] dark:text-[#ffb200] mb-4 tracking-tight">
              {t("products.catalog")}
            </h2>
            <p className="text-lg text-[#666] dark:text-[#e0e0e0] mb-8 max-w-2xl mx-auto">
              {t("products.description")}
            </p>
            {/* Search input with icon */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#b0b0b0] dark:text-[#ffb200] h-4 w-4" />
              <Input
                type="text"
                placeholder={t("products.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white dark:bg-[#1a2333] border border-[#e0e0e0] dark:border-[#222c3a] text-[#003366] dark:text-[#ffb200] placeholder-[#b0b0b0] dark:placeholder-[#ffb200] rounded-lg shadow focus:ring-2 focus:ring-[#ffb200]"
              />
            </div>
          </div>
        </div>
      </section>
      {/* --- Main content: Sidebar filters and product grid --- */}
      <section className="container mx-auto px-4 flex flex-col md:flex-row gap-8 md:gap-12 py-8 md:py-12">
        {/* Sidebar filter section */}
        <div className="md:w-64 w-full flex-shrink-0">
          <ProductFiltersSidebar filters={filters} onChange={setFilters} />
        </div>
        {/* Product grid section */}
        <div className="flex-1">
          {/* Top bar: product count and SI/lb-ft toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <h3 className="text-2xl font-semibold text-[#003366] dark:text-[#ffb200]">
              Total {filteredProducts.length} products
            </h3>
            <div className="flex items-center gap-2 self-end md:self-auto">
              <span
                className={`font-semibold ${
                  unitSystem === "si"
                    ? "text-[#003366] dark:text-[#ffb200]"
                    : "text-[#b0b0b0] dark:text-[#e0e0e0]"
                }`}
              >
                SI
              </span>
              <button
                className={`relative w-14 h-8 bg-[#eaf3fa] dark:bg-[#222c3a] rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#ffb200]/50 mx-2`}
                onClick={() =>
                  setUnitSystem(unitSystem === "si" ? "imperial" : "si")
                }
                aria-label="Toggle units"
              >
                <span
                  className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white dark:bg-[#003366] shadow transition-transform duration-200 ${
                    unitSystem === "imperial" ? "translate-x-6" : ""
                  }`}
                  style={{
                    transform:
                      unitSystem === "imperial"
                        ? "translateX(24px)"
                        : "translateX(0)",
                  }}
                />
              </button>
              <span
                className={`font-semibold ${
                  unitSystem === "imperial"
                    ? "text-[#003366] dark:text-[#ffb200]"
                    : "text-[#b0b0b0] dark:text-[#e0e0e0]"
                }`}
              >
                lb-ft
              </span>
            </div>
          </div>
          {/* Product cards grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              // Get warranty status for badge
              const warranty = getWarrantyStatus(
                product.warranty_start,
                product.warranty_end
              );
              // SI/Imperial conversions for display
              const opWeightSI = product.operating_weight_kg
                ? `${product.operating_weight_kg} kg`
                : "-";
              const opWeightImperial = product.operating_weight_kg
                ? `${kgToLb(product.operating_weight_kg)} lb`
                : "-";
              const oilFlowSI = product.required_oil_flow_lpm
                ? `${product.required_oil_flow_lpm} l/min`
                : "-";
              const oilFlowImperial = product.required_oil_flow_lpm
                ? `${lpmToGpm(product.required_oil_flow_lpm)} gal/min`
                : "-";
              const carrierSI = product.applicable_carrier_si
                ? convertCarrier(product.applicable_carrier_si, "si")
                : "-";
              const carrierImperial = product.applicable_carrier_si
                ? convertCarrier(product.applicable_carrier_si, "imperial")
                : "-";
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden card-modern bg-white dark:bg-[#1a2333] border border-[#e0e0e0] dark:border-[#222c3a] hover:shadow-modern transition-shadow"
                >
                  {/* Product image */}
                  <div className="aspect-video overflow-hidden bg-[#f7fafd] dark:bg-[#101a2b]">
                    <img
                      src={product.image_url}
                      alt={product.product_name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  {/* Product name, model, and warranty badge */}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold text-[#003366] dark:text-[#ffb200] mb-1">
                          {product.product_name}
                        </CardTitle>
                        <CardDescription className="font-mono text-sm text-[#b0b0b0] dark:text-[#e0e0e0]">
                          {t("products.model", {
                            model: product.product_model,
                          })}
                        </CardDescription>
                      </div>
                      {/* Warranty status badge */}
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm
                          ${
                            warranty.status === "Active"
                              ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800"
                              : ""
                          }
                          ${
                            warranty.status === "Expiring Soon"
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800"
                              : ""
                          }
                          ${
                            warranty.status === "Expired"
                              ? "bg-red-100 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800"
                              : ""
                          }
                          ${
                            warranty.status === "Not Started"
                              ? "bg-gray-100 text-gray-700 border border-gray-200 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-800"
                              : ""
                          }
                        `}
                        title={
                          warranty.status === "Active"
                            ? t("products.warrantyActive")
                            : warranty.status === "Expiring Soon"
                            ? t("products.warrantyExpiring")
                            : warranty.status === "Expired"
                            ? t("products.warrantyExpired")
                            : t("products.warrantyNotStarted")
                        }
                      >
                        {t(
                          `products.warrantyStatus.${warranty.status.replace(
                            /\s/g,
                            ""
                          )}`
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  {/* Product measurements section */}
                  <CardContent>
                    <div className="mb-2 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-base font-medium">
                        <span className="text-[#b0b0b0] dark:text-[#e0e0e0] font-normal">
                          {unitSystem === "si"
                            ? "Operating Weight"
                            : "Operating Weight (lb)"}
                        </span>
                        <span className="font-bold text-[#003366] dark:text-[#ffb200]">
                          {unitSystem === "si" ? opWeightSI : opWeightImperial}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-base font-medium">
                        <span className="text-[#b0b0b0] dark:text-[#e0e0e0] font-normal">
                          {unitSystem === "si"
                            ? "Required Oil Flow"
                            : "Required Oil Flow (gal/min)"}
                        </span>
                        <span className="font-bold text-[#003366] dark:text-[#ffb200]">
                          {unitSystem === "si" ? oilFlowSI : oilFlowImperial}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-base font-medium">
                        <span className="text-[#b0b0b0] dark:text-[#e0e0e0] font-normal">
                          {unitSystem === "si"
                            ? "Applicable Carrier"
                            : "Applicable Carrier (lb)"}
                        </span>
                        <span className="font-bold text-[#003366] dark:text-[#ffb200]">
                          {unitSystem === "si" ? carrierSI : carrierImperial}
                        </span>
                      </div>
                    </div>
                    {/* Serial lookup button */}
                    <Button
                      className="w-full mt-4 button-modern border-[#003366] dark:border-[#ffb200] text-[#003366] dark:text-[#ffb200] hover:bg-[#ffb200] hover:text-white dark:hover:bg-[#003366] dark:hover:text-white transition"
                      variant="outline"
                      onClick={() => {
                        window.location.href = `/serial-lookup?serial=${product.serial_number}`;
                      }}
                    >
                      {t("products.verify")}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Empty state if no products match search/filter */}
          {filteredProducts.length === 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-[#b0b0b0] dark:text-[#ffb200] mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-[#003366] dark:text-[#ffb200] mb-2">
                {t("products.noProducts")}
              </h3>
              <p className="text-[#b0b0b0] dark:text-[#e0e0e0] mb-4">
                {t("products.tryAdjusting")}
              </p>
              {/* Button to clear search and filters */}
              <Button
                className="button-modern border-[#003366] dark:border-[#ffb200] text-[#003366] dark:text-[#ffb200] hover:bg-[#ffb200] hover:text-white dark:hover:bg-[#003366] dark:hover:text-white transition"
                onClick={() => setSearchTerm("")}
              >
                {t("products.clearSearch")}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

// Export the Products page as default
export default Products;
