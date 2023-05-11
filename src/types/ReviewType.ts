export interface Review {
    id: string;
    author_id: string;
    author_name: string;
    body: string;
    assessment?: number;
    review_title: string;
    category: string;
    avg_rating: number;
    created_at: string;
    title?: string;
    tags?: string[];
    likes?: string[];
    ratings?: string[];
    images?: string[];
    avg_assessment?: number
    similarReview?: Review[]
}