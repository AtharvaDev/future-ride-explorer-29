
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash } from 'lucide-react';

interface InsightsFormProps {
  insights: string[];
  setInsights: React.Dispatch<React.SetStateAction<string[]>>;
}

export const InsightsForm: React.FC<InsightsFormProps> = ({ insights, setInsights }) => {
  const [newInsight, setNewInsight] = React.useState("");

  const addInsight = () => {
    if (newInsight.trim() === "") return;
    setInsights([...insights, newInsight.trim()]);
    setNewInsight("");
  };
  
  const deleteInsight = (index: number) => {
    const newInsights = insights.filter((_, i) => i !== index);
    setInsights(newInsights);
  };

  return (
    <div className="space-y-4">
      {insights.length > 0 ? (
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start justify-between p-3 border rounded-md bg-muted/30">
              <div className="flex items-start gap-3">
                <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold">{index + 1}</span>
                </div>
                <p className="text-sm">{insight}</p>
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => deleteInsight(index)}
                className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No rental insights added yet. Add some insights below.</p>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Label htmlFor="newInsight">Insight</Label>
          <Input
            id="newInsight"
            value={newInsight}
            onChange={(e) => setNewInsight(e.target.value)}
            placeholder="e.g. Perfect for family trips with up to 8 passengers"
          />
        </div>
        <Button 
          type="button" 
          onClick={addInsight}
          variant="outline"
          className="mb-0.5"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        These insights will be displayed on the booking page to help customers choose the right car
      </p>
    </div>
  );
};

export default InsightsForm;
