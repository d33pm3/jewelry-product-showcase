import R101 from "@/assets/R101.jpg";
import R102 from "@/assets/R102.jpg";
import N201 from "@/assets/N201.jpg";
import N202 from "@/assets/N202.jpg";
import E301 from "@/assets/E301.jpg";
import E302 from "@/assets/E302.jpg";
import B401 from "@/assets/B401.jpg";
import B402 from "@/assets/B402.jpg";
import P501 from "@/assets/P501.jpg";
import P502 from "@/assets/P502.jpg";

export type Stock = "Available" | "Out of Stock";

export interface Product {
  id: string;
  name: string;
  category: "Ring" | "Necklace" | "Earrings" | "Bracelet" | "Pendant";
  material: string;
  weight: string;
  price: number;
  stock: Stock;
  image: string;
}

export const CATALOGUE: Product[] = [
  {
    id: "R101",
    name: "Classic Diamond Ring",
    category: "Ring",
    material: "18K Gold + Diamond",
    weight: "5.2 g",
    price: 135000,
    stock: "Available",
    image: R101,
  },
  {
    id: "R102",
    name: "Ruby Solitaire Ring",
    category: "Ring",
    material: "22K Gold + Ruby",
    weight: "4.8 g",
    price: 98500,
    stock: "Out of Stock",
    image: R102,
  },
  {
    id: "N201",
    name: "Pearl Necklace",
    category: "Necklace",
    material: "18K Gold + Pearl",
    weight: "28.5 g",
    price: 245000,
    stock: "Available",
    image: N201,
  },
  {
    id: "N202",
    name: "Emerald Choker",
    category: "Necklace",
    material: "22K Gold + Emerald",
    weight: "32.0 g",
    price: 310000,
    stock: "Available",
    image: N202,
  },
  {
    id: "E301",
    name: "Daily Wear Gold Earrings",
    category: "Earrings",
    material: "22K Gold",
    weight: "7.5 g",
    price: 55000,
    stock: "Available",
    image: E301,
  },
  {
    id: "E302",
    name: "Diamond Stud Earrings",
    category: "Earrings",
    material: "18K Gold + Diamond",
    weight: "6.2 g",
    price: 105000,
    stock: "Available",
    image: E302,
  },
  {
    id: "B401",
    name: "Gold Chain Bracelet",
    category: "Bracelet",
    material: "22K Gold",
    weight: "12.0 g",
    price: 87500,
    stock: "Available",
    image: B401,
  },
  {
    id: "B402",
    name: "Emerald Cuff Bracelet",
    category: "Bracelet",
    material: "18K Gold + Emerald",
    weight: "15.0 g",
    price: 150000,
    stock: "Out of Stock",
    image: B402,
  },
  {
    id: "P501",
    name: "Lotus Pendant",
    category: "Pendant",
    material: "18K Gold + Diamond",
    weight: "8.0 g",
    price: 72000,
    stock: "Available",
    image: P501,
  },
  {
    id: "P502",
    name: "Om Symbol Pendant",
    category: "Pendant",
    material: "22K Gold",
    weight: "6.5 g",
    price: 48000,
    stock: "Available",
    image: P502,
  },
];

export const CATEGORIES = ["Ring", "Necklace", "Earrings", "Bracelet", "Pendant"] as const;

export const byId = (id: string) => CATALOGUE.find((p) => p.id === id);
