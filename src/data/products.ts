export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  price: number;
  description: string;
  notes: string[];
  roast: string;
  weight: string;
  image: string;
  rating: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Ethiopian Yirgacheffe",
    origin: "Ethiopia",
    category: "Single Origin",
    price: 18.50,
    description: "A bright and complex coffee from the birthplace of arabica. Grown at high elevations in the Yirgacheffe region, this lot delivers an extraordinary cup with floral aromatics and a silky body that lingers on the palate.",
    notes: ["Blueberry", "Jasmine", "Lemon Zest"],
    roast: "Light",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    rating: 4.9
  },
  {
    id: 2,
    name: "Colombian Supremo",
    origin: "Colombia",
    category: "Single Origin",
    price: 16.00,
    description: "A classic Colombian coffee with exceptional balance. Grown in the Huila region by smallholder farmers, this bean offers a smooth, well-rounded cup with sweet caramel undertones and a clean finish.",
    notes: ["Caramel", "Red Apple", "Milk Chocolate"],
    roast: "Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=400&h=400&fit=crop",
    rating: 4.7
  },
  {
    id: 3,
    name: "Midnight Velvet Blend",
    origin: "Brazil & Indonesia",
    category: "Blend",
    price: 15.00,
    description: "Our signature dark blend crafted for those who love bold, full-bodied coffee. Combining Brazilian Santos with Sumatran Mandheling, this blend delivers deep chocolate notes with a smoky, lingering finish.",
    notes: ["Dark Chocolate", "Cedar", "Tobacco"],
    roast: "Dark",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=400&h=400&fit=crop",
    rating: 4.6
  },
  {
    id: 4,
    name: "Kenya AA Nyeri",
    origin: "Kenya",
    category: "Single Origin",
    price: 21.00,
    description: "A prestigious AA-grade coffee from the Nyeri county. Known for its wine-like acidity and complex fruit character, this coffee is a favorite among specialty enthusiasts seeking a vibrant, juicy cup.",
    notes: ["Blackcurrant", "Grapefruit", "Brown Sugar"],
    roast: "Light-Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=400&h=400&fit=crop",
    rating: 4.8
  },
  {
    id: 5,
    name: "Morning Ritual Blend",
    origin: "Central America",
    category: "Blend",
    price: 14.50,
    description: "A perfectly balanced everyday blend designed for your morning ritual. Combining beans from Guatemala and Costa Rica, this coffee offers a smooth, approachable cup with gentle sweetness and zero bitterness.",
    notes: ["Hazelnut", "Honey", "Vanilla"],
    roast: "Medium",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=400&h=400&fit=crop",
    rating: 4.5
  },
  {
    id: 6,
    name: "Sumatra Mandheling",
    origin: "Indonesia",
    category: "Single Origin",
    price: 17.50,
    description: "A full-bodied, earthy coffee from the Sumatra highlands. Wet-hulled processing gives this bean its distinctive character — low acidity, heavy body, and complex herbal notes that develop beautifully as it cools.",
    notes: ["Earthy", "Dark Cocoa", "Herbal"],
    roast: "Dark",
    weight: "250g",
    image: "https://images.unsplash.com/photo-1504630083234-14187a9df0f5?w=400&h=400&fit=crop",
    rating: 4.4
  }
];

export const categories = ["All", "Single Origin", "Blend"];
