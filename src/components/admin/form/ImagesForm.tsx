
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      {additionalImages.length > 0 ? (
        <div className="space-y-2">
          {additionalImages.map((image, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-16 h-12 bg-gray-100 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                  <img src={image} alt={`Image ${index + 1}`} className="w-full h-full object-contain" />
                </div>
                <div className="truncate">
                  <p className="text-sm truncate">{image}</p>
                </div>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => deleteImage(index)}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No additional images added yet. Add some images below.</p>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Label htmlFor="newImageUrl">Image URL</Label>
          <Input
            id="newImageUrl"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="https://example.com/car-image.jpg"
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
