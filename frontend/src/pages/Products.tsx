import { useState } from "react";
import ProductFiltersSidebar, {
  ProductFilters,
} from "@/components/ProductFiltersSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";
import { useTranslation } from "react-i18next";

// Main Products page component
const Products = () => {
  // State for search input
  const [searchTerm, setSearchTerm] = useState(""); // Ensure default is empty
  // State for sidebar filters
  const [filters, setFilters] = useState<ProductFilters>({});
  // State for SI/lb-ft unit toggle
  const [unitSystem, setUnitSystem] = useState<"si" | "imperial">("si");
  // Fetch products from backend (filtered or all)
  const { data: apiResponse } = useProducts(filters);
  const products = apiResponse?.data || [];
  console.log("Fetched products:", products);
  // Translation function
  const { t } = useTranslation();

  // Filter products by search term (name, serial)
  const filteredProducts = products.filter(
    (product) =>
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.serial_number || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );
  console.log("Filtered products:", filteredProducts);

  // --- Conversion helper functions ---
  const kgToLb = (kg: number) => Math.round(kg * 2.20462);
  const lpmToGpm = (lpm: number) => (lpm * 0.264172).toFixed(1);
  const tonToLb = (ton: number) => Math.round(ton * 2204.62);
  // Convert applicable carrier string based on unit system
  const convertCarrier = (val: string, system: "si" | "imperial") => {
    if (!val) return "-";
    const match = val.match(/([\d.]+)[~-]([\d.]+)\s*ton/);
    if (system === "imperial" && match) {
      const n1 = parseFloat(match[1]);
      const n2 = parseFloat(match[2]);
      return `${tonToLb(n1)}~${tonToLb(n2)} lb`;
    }
    if (system === "si" && match) return `${match[1]}~${match[2]} ton`;

    const single = val.match(/([\d.]+)\s*ton/);
    if (system === "imperial" && single)
      return `${tonToLb(parseFloat(single[1]))} lb`;
    if (system === "si" && single) return `${single[1]} ton`;
    return val;
  };

  // --- UI rendering ---
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
                className="relative w-14 h-8 bg-[#eaf3fa] dark:bg-[#222c3a] rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#ffb200]/50 mx-2"
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
          {products.length === 0 && (
            <div className="text-center py-16">
              <p>No products in database. Debug: {JSON.stringify(products)}</p>
            </div>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              // SI/Imperial conversions for display
              const opWeightSI = product.operating_weight
                ? `${product.operating_weight} kg`
                : "-";
              const opWeightImperial = product.operating_weight
                ? `${kgToLb(product.operating_weight)} lb`
                : "-";
              const oilFlowSI = product.required_oil_flow
                ? `${product.required_oil_flow} l/min`
                : "-";
              const oilFlowImperial = product.required_oil_flow
                ? `${lpmToGpm(product.required_oil_flow)} gal/min`
                : "-";
              const carrierSI = product.applicable_carrier
                ? convertCarrier(product.applicable_carrier, "si")
                : "-";
              const carrierImperial = product.applicable_carrier
                ? convertCarrier(product.applicable_carrier, "imperial")
                : "-";
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden card-modern bg-white dark:bg-[#1a2333] border border-[#e0e0e0] dark:border-[#222c3a] hover:shadow-modern transition-shadow cursor-pointer"
                  onClick={() =>
                    window.open(`/products/${product.id}`, "_blank")
                  }
                >
                  {/* Product image */}
                  <div className="aspect-video flex items-center justify-center overflow-hidden bg-[#f7fafd] dark:bg-[#101a2b]">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="max-h-48 w-auto h-auto object-contain mx-auto"
                      style={{ maxWidth: "100%", maxHeight: "12rem" }}
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  {/* Product name and measurements */}
                  <CardHeader>
                    <CardTitle className="text-lg font-bold text-[#003366] dark:text-[#ffb200] mb-1">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
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

export default Products;
