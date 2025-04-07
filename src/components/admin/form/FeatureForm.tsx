
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, PencilLine, Trash } from 'lucide-react';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const AVAILABLE_ICONS = [
  "zap", "bolt", "battery-charging", "cpu", "activity", 
  "shield", "sun", "bluetooth", "command", "maximize",
  "package", "wind", "layout", "mountain", "fuel", "settings", "monitor"
];

interface FeatureFormProps {
  features: Feature[];
  setFeatures: React.Dispatch<React.SetStateAction<Feature[]>>;
}

export const FeatureForm: React.FC<FeatureFormProps> = ({ features, setFeatures }) => {
  const [newFeatureIcon, setNewFeatureIcon] = React.useState("zap");
  const [newFeatureTitle, setNewFeatureTitle] = React.useState("");
  const [newFeatureDesc, setNewFeatureDesc] = React.useState("");
  const [editingFeatureIndex, setEditingFeatureIndex] = React.useState<number | null>(null);

  const addFeature = () => {
    if (newFeatureTitle.trim() === "") return;
    
    const newFeature: Feature = {
      icon: newFeatureIcon,
      title: newFeatureTitle.trim(),
      description: newFeatureDesc.trim()
    };
    
    if (editingFeatureIndex !== null) {
      const updatedFeatures = [...features];
      updatedFeatures[editingFeatureIndex] = newFeature;
      setFeatures(updatedFeatures);
      setEditingFeatureIndex(null);
    } else {
      setFeatures([...features, newFeature]);
    }
    
    setNewFeatureIcon("zap");
    setNewFeatureTitle("");
    setNewFeatureDesc("");
  };

  const editFeature = (index: number) => {
    const feature = features[index];
    setNewFeatureIcon(feature.icon);
    setNewFeatureTitle(feature.title);
    setNewFeatureDesc(feature.description);
    setEditingFeatureIndex(index);
  };

  const deleteFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
    
    if (editingFeatureIndex === index) {
      setEditingFeatureIndex(null);
      setNewFeatureIcon("zap");
      setNewFeatureTitle("");
      setNewFeatureDesc("");
    }
  };

  return (
    <div className="space-y-4">
      {features.length > 0 ? (
        <div className="space-y-2">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-md bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-md text-primary">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => editFeature(index)}
                >
                  <PencilLine className="h-4 w-4" />
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => deleteFeature(index)}
                  className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No features added yet. Add some features below.</p>
      )}

      <div className="space-y-3 pt-3 border-t">
        <h4 className="text-sm font-medium">
          {editingFeatureIndex !== null ? "Edit Feature" : "Add New Feature"}
        </h4>
        
        <div className="grid grid-cols-1 gap-3">
          <div className="space-y-2">
            <Label htmlFor="featureIcon">Icon Name</Label>
            <div className="flex items-center gap-2">
              <Input
                id="featureIcon"
                value={newFeatureIcon}
                onChange={(e) => setNewFeatureIcon(e.target.value)}
                placeholder="Icon name (e.g. zap, bolt)"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Available icons: {AVAILABLE_ICONS.join(", ")}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="featureTitle">Title</Label>
            <Input
              id="featureTitle"
              value={newFeatureTitle}
              onChange={(e) => setNewFeatureTitle(e.target.value)}
              placeholder="e.g. 750 HP Overboost"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="featureDesc">Description</Label>
            <Input
              id="featureDesc"
              value={newFeatureDesc}
              onChange={(e) => setNewFeatureDesc(e.target.value)}
              placeholder="e.g. Porsche performance"
            />
          </div>
        </div>
        
        <Button 
          type="button" 
          onClick={addFeature}
          variant="outline"
          className="w-full"
        >
          {editingFeatureIndex !== null ? (
            <>Update Feature</>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-1" />
              Add Feature
            </>
          )}
        </Button>
        
        {editingFeatureIndex !== null && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setEditingFeatureIndex(null);
              setNewFeatureIcon("zap");
              setNewFeatureTitle("");
              setNewFeatureDesc("");
            }}
            className="w-full text-muted-foreground"
          >
            Cancel Edit
          </Button>
        )}
      </div>
    </div>
  );
};

export default FeatureForm;
