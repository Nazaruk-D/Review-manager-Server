import {supabase} from "../../supabase/supabase";

export async function fetchSimilarReviews(product_id: number): Promise<any> {
    const {data: reviewProductQuery} = await supabase
        .from("review_products")
        .select("review_id")
        .in("product_id", [product_id]);

    const { data: similarReviews, error: similarReviewsError } = await supabase
        .from("reviews")
        .select("id, author_id, created_at, review_title, author_name, avg_rating")
        .in("id", reviewProductQuery!.map(review => review.review_id))

    if (similarReviewsError) {
        console.error(similarReviewsError);
        return [];
    }

    return similarReviews;
}
