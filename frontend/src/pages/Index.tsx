import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search, Shield, Wrench, Users } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
                Professional Drilling Equipment
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Industry-leading drilling solutions with verified authenticity
                and comprehensive warranty coverage. Trust DrillPro for all your
                drilling equipment needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg">
                  <Link to="/products">View Products</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/serial-lookup">Verify Product</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center">
                <Wrench className="h-32 w-32 text-primary/60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Why Choose DrillPro?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide industry-leading drilling equipment with unmatched
              quality, warranty protection, and customer support.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Verified Authenticity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every product comes with a unique serial number for instant
                  verification and warranty status checking.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Wrench className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Professional Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Built to last with premium materials and engineering
                  excellence for the most demanding drilling applications.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our team of drilling experts provides comprehensive support
                  throughout your equipment's lifecycle.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore our complete catalog of drilling equipment or verify the
            authenticity of your existing DrillPro products.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/products">Browse Catalog</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/serial-lookup">
                <Search className="h-4 w-4 mr-2" />
                Check Serial Number
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-6 w-6 text-primary" />
                <h4 className="text-lg font-semibold">DrillPro</h4>
              </div>
              <p className="text-muted-foreground">
                Professional drilling equipment with verified authenticity and
                comprehensive warranty coverage.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Products</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/products"
                    className="hover:text-primary transition-colors"
                  >
                    All Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="hover:text-primary transition-colors"
                  >
                    Drill Bits
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="hover:text-primary transition-colors"
                  >
                    Drilling Rigs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="hover:text-primary transition-colors"
                  >
                    Accessories
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link
                    to="/serial-lookup"
                    className="hover:text-primary transition-colors"
                  >
                    Serial Lookup
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Warranty Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Company</h5>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 DrillPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
