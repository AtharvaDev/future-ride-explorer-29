
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAllReviews, addReview, updateReview, deleteReview, updateReviewsOrder } from '@/services/reviewService';
import { Review } from '@/types/review';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Star, StarOff, Loader2, Trash2, Edit, MoveUp, MoveDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  rating: z.number().min(1).max(5),
  text: z.string().min(10, { message: 'Review must be at least 10 characters.' }),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get all reviews
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ['reviews'],
    queryFn: getAllReviews
  });
  
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      name: '',
      rating: 5,
      text: '',
    },
  });
  
  // Add/edit review mutation
  const reviewMutation = useMutation({
    mutationFn: async (data: ReviewFormData & { id?: string }) => {
      if (data.id) {
        await updateReview(data.id, data);
        return { ...data, id: data.id };
      } else {
        const id = await addReview(data);
        return { ...data, id };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      setIsDialogOpen(false);
      toast({
        title: editingReview ? 'Review updated' : 'Review added',
        description: editingReview ? 'The review has been updated successfully.' : 'A new review has been added successfully.',
      });
      setEditingReview(null);
    },
  });
  
  // Delete review mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      toast({
        title: 'Review deleted',
        description: 'The review has been deleted successfully.',
      });
    },
  });
  
  // Reorder reviews mutation
  const reorderMutation = useMutation({
    mutationFn: (orderedReviews: { id: string; displayOrder: number }[]) => 
      updateReviewsOrder(orderedReviews),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
  
  const onSubmit = (data: ReviewFormData) => {
    if (editingReview) {
      reviewMutation.mutate({ ...data, id: editingReview.id });
    } else {
      reviewMutation.mutate(data);
    }
  };
  
  const handleAddReview = () => {
    form.reset({
      name: '',
      rating: 5,
      text: '',
    });
    setEditingReview(null);
    setIsDialogOpen(true);
  };
  
  const handleEditReview = (review: Review) => {
    form.reset({
      name: review.name,
      rating: review.rating,
      text: review.text,
    });
    setEditingReview(review);
    setIsDialogOpen(true);
  };
  
  const handleDeleteReview = (id: string) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleMoveReview = (review: Review, direction: 'up' | 'down') => {
    const currentIndex = reviews.findIndex(r => r.id === review.id);
    if (
      (direction === 'up' && currentIndex === 0) || 
      (direction === 'down' && currentIndex === reviews.length - 1)
    ) {
      return;
    }
    
    const updatedReviews = [...reviews];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    // Swap the reviews
    [updatedReviews[currentIndex], updatedReviews[targetIndex]] = 
      [updatedReviews[targetIndex], updatedReviews[currentIndex]];
    
    // Update the display order
    const reorderData = updatedReviews.map((review, index) => ({
      id: review.id!,
      displayOrder: index
    }));
    
    reorderMutation.mutate(reorderData);
  };
  
  const renderRatingInput = () => {
    const rating = form.watch('rating');
    
    return (
      <div className="flex items-center space-x-1 mt-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => form.setValue('rating', star, { shouldValidate: true })}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <Star className="w-6 h-6 text-primary fill-primary" />
            ) : (
              <StarOff className="w-6 h-6 text-muted-foreground" />
            )}
          </button>
        ))}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <Card className="admin-card">
      <CardHeader>
        <CardTitle>Client Reviews</CardTitle>
        <CardDescription>Manage client testimonials that appear on the homepage</CardDescription>
        <Button onClick={handleAddReview}>Add New Review</Button>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No reviews yet</p>
            <Button onClick={handleAddReview}>Add Your First Review</Button>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id} className="relative">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex mb-2">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-sm font-medium">{review.name}</p>
                      <p className="text-muted-foreground mt-1">{review.text}</p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleMoveReview(review, 'up')}
                        disabled={reviews.indexOf(review) === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleMoveReview(review, 'down')}
                        disabled={reviews.indexOf(review) === reviews.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEditReview(review)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteReview(review.id!)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingReview ? 'Edit Review' : 'Add New Review'}</DialogTitle>
              <DialogDescription>
                {editingReview 
                  ? 'Update the client review details below.' 
                  : 'Enter the details of the client review below.'}
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter client name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rating"
                  render={() => (
                    <FormItem>
                      <FormLabel>Rating</FormLabel>
                      <FormControl>
                        {renderRatingInput()}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Review Text</FormLabel>
                      <FormControl>
                        <textarea 
                          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          rows={4}
                          placeholder="Enter client review text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={reviewMutation.isPending}
                  >
                    {reviewMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {editingReview ? 'Update' : 'Add'} Review
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ReviewsManager;
