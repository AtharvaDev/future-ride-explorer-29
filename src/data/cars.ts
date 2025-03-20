
import { Hycross } from "./Images/Hycross.webp";
export interface Car {
  id: string;
  model: string;
  title: string;
  description: string;
  pricePerDay: number;
  pricePerKm: number;
  image: string;
  color: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export const cars: Car[] = [
  {
    id: "toyota-model-s",
    model: "Toyota",
    title: "Toyota Innova Hycross",
    description: "The Toyota Innova Hycross blends classic Innova DNA with modern SUV design. As a spacious and comfortable people mover, it offers best ride quality.",
    pricePerDay: 3000,
    pricePerKm: 25,
    image: "https://ackodrive-assets.ackodrive.com/media/test_Qppr44b.png",
    color: "#3b82f6",
    features: [
      {
        icon: "bolt",
        title: "1,020 HP",
        description: "Tri-motor powertrain"
      },
      {
        icon: "zap",
        title: "0-100 km/h in 2.1s",
        description: "Insane acceleration"
      },
      {
        icon: "battery-charging",
        title: "600+ km Range",
        description: "Long-distance travel"
      },
      {
        icon: "cpu",
        title: "Autopilot",
        description: "Advanced driver assistance"
      }
    ]
  },
  {
    id: "porsche-taycan",
    model: "Porsche",
    title: "Taycan Turbo S",
    description: "The Porsche Taycan combines the brand's sports car DNA with electric performance. It's the ultimate expression of driving passion in the electric age.",
    pricePerDay: 12999,
    pricePerKm: 18,
    image: "https://images.unsplash.com/photo-1608985346777-c0cb7552185b",
    color: "#ec4899",
    features: [
      {
        icon: "zap",
        title: "750 HP Overboost",
        description: "Porsche performance"
      },
      {
        icon: "battery-charging",
        title: "800V Architecture",
        description: "Ultra-fast charging"
      },
      {
        icon: "activity",
        title: "Sport Chrono",
        description: "Performance tracking"
      },
      {
        icon: "speaker",
        title: "Electric Sport Sound",
        description: "Futuristic acoustics"
      }
    ]
  }
];
