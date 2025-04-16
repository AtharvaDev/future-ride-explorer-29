
export interface Car {
  id: string;
  model: string;
  title: string;
  description: string;
  pricePerDay: number;
  pricePerKm: number;
  image: string;
  images?: string[]; // Additional images for carousel
  color: string;
  video?: string;
  order?: number; // Optional field for display order
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  insights?: string[]; // Optional array of rental insights
}

export const cars: Car[] = [
  {
    id: "toyota-innova-hycross",
    model: "Toyota",
    title: "Toyota Innova Hycross",
    description: "The Toyota Innova Hycross blends classic Innova DNA with modern SUV design. As a spacious and comfortable people mover, it offers best ride quality.",
    pricePerDay: 3500,
    pricePerKm: 25,
    image: "https://ackodrive-assets.ackodrive.com/media/test_Qppr44b.png",
    images: [
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/115025/innova-hycross-interior-seats-5.jpeg?isig=0&q=80"
    ],
    color: "#3b82f6",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "users",
        title: "7-8 Seats",
        description: "Spacious seating for families"
      },
      {
        icon: "fuel",
        title: "21.1 km/l",
        description: "Excellent fuel efficiency"
      },
      {
        icon: "zap",
        title: "Hybrid System",
        description: "Smart power management"
      },
      {
        icon: "shield",
        title: "Safety Features",
        description: "6 airbags & ADAS"
      }
    ],
    insights: [
      "Perfect for family trips with up to 8 passengers",
      "Hybrid engine helps save on fuel costs during long journeys",
      "Large luggage capacity ideal for airport transfers",
      "Comfortable suspension makes it suitable for rough roads"
    ]
  },
  {
    id: "toyota-innova-crysta",
    model: "Toyota",
    title: "Toyota Innova Crysta",
    description: "The Crysta offers a large cabin, seating for up to eight people, and plenty of storage options across all three rows.",
    pricePerDay: 3000,
    pricePerKm: 22,
    image: "https://static.toyotabharat.com/images/showroom/innova-mmc/silver-color-1600x600.png",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-third-row-seats-11.jpeg?q=80"
    ],
    color: "#475569",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "users",
        title: "7-8 Seats",
        description: "Spacious family transport"
      },
      {
        icon: "engine",
        title: "2.4L Diesel",
        description: "Powerful engine"
      },
      {
        icon: "truck",
        title: "Luggage Space",
        description: "Generous cargo capacity"
      },
      {
        icon: "monitor",
        title: "9\" Touchscreen",
        description: "Advanced infotainment"
      }
    ],
    insights: [
      "Diesel engine provides excellent torque for hill driving",
      "Captain seats option available for premium comfort",
      "Higher ground clearance ideal for rough terrain",
      "Superior AC cooling for hot climate regions"
    ]
  },
  {
    id: "honda-city",
    model: "Honda",
    title: "Honda City",
    description: "The Honda City is a premium sedan that offers excellent ride comfort, elegant styling, and a feature-rich interior with best-in-class space.",
    pricePerDay: 2000,
    pricePerKm: 19,
    image: "https://pngimg.com/d/honda_PNG102938.png",
    images: [
      "https://imgd.aeplcdn.com/1280x720/n/cw/ec/134287/city-interior-seats-28.jpeg?isig=0&q=80"
    ],
    color: "#dc2626",
    video: "",
    features: [
      {
        icon: "zap",
        title: "121 HP Engine",
        description: "Responsive performance"
      },
      {
        icon: "fuel",
        title: "24.1 km/l",
        description: "Excellent mileage"
      },
      {
        icon: "shield",
        title: "6 Airbags",
        description: "Enhanced safety"
      },
      {
        icon: "wind",
        title: "Climate Control",
        description: "Automatic air conditioning"
      }
    ],
    insights: [
      "Ideal for business travel with premium appearance",
      "Comfortable ride quality for long highway journeys",
      "Fuel-efficient for daily commuting",
      "Spacious trunk fits 3-4 large suitcases"
    ]
  },
  {
    id: "maruti-ertiga",
    model: "Maruti Suzuki",
    title: "Maruti Suzuki Ertiga",
    description: "The Ertiga is a versatile 7-seater MPV that combines comfort, style, and efficiency, making it perfect for families and long journeys.",
    pricePerDay: 2200,
    pricePerKm: 16,
    image: "https://www.marutiseva.com/assets/images/ertiga/silky-silver.png",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/115777/ertiga-interior-third-row-seats-2.jpeg?isig=0&q=80"
    ],
    color: "#0ea5e9",
    video: "",
    features: [
      {
        icon: "users",
        title: "7 Seats",
        description: "Flexible seating arrangement"
      },
      {
        icon: "fuel",
        title: "26.11 km/kg",
        description: "CNG efficiency"
      },
      {
        icon: "package",
        title: "Cargo Space",
        description: "Flexible storage options"
      },
      {
        icon: "smartphone",
        title: "SmartPlay Studio",
        description: "Connected car features"
      }
    ],
    insights: [
      "CNG option available for economical long-distance travel",
      "Third-row seats can be folded for extra luggage space",
      "Best for family outings with up to 7 people",
      "Easy maneuverability in city traffic"
    ]
  },
  {
    id: "maruti-dzire",
    model: "Maruti Suzuki",
    title: "Maruti Suzuki Dzire",
    description: "The Dzire is a compact sedan offering exceptional fuel efficiency, modern features, and a comfortable cabin in an affordable package.",
    pricePerDay: 1800,
    pricePerKm: 14,
    image: "https://5.imimg.com/data5/MA/SC/GLADMIN-21909237/maruti-suzuki-swift-dzire.png",
    images: [
      "https://imgd.aeplcdn.com/664x374/n/cw/ec/45691/dzire-interior-seats-3.jpeg?q=80"
    ],
    color: "#f59e0b",
    video: "",
    features: [
      {
        icon: "fuel",
        title: "31.12 km/kg",
        description: "CNG fuel efficiency"
      },
      {
        icon: "lock",
        title: "Keyless Entry",
        description: "Convenient access"
      },
      {
        icon: "cpu",
        title: "Auto AC",
        description: "Climate control"
      },
      {
        icon: "music",
        title: "Infotainment",
        description: "SmartPlay studio"
      }
    ],
    insights: [
      "Most economical option for solo travelers or couples",
      "Ideal for city driving with compact dimensions",
      "Adequate trunk space for 2-3 medium suitcases",
      "Low maintenance costs for budget-conscious renters"
    ]
  },
  {
    id: "kia-carens",
    model: "Kia",
    title: "Kia Carens",
    description: "The Kia Carens is a versatile recreational vehicle with premium styling, generous space, and advanced technology for modern families.",
    pricePerDay: 2800,
    pricePerKm: 20,
    image: "https://www.kia.com/content/dam/kia2/in/en/images/buy/how-it-works/HIW-carens-third-image.png",
    images: [
      "https://freepngimg.com/thumb/car/4-car-png-image-car-png-pictures-download.png"
    ],
    color: "#2563eb",
    video: "https://www.youtube.com/watch?v=eA3G3gVG8Tk",
    features: [
      {
        icon: "users",
        title: "6-7 Seats",
        description: "Flexible seating options"
      },
      {
        icon: "sun",
        title: "Sunroof",
        description: "One-touch electric sunroof"
      },
      {
        icon: "airplay",
        title: "10.25\" Display",
        description: "Connected infotainment"
      },
      {
        icon: "shield",
        title: "6 Airbags",
        description: "All-round protection"
      }
    ],
    insights: [
      "Premium features like ventilated seats for comfortable journeys",
      "Multiple USB charging ports for all passengers",
      "Advanced driver assistance systems for safer highway driving",
      "Suitable for both family trips and business travel"
    ]
  }
];
