export interface Car {
  id: string;
  model: string;
  title: string;
  description: string;
  pricePerDay: number;
  pricePerKm: number;
  image: string;
  color: string;
  video?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export const cars: Car[] = [
  {
    id: "toyota-innova-hycross",
    model: "Toyota",
    title: "Toyota Innova Hycross",
    description: "The Toyota Innova Hycross blends classic Innova DNA with modern SUV design. As a spacious and comfortable people mover, it offers best ride quality.",
    pricePerDay: 3000,
    pricePerKm: 25,
    image: "https://ackodrive-assets.ackodrive.com/media/test_Qppr44b.png",
    color: "#3b82f6",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
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
    id: "toyota-innova-crysta",
    model: "Toyota",
    title: "Toyota Innova Crysta",
    description: "The Crysta offers a large cabin, seating for up to eight people, and plenty of storage options across all three rows.",
    pricePerDay: 2500,
    pricePerKm: 20,
    image: "https://ackodrive-assets.ackodrive.com/media/test_Qppr44b.png",
    color: "#ec4899",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
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
  },
  {
    id: "toyota-glanza",
    model: "Toyota",
    title: "Toyota Glanza",
    description: "A premium hatchback that offers superior comfort, style, and performance in its segment.",
    pricePerDay: 1500,
    pricePerKm: 15,
    image: "public/lovable-uploads/c2f979be-0f33-4679-b957-f06b239b7aab.png",
    color: "#dc2626",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "zap",
        title: "Responsive Engine",
        description: "Quick acceleration"
      },
      {
        icon: "fuel",
        title: "Fuel Efficient",
        description: "Great mileage"
      },
      {
        icon: "settings",
        title: "Smart Hybrid",
        description: "Enhanced performance"
      },
      {
        icon: "monitor",
        title: "Infotainment",
        description: "Connected car features"
      }
    ]
  },
  {
    id: "toyota-urban-cruiser-taisor",
    model: "Toyota",
    title: "Urban Cruiser Taisor",
    description: "A compact SUV that brings together bold styling, advanced features, and impressive performance.",
    pricePerDay: 1800,
    pricePerKm: 18,
    image: "public/lovable-uploads/c2f979be-0f33-4679-b957-f06b239b7aab.png",
    color: "#ea580c",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "shield",
        title: "Safety Features",
        description: "Multiple airbags"
      },
      {
        icon: "sun",
        title: "Panoramic Roof",
        description: "Enhanced driving experience"
      },
      {
        icon: "bluetooth",
        title: "Connectivity",
        description: "Seamless smartphone integration"
      },
      {
        icon: "command",
        title: "Drive Modes",
        description: "Customize your drive"
      }
    ]
  },
  {
    id: "toyota-rumion",
    model: "Toyota",
    title: "Toyota Rumion",
    description: "A versatile MPV that offers ample space and comfort for the entire family.",
    pricePerDay: 2100,
    pricePerKm: 19,
    image: "public/lovable-uploads/c2f979be-0f33-4679-b957-f06b239b7aab.png",
    color: "#2563eb",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "maximize",
        title: "Spacious Interior",
        description: "Room for everyone"
      },
      {
        icon: "package",
        title: "Cargo Capacity",
        description: "Flexible storage options"
      },
      {
        icon: "wind",
        title: "Efficient Cooling",
        description: "Comfort in all seasons"
      },
      {
        icon: "layout",
        title: "Flexible Seating",
        description: "Multiple configurations"
      }
    ]
  },
  {
    id: "toyota-urban-cruiser-hyryder",
    model: "Toyota",
    title: "Urban Cruiser Hyryder",
    description: "A sophisticated SUV with a strong hybrid system that delivers exceptional fuel economy.",
    pricePerDay: 2200,
    pricePerKm: 20,
    image: "public/lovable-uploads/c2f979be-0f33-4679-b957-f06b239b7aab.png",
    color: "#0ea5e9",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "battery-charging",
        title: "Strong Hybrid",
        description: "Electric + Petrol power"
      },
      {
        icon: "fuel",
        title: "Excellent Mileage",
        description: "Up to 27.97 km/l"
      },
      {
        icon: "mountain",
        title: "AWD Option",
        description: "All-terrain capability"
      },
      {
        icon: "sun",
        title: "Panoramic Sunroof",
        description: "Open-air experience"
      }
    ]
  }
];
