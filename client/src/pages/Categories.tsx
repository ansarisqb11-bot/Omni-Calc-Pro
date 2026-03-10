import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Search, ArrowLeft, Wallet, Calculator, Heart, Compass,
  Clock, Ruler, MessageSquare, StickyNote, Binary, FlaskConical,
  HardHat, Plane, Grid3X3, ChevronRight, Hash, GraduationCap,
  Stethoscope, Home, Car, Leaf, Code, ShoppingCart, Globe, ShoppingBag, Users, Calendar, TrendingDown, Palette, Shirt,
  Baby, BarChart3, Zap, Proportions, Monitor, ImageIcon, RulerIcon, FileText, Droplets, Columns3, LineChart, TrendingUp, Building
} from "lucide-react";

export default function Categories() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [, navigate] = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const allTools = [
    { title: "EMI Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Mortgage Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Compound Interest", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Tip Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "ROI Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "SIP Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "GST Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Salary Converter", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Discount Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Currency Converter", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Inflation Calculator", category: "Finance", icon: TrendingDown, color: "bg-emerald-500", href: "/finance" },
    { title: "Tax Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Loan Amortization", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Profit & Loss", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Markup Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Margin Calculator", category: "Finance", icon: Wallet, color: "bg-emerald-500", href: "/finance" },
    { title: "Basic Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Scientific Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Percentage Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Programmer Calculator", category: "Calculator", icon: Calculator, color: "bg-blue-500", href: "/calculator" },
    { title: "Billion/Million Converter", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Crore/Lakh Converter", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "US to Indian Numbers", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "Number to Words", category: "Numbers", icon: Hash, color: "bg-teal-500", href: "/numbers" },
    { title: "BMI Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "BMR Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Calorie Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Water Intake", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Body Fat Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Sleep Cycle", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Cooking Converter", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Pregnancy Calculator", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Ideal Weight", category: "Health", icon: Heart, color: "bg-pink-500", href: "/health" },
    { title: "Length Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Weight Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Temperature Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Volume Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Area Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Speed Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Pressure Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Energy Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Data Storage Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Time Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Frequency Converter", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Fuel Economy", category: "Units", icon: Ruler, color: "bg-amber-500", href: "/units" },
    { title: "Age Calculator", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Day Finder", category: "Date/Time", icon: Calendar, color: "bg-sky-500", href: "/day-finder" },
    { title: "Relationship Finder", category: "Date/Time", icon: Users, color: "bg-violet-500", href: "/relationship-finder" },
    { title: "Date Difference", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Stopwatch", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Countdown Timer", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "World Clock", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Time Zone Converter", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Pomodoro Timer", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Work Days Calculator", category: "Date/Time", icon: Clock, color: "bg-purple-500", href: "/date-time" },
    { title: "Prime Checker", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "LCM/HCF Calculator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Random Generator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Factorial Calculator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Percentage Change", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Fibonacci Generator", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Quadratic Solver", category: "Math", icon: Binary, color: "bg-indigo-500", href: "/math" },
    { title: "Circle Area/Perimeter", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Rectangle Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Square Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Triangle (Sides)", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Triangle (Base\u00D7Height)", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Regular Polygon", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Rhombus Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Trapezoid Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Ellipse Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Sector & Arc", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cube Volume/SA", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cuboid Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Sphere Volume/SA", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Hemisphere Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cylinder Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Cone Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Frustum Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Pyramid Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Torus Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Ellipsoid Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Triangular Prism", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "2D Distance Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "3D Distance Calculator", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "GPS Distance (Haversine)", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Manhattan Distance", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Slope (Two Points)", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Slope (Point + Slope)", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Slope (Rise/Run)", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Slope from Angle", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Parallel/Perpendicular", category: "Geometry", icon: Compass, color: "bg-cyan-500", href: "/geometry" },
    { title: "Ohm's Law Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Molar Mass Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Motion Equations", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Temperature Converter", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Density Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Force Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Power Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Wavelength Calculator", category: "Science", icon: FlaskConical, color: "bg-rose-500", href: "/science" },
    { title: "Cement Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Paint Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Tile Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Steel Bar Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Concrete Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Brick Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Flooring Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Roofing Calculator", category: "Construction", icon: HardHat, color: "bg-orange-500", href: "/construction" },
    { title: "Fuel Cost Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Flight Time Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Mileage Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Clothing Size Converter", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Shoe Size Converter", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Tip Calculator", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "Currency Converter", category: "Travel", icon: Plane, color: "bg-sky-500", href: "/travel" },
    { title: "GPA/CGPA Calculator", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Marks to Grade", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Attendance Calculator", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Study Time Planner", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Table Generator", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Speed-Time-Distance", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Work-Time Calculator", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Rank Predictor", category: "Education", icon: GraduationCap, color: "bg-blue-600", href: "/education" },
    { title: "Medicine Dosage", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "IV Drip Rate", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Heart Rate Zones", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Oxygen Flow Rate", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Calories Burned", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Body Surface Area", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Water Intake", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Period Cycle Predictor", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Vision Prescription", category: "Medical", icon: Stethoscope, color: "bg-red-500", href: "/medical" },
    { title: "Gas Cylinder Usage", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "AC Power Consumption", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Inverter Backup", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Solar Panel Size", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Water Tank Volume", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Rainwater Harvest", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Expense Splitter", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Data Usage Estimator", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Battery Health", category: "Lifestyle", icon: Home, color: "bg-lime-500", href: "/lifestyle" },
    { title: "Mileage Cost Calculator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Tyre Size Converter", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "RPM/Speed Calculator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Gear Ratio Calculator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "EV Range Estimator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Charging Time", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Toll Cost Estimator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Depreciation Calculator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Insurance Estimator", category: "Automobile", icon: Car, color: "bg-slate-500", href: "/automobile" },
    { title: "Crop Yield Estimator", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Seed Rate Calculator", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Fertilizer Dosage", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Land Area Converter", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Plot Calculator", category: "Agriculture", icon: Calculator, color: "bg-green-600", href: "/agriculture" },
    { title: "Irrigation Water", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Tractor Fuel", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Farm Profit", category: "Agriculture", icon: Leaf, color: "bg-green-600", href: "/agriculture" },
    { title: "Binary/Decimal/Hex", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "ASCII Converter", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "Base64 Encode/Decode", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "Hash Generator", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "File Size Estimator", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "API Rate Cost", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "CPM/RPM Calculator", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "YouTube Earnings", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "SEO Word Density", category: "Developer", icon: Code, color: "bg-gray-600", href: "/developer" },
    { title: "Product Pricing", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Commission Calculator", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Break-Even Point", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Inventory Turnover", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Profit After Fees", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "COD Charges", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Subscription Optimizer", category: "E-Commerce", icon: ShoppingCart, color: "bg-fuchsia-500", href: "/ecommerce" },
    { title: "Earth Distance", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Map Scale Converter", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Wind Chill Calculator", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Heat Index Calculator", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Carbon Footprint", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "AQI Explainer", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: "Altitude/Oxygen", category: "Environment", icon: Globe, color: "bg-emerald-600", href: "/environment" },
    { title: 'Should I Buy?', category: "Smart Daily Life", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Trip Calculator", category: "Smart Daily Life", icon: Car, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Discount Detective", category: "Smart Daily Life", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Garden Space Planner", category: "Smart Daily Life", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Guest Seating Arranger", category: "Smart Daily Life", icon: ShoppingBag, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Vacation Budget Divider", category: "Smart Daily Life", icon: Wallet, color: "bg-indigo-500", href: "/smart-life" },
    { title: "Unit Price & Quantity", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Ratio & Proportion", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Speed-Time-Distance", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Age Problems", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Percentage Problems", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Profit & Loss", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Time & Work / Pipes", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Average Problems", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Mixture & Alligation", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Rate Solver", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Basic Word Problems", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Volume Solver", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Length Solver", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "Weight Solver", category: "Word Problems", icon: Calculator, color: "bg-orange-500", href: "/word-problems" },
    { title: "AI Calculator", category: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "AI Image Generator", category: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "AI Chat Assistant", category: "AI Tools", icon: MessageSquare, color: "bg-violet-500", href: "/ai-tools" },
    { title: "Men Clothing Size", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Women Clothing Size", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Kids Clothing Size", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Men Shoe Size", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Women Shoe Size", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Kids Shoe Size", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Slippers / Sandals", category: "Size Converter", icon: Shirt, color: "bg-violet-500", href: "/size-converter" },
    { title: "Color Mixer", category: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Color Match %", category: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Gradient Generator", category: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Color Converter", category: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Color Generator", category: "Color Tools", icon: Palette, color: "bg-fuchsia-500", href: "/color-tools" },
    { title: "Population Growth", category: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Population Density", category: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Birth Rate Calculator", category: "Population", icon: Baby, color: "bg-rose-500", href: "/population" },
    { title: "Death Rate Calculator", category: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Migration Rate", category: "Population", icon: Plane, color: "bg-rose-500", href: "/population" },
    { title: "Working Population", category: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Dependency Ratio", category: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "Youth Population", category: "Population", icon: Users, color: "bg-rose-500", href: "/population" },
    { title: "HDI Calculator", category: "Development", icon: BarChart3, color: "bg-amber-500", href: "/development" },
    { title: "Poverty Rate Tool", category: "Development", icon: TrendingDown, color: "bg-amber-500", href: "/development" },
    { title: "Literacy Rate Tool", category: "Development", icon: BarChart3, color: "bg-amber-500", href: "/development" },
    { title: "Health Index Tool", category: "Development", icon: Heart, color: "bg-amber-500", href: "/development" },
    { title: "Infrastructure Index", category: "Development", icon: BarChart3, color: "bg-amber-500", href: "/development" },
    { title: "Digital Economy Tool", category: "Development", icon: BarChart3, color: "bg-amber-500", href: "/development" },
    { title: "Energy per Capita", category: "Development", icon: Zap, color: "bg-amber-500", href: "/development" },
    { title: "Aspect Ratio Calculator", category: "Designer", icon: Proportions, color: "bg-pink-500", href: "/designer" },
    { title: "Screen DPI / PPI", category: "Designer", icon: Monitor, color: "bg-pink-500", href: "/designer" },
    { title: "Image Resize Calculator", category: "Designer", icon: ImageIcon, color: "bg-pink-500", href: "/designer" },
    { title: "CM / Pixel / Inch", category: "Designer", icon: RulerIcon, color: "bg-pink-500", href: "/designer" },
    { title: "Paper Size Calculator", category: "Designer", icon: FileText, color: "bg-pink-500", href: "/designer" },
    { title: "pH Calculator", category: "Science", icon: Droplets, color: "bg-rose-500", href: "/science" },
    { title: "Roman Numerals", category: "Numbers", icon: Columns3, color: "bg-teal-500", href: "/numbers" },
    { title: "Stock Profit/Loss", category: "Finance", icon: LineChart, color: "bg-emerald-500", href: "/finance" },
    { title: "GDP Calculator", category: "Business & Economics", icon: Globe, color: "bg-cyan-600", href: "/business" },
    { title: "Market Size Calculator", category: "Business & Economics", icon: BarChart3, color: "bg-cyan-600", href: "/business" },
    { title: "Net Worth Calculator", category: "Business & Economics", icon: TrendingUp, color: "bg-cyan-600", href: "/business" },
    { title: "Unemployment Rate", category: "Business & Economics", icon: Users, color: "bg-cyan-600", href: "/business" },
    { title: "Employment Growth", category: "Business & Economics", icon: Building, color: "bg-cyan-600", href: "/business" },
    { title: "Productivity Calculator", category: "Business & Economics", icon: Zap, color: "bg-cyan-600", href: "/business" },
    { title: "Tariff Impact Calculator", category: "Business & Economics", icon: Globe, color: "bg-cyan-600", href: "/business" },
    { title: "Per Person Income", category: "Business & Economics", icon: Wallet, color: "bg-cyan-600", href: "/business" },
    { title: "Per Capita Income", category: "Business & Economics", icon: BarChart3, color: "bg-cyan-600", href: "/business" },
    { title: "Inflation Impact", category: "Business & Economics", icon: TrendingUp, color: "bg-cyan-600", href: "/business" },
  ];

  const categories = [
    { title: "All Tools", icon: Grid3X3, color: "text-slate-600 dark:text-slate-300", bg: "bg-slate-100 dark:bg-slate-700", count: allTools.length },
    { title: "Finance", icon: Wallet, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", count: allTools.filter(t => t.category === "Finance").length, href: "/finance" },
    { title: "Size Conv.", icon: Shirt, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10", count: allTools.filter(t => t.category === "Size Converter").length, href: "/size-converter" },
    { title: "Word Problems", icon: Calculator, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", count: allTools.filter(t => t.category === "Word Problems").length, href: "/word-problems" },
    { title: "Calculator", icon: Calculator, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", count: allTools.filter(t => t.category === "Calculator").length, href: "/calculator" },
    { title: "Numbers", icon: Hash, color: "text-teal-500", bg: "bg-teal-50 dark:bg-teal-500/10", count: allTools.filter(t => t.category === "Numbers").length, href: "/numbers" },
    { title: "Health", icon: Heart, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10", count: allTools.filter(t => t.category === "Health").length, href: "/health" },
    { title: "Units", icon: Ruler, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", count: allTools.filter(t => t.category === "Units").length, href: "/units" },
    { title: "Date/Time", icon: Clock, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10", count: allTools.filter(t => t.category === "Date/Time").length, href: "/date-time" },
    { title: "Math", icon: Binary, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", count: allTools.filter(t => t.category === "Math").length, href: "/math" },
    { title: "Geometry", icon: Compass, color: "text-cyan-500", bg: "bg-cyan-50 dark:bg-cyan-500/10", count: allTools.filter(t => t.category === "Geometry").length, href: "/geometry" },
    { title: "Science", icon: FlaskConical, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", count: allTools.filter(t => t.category === "Science").length, href: "/science" },
    { title: "Construction", icon: HardHat, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10", count: allTools.filter(t => t.category === "Construction").length, href: "/construction" },
    { title: "Travel", icon: Plane, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10", count: allTools.filter(t => t.category === "Travel").length, href: "/travel" },
    { title: "Education", icon: GraduationCap, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-600/10", count: allTools.filter(t => t.category === "Education").length, href: "/education" },
    { title: "Medical", icon: Stethoscope, color: "text-red-500", bg: "bg-red-50 dark:bg-red-500/10", count: allTools.filter(t => t.category === "Medical").length, href: "/medical" },
    { title: "Lifestyle", icon: Home, color: "text-lime-500", bg: "bg-lime-50 dark:bg-lime-500/10", count: allTools.filter(t => t.category === "Lifestyle").length, href: "/lifestyle" },
    { title: "Automobile", icon: Car, color: "text-slate-500", bg: "bg-slate-50 dark:bg-slate-500/10", count: allTools.filter(t => t.category === "Automobile").length, href: "/automobile" },
    { title: "Agriculture", icon: Leaf, color: "text-green-600", bg: "bg-green-50 dark:bg-green-600/10", count: allTools.filter(t => t.category === "Agriculture").length, href: "/agriculture" },
    { title: "Developer", icon: Code, color: "text-gray-600 dark:text-gray-400", bg: "bg-gray-50 dark:bg-gray-600/10", count: allTools.filter(t => t.category === "Developer").length, href: "/developer" },
    { title: "E-Commerce", icon: ShoppingCart, color: "text-fuchsia-500", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10", count: allTools.filter(t => t.category === "E-Commerce").length, href: "/ecommerce" },
    { title: "Environment", icon: Globe, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-600/10", count: allTools.filter(t => t.category === "Environment").length, href: "/environment" },
    { title: "Smart Life", icon: ShoppingBag, color: "text-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-500/10", count: allTools.filter(t => t.category === "Smart Daily Life").length, href: "/smart-life" },
    { title: "AI Tools", icon: MessageSquare, color: "text-violet-500", bg: "bg-violet-50 dark:bg-violet-500/10", count: allTools.filter(t => t.category === "AI Tools").length, href: "/ai-tools" },
    { title: "Color Tools", icon: Palette, color: "text-fuchsia-500", bg: "bg-fuchsia-50 dark:bg-fuchsia-500/10", count: allTools.filter(t => t.category === "Color Tools").length, href: "/color-tools" },
    { title: "Population", icon: Users, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", count: allTools.filter(t => t.category === "Population").length, href: "/population" },
    { title: "Development", icon: BarChart3, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10", count: allTools.filter(t => t.category === "Development").length, href: "/development" },
    { title: "Designer", icon: Proportions, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-500/10", count: allTools.filter(t => t.category === "Designer").length, href: "/designer" },
    { title: "Business", icon: Building, color: "text-cyan-600", bg: "bg-cyan-50 dark:bg-cyan-600/10", count: allTools.filter(t => t.category === "Business & Economics").length, href: "/business" },
    { title: "Notes", icon: StickyNote, color: "text-yellow-500", bg: "bg-yellow-50 dark:bg-yellow-500/10", count: 0, href: "/notes" },
  ];

  const filterPills = ["All Tools", "Finance", "Business & Economics", "Health", "Math", "Science", "Units", "Date/Time", "Geometry", "Construction", "Travel", "Education", "Medical", "Lifestyle", "Developer", "E-Commerce", "Color Tools", "Population", "Development", "Designer", "AI Tools"];

  const categoriesWithHref = categories.filter(c => c.href);

  const filteredCategories = searchQuery
    ? categoriesWithHref.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : categoriesWithHref;

  const filteredTools = allTools.filter((tool) => {
    const matchesSearch = tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tool.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory || activeCategory === "All Tools" || tool.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const showToolsList = activeCategory && activeCategory !== "All Tools";

  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const catDescriptions: Record<string, string> = {
    "Finance": "Mortgage, loans, and investment tools.",
    "Size Conv.": "Clothing and shoe size converters.",
    "Word Problems": "Step-by-step word problem solvers.",
    "Calculator": "Basic, scientific, and programmer calculators.",
    "Numbers": "Crore, lakh, roman, and number tools.",
    "Health": "BMI, macro-nutrients, and calorie tracking.",
    "Units": "Convert weight, length, and volumes.",
    "Date/Time": "Age, calendar, and countdown tools.",
    "Math": "Algebra, calculus, and basic arithmetic.",
    "Geometry": "Area, volume, and shape calculators.",
    "Science": "Physics, chemistry, and lab tools.",
    "Construction": "Material estimation and area plotting.",
    "Travel": "Flights, fuel, and currency tools.",
    "Education": "GPA, grades, and learning tools.",
    "Medical": "Dosage, health metrics, and trackers.",
    "Lifestyle": "Travel, cooking, and daily utility tools.",
    "Automobile": "Fuel, mileage, and car tools.",
    "Agriculture": "Crop yield, soil, and farm tools.",
    "Developer": "Binary, hex, and developer tools.",
    "E-Commerce": "Pricing, profit, and commission tools.",
    "Environment": "Carbon footprint and climate tools.",
    "Smart Life": "Budget, productivity, and daily tools.",
    "AI Tools": "Smart calculations and AI assistance.",
    "Color Tools": "HEX, RGB, and design tools.",
    "Population": "Demographics and world statistics.",
    "Development": "Economic growth and project tools.",
    "Designer": "Aspect ratio, DPI, and layout tools.",
    "Business": "GDP, market size, tariff, and economic tools.",
    "Notes": "Quick notes and reminders.",
  };

  const [showAll, setShowAll] = useState(false);
  const PAGE_SIZE = 9;

  if (isDesktop) {
    const displayedCats = searchQuery
      ? filteredCategories
      : showAll
        ? filteredCategories
        : filteredCategories.slice(0, PAGE_SIZE);

    return (
      <div className="flex flex-col h-full bg-background overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-[1100px] mx-auto space-y-6">

            {/* Heading */}
            <div>
              <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Explore Categories</h1>
              <p className="text-muted-foreground mt-1 text-sm">{filteredCategories.length} specialized calculator categories available</p>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for categories (e.g. Finance, Math...)"
                className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                data-testid="input-search-categories"
              />
            </div>

            {/* Category grid */}
            <div className="grid grid-cols-3 gap-4">
              {displayedCats.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link href={cat.href || "/categories"}>
                    <div
                      className="bg-card border border-border rounded-2xl p-6 cursor-pointer hover:shadow-md hover:border-primary/20 transition-all"
                      data-testid={`cat-card-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className={`w-11 h-11 rounded-xl ${cat.bg} flex items-center justify-center mb-4`}>
                        <cat.icon className={`w-5 h-5 ${cat.color}`} />
                      </div>
                      <h3 className="font-bold text-foreground text-base mb-1.5">{cat.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {catDescriptions[cat.title] || `${cat.count} tools available.`}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Load More */}
            {!searchQuery && !showAll && filteredCategories.length > PAGE_SIZE && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => setShowAll(true)}
                  className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:border-primary/40 hover:text-primary transition-all"
                  data-testid="button-load-more"
                >
                  Load More Categories
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f5f7fb] dark:bg-background overflow-hidden">
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-3">
          <button onClick={() => window.history.back()} className="p-2 hover:bg-muted rounded-lg transition-colors" data-testid="button-back">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">CalcHub</h1>
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 300+ tools..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-card border border-transparent dark:border-border rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm shadow-sm"
            data-testid="input-search-categories"
          />
        </div>
      </div>

      <div className="px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {filterPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setActiveCategory(pill === activeCategory ? null : pill)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === pill || (!activeCategory && pill === "All Tools")
                  ? "bg-slate-700 dark:bg-slate-300 text-white dark:text-slate-900"
                  : "bg-white dark:bg-card text-foreground shadow-sm"
              }`}
              data-testid={`filter-${pill.toLowerCase().replace(/\s+/g, "-")}`}
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6">
        {!showToolsList && (
          <>
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">Categories</span>
              <span className="text-xs text-primary font-medium">{filteredCategories.length} categories</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {filteredCategories.map((cat, i) => (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                >
                  <Link href={cat.href || "/categories"}>
                    <div
                      className="bg-white dark:bg-card rounded-2xl p-4 flex flex-col items-center gap-2 cursor-pointer shadow-sm"
                      data-testid={`cat-card-${cat.title.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${cat.bg} flex items-center justify-center`}>
                        <cat.icon className={`w-6 h-6 ${cat.color}`} />
                      </div>
                      <span className="text-xs font-semibold text-foreground text-center leading-tight">{cat.title}</span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-6 pb-3">
              <span className="text-base font-bold text-foreground">Most Popular</span>
              <button
                onClick={() => setActiveCategory("All Tools")}
                className="text-sm text-primary font-medium"
                data-testid="button-see-all"
              >
                See all
              </button>
            </div>

            <div className="space-y-2 pb-4">
              {allTools.slice(0, 8).map((tool, i) => (
                <Link key={`${tool.title}-${i}`} href={tool.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-white dark:bg-card rounded-2xl p-3.5 cursor-pointer flex items-center justify-between shadow-sm"
                    data-testid={`tool-popular-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{tool.title}</h3>
                        <p className="text-xs text-muted-foreground">{tool.category}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </>
        )}

        {showToolsList && (
          <>
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">{activeCategory}</span>
              <span className="text-xs text-primary font-medium">{filteredTools.length} tools</span>
            </div>

            <div className="space-y-2 pb-4">
              {filteredTools.map((tool, i) => (
                <Link key={`${tool.title}-${i}`} href={tool.href}>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="bg-white dark:bg-card rounded-2xl p-3.5 cursor-pointer flex items-center justify-between shadow-sm"
                    data-testid={`tool-${tool.title.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${tool.color} flex items-center justify-center`}>
                        <tool.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-sm text-foreground">{tool.title}</h3>
                        <p className="text-xs text-muted-foreground">{tool.category}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-white dark:bg-card flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">No tools found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
