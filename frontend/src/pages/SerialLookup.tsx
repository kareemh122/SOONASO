import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Shield,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
} from "lucide-react";
import { useSerialLookup } from "@/hooks/useSerialLookup";
import { ThemeToggle } from "@/components/ui/theme-toggle";

const SerialLookup = () => {
  const [searchParams] = useSearchParams();
  const [serialNumber, setSerialNumber] = useState("");
  const [result, setResult] = useState<{
    product: {
      product_name: string;
      product_model: string;
      serial_number: string;
      category: string;
      image_url: string;
      purchase_date?: string;
      created_at?: string;
      warranty_start: string;
      warranty_end: string;
    };
    owner: {
      full_name: string;
      phone: string;
      email?: string;
      company?: string;
    };
  } | null>(null);
  const { lookupSerial, loading, error, setError } = useSerialLookup();

  useEffect(() => {
    const prefilledSerial = searchParams.get("serial");
    if (prefilledSerial) {
      setSerialNumber(prefilledSerial);
      handleLookup(prefilledSerial);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleLookup = async (serial?: string) => {
    const searchSerial = serial || serialNumber;

    if (!searchSerial.trim()) {
      setError("Please enter a valid serial number");
      return;
    }

    try {
      const lookupResult = await lookupSerial(searchSerial);
      // Patch: map lookupResult to expected type
      if (lookupResult && lookupResult.product) {
        const { product, owner } = lookupResult;
        setResult({
          product: {
            product_name: product.product_name,
            product_model: product.product_model,
            serial_number: product.serial_number,
            category:
              "category" in product && typeof product.category === "string"
                ? product.category
                : "N/A",
            image_url: product.image_url,
            purchase_date:
              "purchase_date" in product &&
              typeof product.purchase_date === "string"
                ? product.purchase_date
                : undefined,
            created_at: product.created_at,
            warranty_start: product.warranty_start,
            warranty_end: product.warranty_end,
          },
          owner: {
            full_name: owner.full_name,
            phone: owner.phone,
            email: owner.email,
            company: owner.company,
          },
        });
      } else {
        setResult(null);
      }
    } catch (err) {
      // Error is already set by the hook
      setResult(null);
    }
  };

  // Updated warranty status logic for SerialLookup
  const getWarrantyStatus = (startDate: string, endDate: string) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (today < start) {
      return {
        status: "Not Started",
        color: "gray",
        variant: "secondary" as const,
        description: "Warranty period has not begun yet",
      };
    }
    if (today > end) {
      return {
        status: "Expired",
        color: "red",
        variant: "destructive" as const,
        description: "Warranty period has ended",
      };
    }
    const diffTime = end.getTime() - today.getTime();
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44);
    if (diffMonths <= 4) {
      return {
        status: "Expiring Soon",
        color: "yellow",
        variant: "secondary" as const,
        description: `Warranty expires in ${Math.ceil(diffMonths * 30)} days`,
      };
    }
    return {
      status: "Active",
      color: "green",
      variant: "default" as const,
      description: "Product is under warranty",
    };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Verify Product Authenticity
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Enter your product's serial number to verify its authenticity,
              check warranty status, and view ownership information. This
              service is free and available 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2" />
                  Serial Number Lookup
                </CardTitle>
                <CardDescription>
                  Enter the serial number found on your DrillPro product label
                  or documentation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Enter serial number (e.g., DP-2024-001)"
                      value={serialNumber}
                      onChange={(e) => setSerialNumber(e.target.value)}
                      className="flex-1"
                      maxLength={50}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleLookup();
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleLookup()}
                      disabled={loading || !serialNumber.trim()}
                    >
                      {loading ? "Searching..." : "Lookup"}
                    </Button>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <XCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {result && (
              <div className="mt-8">
                <Card className="shadow-lg border border-primary/10 bg-white/95">
                  <CardContent className="p-8">
                    {/* Product Verified Header */}
                    <div className="flex items-center mb-6">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
                      <span className="text-2xl font-bold text-green-700">
                        Product Verified
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      This is a genuine DrillTech Pro product with valid
                      registration
                    </p>
                    {/* Product Info & Image */}
                    <div className="grid md:grid-cols-2 gap-6 items-center mb-6">
                      <div>
                        <div className="mb-2">
                          <span className="font-bold">Name:</span>{" "}
                          {result.product.product_name}
                        </div>
                        <div className="mb-2">
                          <span className="font-bold">Model:</span>{" "}
                          {result.product.product_model}
                        </div>
                        <div className="mb-2">
                          <span className="font-bold">Serial Number:</span>{" "}
                          {result.product.serial_number}
                        </div>
                        <div className="mb-2">
                          <span className="font-bold">Category:</span>{" "}
                          {result.product.category}
                        </div>
                      </div>
                      <div>
                        <img
                          src={result.product.image_url}
                          alt={result.product.product_name}
                          className="w-full h-32 md:h-28 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    </div>
                    <Separator className="my-6" />
                    {/* Owner Info */}
                    <div className="mb-6">
                      <div className="text-lg font-semibold mb-4 text-primary flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />{" "}
                        Registered Owner
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <div>
                            <span className="font-semibold">Full Name:</span>{" "}
                            {result.owner.full_name}
                          </div>
                          <div>
                            <span className="font-semibold">Phone:</span>{" "}
                            {result.owner.phone}
                          </div>
                        </div>
                        <div>
                          <div>
                            <span className="font-semibold">Email:</span>{" "}
                            {result.owner.email || "N/A"}
                          </div>
                          <div>
                            <span className="font-semibold">Company:</span>{" "}
                            {result.owner.company || "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    {/* Warranty Info */}
                    <div className="mb-6">
                      <div className="text-lg font-semibold mb-4 text-primary flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-primary" />{" "}
                        Warranty Information
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-2">
                        <div>
                          <div>
                            <span className="font-semibold">
                              Purchase Date:
                            </span>{" "}
                            {formatDate(
                              result.product.purchase_date ||
                                result.product.created_at
                            )}
                          </div>
                          <div>
                            <span className="font-semibold">
                              Warranty Start:
                            </span>{" "}
                            {formatDate(result.product.warranty_start)}
                          </div>
                          <div>
                            <span className="font-semibold">Warranty End:</span>{" "}
                            {formatDate(result.product.warranty_end)}
                          </div>
                        </div>
                        <div>
                          <div>
                            <span className="font-semibold">Status:</span>{" "}
                            <span
                              className={(() => {
                                const warranty = getWarrantyStatus(
                                  result.product.warranty_start,
                                  result.product.warranty_end
                                );
                                if (warranty.status === "Active")
                                  return "text-green-600 font-bold";
                                if (warranty.status === "Expired")
                                  return "text-red-600 font-bold";
                                if (warranty.status === "Expiring Soon")
                                  return "text-yellow-600 font-bold";
                                return "text-muted-foreground";
                              })()}
                            >
                              {
                                getWarrantyStatus(
                                  result.product.warranty_start,
                                  result.product.warranty_end
                                ).status
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Warranty Message */}
                      {(() => {
                        const warranty = getWarrantyStatus(
                          result.product.warranty_start,
                          result.product.warranty_end
                        );
                        if (warranty.status === "Active") {
                          return (
                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                              <span className="text-green-700 font-medium">
                                ✓ Warranty Active
                              </span>
                              <span className="ml-2 text-green-700">
                                Your warranty is valid until{" "}
                                {formatDate(result.product.warranty_end)}
                              </span>
                            </div>
                          );
                        } else if (warranty.status === "Expired") {
                          return (
                            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                              <XCircle className="h-5 w-5 text-red-600 mr-2" />
                              <span className="text-red-700 font-medium">
                                ✗ Warranty Expired
                              </span>
                              <span className="ml-2 text-red-700">
                                Your warranty expired on{" "}
                                {formatDate(result.product.warranty_end)}
                              </span>
                            </div>
                          );
                        } else if (warranty.status === "Expiring Soon") {
                          return (
                            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                              <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                              <span className="text-yellow-700 font-medium">
                                ! Warranty Expiring Soon
                              </span>
                              <span className="ml-2 text-yellow-700">
                                {warranty.description}
                              </span>
                            </div>
                          );
                        } else if (warranty.status === "Not Started") {
                          return (
                            <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center">
                              <AlertCircle className="h-5 w-5 text-gray-600 mr-2" />
                              <span className="text-gray-700 font-medium">
                                Warranty Not Started
                              </span>
                              <span className="ml-2 text-gray-700">
                                {warranty.description}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </CardContent>
                </Card>
                <div className="text-center mt-6">
                  <Button
                    onClick={() => {
                      setSerialNumber("");
                      setResult(null);
                      setError("");
                    }}
                  >
                    Look Up Another Product
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Need Help Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-xl border-0 bg-gradient-to-br from-primary/5 via-background to-accent/10 dark:from-background dark:via-primary/10 dark:to-background/80">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                  <div className="flex-1">
                    <h3 className="text-3xl font-extrabold mb-6 text-primary flex items-center gap-2 tracking-tight drop-shadow-sm">
                      <AlertCircle className="h-7 w-7 text-primary/80 animate-pulse" />
                      Need Help?
                    </h3>
                    <div className="grid md:grid-cols-2 gap-10">
                      <div className="rounded-xl bg-white/80 dark:bg-background/80 p-6 shadow border border-primary/10">
                        <p className="font-semibold mb-3 text-foreground text-lg flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2 animate-pulse"></span>
                          Where to find your serial number:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4 text-base">
                          <li>
                            Check the{" "}
                            <span className="font-medium text-foreground">
                              metal nameplate
                            </span>{" "}
                            on your equipment
                          </li>
                          <li>
                            Look for a{" "}
                            <span className="font-medium text-foreground">
                              sticker on the motor housing
                            </span>
                          </li>
                          <li>
                            Serial numbers typically start with{" "}
                            <span className="font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">
                              "DTP-"
                            </span>
                          </li>
                        </ul>
                      </div>
                      <div className="rounded-xl bg-white/80 dark:bg-background/80 p-6 shadow border border-primary/10">
                        <p className="font-semibold mb-3 text-foreground text-lg flex items-center gap-2">
                          <span className="inline-block w-2 h-2 rounded-full bg-destructive mr-2 animate-pulse"></span>
                          Common issues:
                        </p>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2 pl-4 text-base">
                          <li>
                            Make sure to enter the{" "}
                            <span className="font-medium text-foreground">
                              complete serial number
                            </span>
                          </li>
                          <li>
                            Check for any{" "}
                            <span className="font-medium text-foreground">
                              worn or damaged characters
                            </span>
                          </li>
                          <li>
                            Contact{" "}
                            <span className="font-medium text-primary underline underline-offset-2">
                              support
                            </span>{" "}
                            if you cannot locate the serial number
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SerialLookup;
