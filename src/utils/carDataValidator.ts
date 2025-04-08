
import { z } from 'zod';

// Define validation schema for car features
const carFeatureSchema = z.object({
  icon: z.string().min(1, "Icon is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required")
});

// Define validation schema for car data
export const carSchema = z.object({
  id: z.string().min(1, "ID is required"),
  model: z.string().min(1, "Model is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  pricePerDay: z.number().min(1, "Price per day is required and must be greater than 0"),
  pricePerKm: z.number().min(1, "Price per km is required and must be greater than 0"),
  image: z.string().url("Image must be a valid URL"),
  images: z.array(z.string().url("Image URL must be valid")).optional(),
  color: z.string().min(1, "Color is required"),
  video: z.string().optional(),
  features: z.array(carFeatureSchema).min(1, "At least one feature is required"),
  insights: z.array(z.string()).optional()
});

export type CarValidationResult = {
  valid: boolean;
  errors: Record<string, string[]>;
};

/**
 * Validates a car object against the schema
 */
export const validateCar = (car: any): CarValidationResult => {
  try {
    carSchema.parse(car);
    return { valid: true, errors: {} };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors: Record<string, string[]> = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!formattedErrors[path]) {
          formattedErrors[path] = [];
        }
        formattedErrors[path].push(err.message);
      });
      
      return { valid: false, errors: formattedErrors };
    }
    return { 
      valid: false, 
      errors: { general: ["Unknown validation error occurred"] } 
    };
  }
};

/**
 * Validates an array of car objects
 */
export const validateCars = (cars: any[]): { 
  allValid: boolean; 
  results: { car: any; result: CarValidationResult }[] 
} => {
  const results = cars.map(car => ({
    car,
    result: validateCar(car)
  }));
  
  const allValid = results.every(item => item.result.valid);
  
  return { allValid, results };
};
