
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ImagesFormProps {
  additionalImages: string[];
  setAdditionalImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ImagesForm: React.FC<ImagesFormProps> = ({ additionalImages, setAdditionalImages }) => {
  const [newImageUrl, setNewImageUrl] = React.useState("");

  const addImage = () => {
    if (newImageUrl.trim() === "") return;
    setAdditionalImages([...additionalImages, newImageUrl.trim()]);
    setNewImageUrl("");
  };
  
  const deleteImage = (index: number) => {
    const newImages = additionalImages.filter((_, i) => i !== index);
    setAdditionalImages(newImages);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addImage();
    }
  };

  return (
    <div className="space-y-4">
      {additionalImages.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {additionalImages.map((image, index) => (
            <Card key={index} className="overflow-hidden group relative">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-t flex items-center justify-center overflow-hidden">
                <img 
                  src={image} 
                  alt={`Image ${index + 1}`} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'placeholder.svg';
                    (e.target as HTMLImageElement).classList.add('p-4');
                  }}
                />
              </div>
              <div className="p-2 text-xs truncate text-gray-500">{image.substring(0, 30)}...</div>
              <Button 
                type="button" 
                variant="destructive" 
                size="icon"
                onClick={() => deleteImage(index)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 border-2 border-dashed rounded-lg flex flex-col items-center gap-2 text-muted-foreground">
          <Image className="h-10 w-10" />
          <p>No additional images added yet</p>
          <p className="text-sm">Add some images below</p>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Label htmlFor="newImageUrl">Image URL</Label>
          <Input
            id="newImageUrl"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/car-image.jpg"
            onKeyPress={handleKeyPress}
          />
        </div>
        <Button 
          type="button" 
          onClick={addImage}
          variant="outline"
          className="mb-0.5"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Note: These images will appear in the carousel on the car details page
      </p>
    </div>
  );
};

export default ImagesForm;
