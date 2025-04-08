
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addInsight();
    }
  };

  return (
    <div className="space-y-4">
      {insights.length > 0 ? (
        <Card className="overflow-hidden border border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3 text-primary">
              <Info className="h-5 w-5" />
              <h3 className="font-medium">Rental Insights Preview</h3>
            </div>
            <ul className="space-y-2">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2 group relative p-3 rounded-md bg-primary/5 hover:bg-primary/10 transition-colors">
                  <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold">{index + 1}</span>
                  </div>
                  <p className="text-sm flex-1">{insight}</p>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => deleteInsight(index)}
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-6 border-2 border-dashed rounded-lg flex flex-col items-center gap-2 text-muted-foreground">
          <Info className="h-10 w-10" />
          <p>No rental insights added yet</p>
          <p className="text-sm">Add some insights below</p>
        </div>
      )}

      <div className="flex items-end gap-2">
        <div className="flex-grow">
          <Label htmlFor="newInsight">Insight</Label>
          <Input
            id="newInsight"
            value={newInsight}
            onChange={(e) => setNewInsight(e.target.value)}
            placeholder="e.g. Perfect for family trips with up to 8 passengers"
            onKeyPress={handleKeyPress}
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
