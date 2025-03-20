
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
    id: "tesla-model-s",
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
    id: "lucid-air",
    model: "Lucid",
    title: "Air Dream Edition",
    description: "The Lucid Air combines luxury with electric performance. With its sleek design and impressive range, it's the perfect car for those who demand the best.",
    pricePerDay: 11999,
    pricePerKm: 16,
    image: "https://images.unsplash.com/photo-1621008149226-7a4fa10952fb",
    color: "#6366f1",
    features: [
      {
        icon: "battery",
        title: "832 km Range",
        description: "Best-in-class distance"
      },
      {
        icon: "zap",
        title: "1,111 HP",
        description: "Unmatched performance"
      },
      {
        icon: "monitor",
        title: "Glass Cockpit",
        description: "Immersive displays"
      },
      {
        icon: "wifi",
        title: "OTA Updates",
        description: "Always improving"
      }
    ]
  },
  {
    id: "mercedes-eqs",
    model: "Mercedes",
    title: "EQS 580",
    description: "The Mercedes EQS redefines electric luxury with its stunning Hyperscreen, exceptional comfort, and smooth, silent performance.",
    pricePerDay: 8999,
    pricePerKm: 12,
    image: "https://images.unsplash.com/photo-1622545523644-ce7d07252a8e",
    color: "#8b5cf6",
    features: [
      {
        icon: "monitor",
        title: "56\" Hyperscreen",
        description: "Futuristic dashboard"
      },
      {
        icon: "music",
        title: "Burmester 3D Sound",
        description: "Audiophile experience"
      },
      {
        icon: "sun",
        title: "HEPA Filtration",
        description: "Medical-grade air quality"
      },
      {
        icon: "umbrella",
        title: "Comfort Doors",
        description: "Automatic opening & closing"
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
