import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const kgToLb = (kg: number) => Math.round(kg * 2.20462);
const lpmToGpm = (lpm: number) => (lpm * 0.264172).toFixed(1);
const tonToLb = (ton: number) => Math.round(ton * 2204.62);
const mmToInch = (mm: number) => (mm * 0.0393701).toFixed(1);

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [product, setProduct] = useState<any>(null);
  const [unitSystem, setUnitSystem] = useState<"si" | "imperial">("si");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-center py-16">Loading...</div>;
  if (error || !product) return <div className="text-center py-16 text-red-500">{error || "Product not found"}</div>;

  // --- SI/Imperial conversions ---
  const opWeight = unitSystem === "si"
    ? product.operating_weight + " kg"
    : kgToLb(product.operating_weight) + " lb";
  const oilFlow = unitSystem === "si"
    ? (product.required_oil_flow ? product.required_oil_flow + " l/min" : "-")
    : (product.required_oil_flow ? lpmToGpm(product.required_oil_flow) + " gal/min" : "-");
  const carrier = unitSystem === "si"
    ? product.applicable_carrier
    : product.applicable_carrier?.replace(/([\d.]+) ton/g, (m, n) => tonToLb(Number(n)) + " lb");

  // --- Specification table rows ---
  const specs = [
    { label: "Body Weight", value: unitSystem === "si" ? (product.body_weight ? product.body_weight + " kg" : "-") : (product.body_weight ? kgToLb(product.body_weight) + " lb" : "-") },
    { label: "Operating Weight", value: opWeight },
    { label: "Overall Length", value: unitSystem === "si" ? (product.overall_length ? product.overall_length + " mm" : "-") : (product.overall_length ? mmToInch(product.overall_length) + " in" : "-") },
    { label: "Overall Width", value: unitSystem === "si" ? (product.overall_width ? product.overall_width + " mm" : "-") : (product.overall_width ? mmToInch(product.overall_width) + " in" : "-") },
    { label: "Overall Height", value: unitSystem === "si" ? (product.overall_height ? product.overall_height + " mm" : "-") : (product.overall_height ? mmToInch(product.overall_height) + " in" : "-") },
    { label: "Required Oil Flow", value: oilFlow },
    { label: "Operating Pressure", value: product.operating_pressure ? product.operating_pressure + (unitSystem === "si" ? " bar" : " psi") : "-" },
    { label: "Impact Rate (STD Mode)", value: product.impact_rate ? product.impact_rate + " BPM" : "-" },
    { label: "Impact Rate (Soft Rock)", value: product.impact_rate_soft_rock ? product.impact_rate_soft_rock + " BPM" : "-" },
    { label: "Hose Diameter", value: product.hose_diameter ? product.hose_diameter + (unitSystem === "si" ? " mm" : " in") : "-" },
    { label: "Rod Diameter", value: product.rod_diameter ? product.rod_diameter + (unitSystem === "si" ? " mm" : " in") : "-" },
    { label: "Applicable Carrier", value: carrier },
  ];

  return (
    <div className="min-h-screen bg-background px-2 md:px-0">
      <div className="container mx-auto max-w-6xl py-8">
        {/* Top section: image + details */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center md:items-start mb-12">
          <div className="flex-1 flex justify-center items-center bg-white rounded-xl shadow-lg p-6 min-h-[350px] max-h-[450px]">
            <img
              src={product.image_url}
              alt={product.name}
              className="max-h-[400px] w-auto h-auto object-contain mx-auto"
              style={{ maxWidth: "100%", maxHeight: 400 }}
              onError={e => (e.currentTarget.src = "/placeholder.svg")}
            />
          </div>
          <div className="flex-1 flex flex-col gap-4">
            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full w-fit mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-[#003366] dark:text-[#ffb200] mb-2">
              {product.name} {product.type ? <span className="font-normal text-lg">{product.type}</span> : null}
            </h1>
            <div className="flex flex-wrap gap-4 mb-4">
              <div className="flex flex-col">
                <span className="text-sm text-[#b0b0b0]">Operating Weight</span>
                <span className="text-xl font-bold text-[#003366] dark:text-[#ffb200]">{opWeight}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#b0b0b0]">Required Oil Flow</span>
                <span className="text-xl font-bold text-[#003366] dark:text-[#ffb200]">{oilFlow}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-[#b0b0b0]">Applicable Carrier</span>
                <span className="text-xl font-bold text-[#003366] dark:text-[#ffb200]">{carrier}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <Button variant={unitSystem === "si" ? "default" : "outline"} onClick={() => setUnitSystem("si")}>SI</Button>
              <Button variant={unitSystem === "imperial" ? "default" : "outline"} onClick={() => setUnitSystem("imperial")}>lb-ft</Button>
              <Button variant="outline" onClick={() => navigate(-1)} className="ml-auto">Back</Button>
            </div>
          </div>
        </div>
        {/* Specifications table */}
        <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
          <h2 className="text-2xl font-bold mb-6 text-[#003366] dark:text-[#ffb200]">Specifications</h2>
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              {specs.map((row) => (
                <tr key={row.label} className="border-b last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-gray-700 bg-gray-50 w-64">{row.label}</td>
                  <td className="px-4 py-3 text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
