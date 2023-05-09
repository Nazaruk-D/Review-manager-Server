import {supabase} from "../supabase/supabase";

export async function getReviewById(reviewId: string): Promise<Review> {
    const {data: review, error: reviewError} = await supabase
        .from('reviews')
        .select('id, author_id, body, review_title, category, avg_rating, created_at')
        .eq('id', reviewId)
        .single();
    if (reviewError) {
        console.error(reviewError);
        throw new Error('Internal server error');
    }
    return review;
}

export interface Review {
    id: string;
    author_id: string;
    title?: string;
    body: string;
    assessment?: number;
    review_title: string;
    category: string;
    avg_rating: number;
    created_at: string;
    tags?: string[];
    likes?: string[];
    ratings?: string[];
    images?: string[];
    avg_assessment?: number
    similarReview?: Review[]
}