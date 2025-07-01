import { useState } from "react";

export const useSerialLookup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const lookupSerial = async (serialNumber: string) => {
    setLoading(true);
    setError("");

    try {
      const cleanSerial = serialNumber
        .trim()
        .replace(/[^a-zA-Z0-9-]/g, "")
        .toUpperCase();

      if (!cleanSerial || cleanSerial.length < 3) {
        throw new Error(
          "Please enter a valid serial number (at least 3 characters)"
        );
      }

      // Fetch from backend API
      const res = await fetch(
        `/api/products/filter?serial_number=${encodeURIComponent(cleanSerial)}`
      );
      if (!res.ok)
        throw new Error("An error occurred while looking up the product");
      const data = await res.json();
      if (!data || !data.length) {
        throw new Error(
          "Product not found. Please check the serial number and try again."
        );
      }
      const product = data[0];
      if (!product.full_name) {
        throw new Error("Owner information not found. Please contact support.");
      }

      return {
        product,
        owner: {
          full_name: product.full_name,
          phone: product.phone,
          email: product.email,
          company: product.company,
        },
      };
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    lookupSerial,
    loading,
    error,
    setError,
  };
};
