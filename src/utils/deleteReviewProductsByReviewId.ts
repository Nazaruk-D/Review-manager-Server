import {supabase} from "../supabase/supabase";

export async function deleteReviewProductsByReviewId(reviewId: string) {
    try {
        const { data: reviewProducts, error: reviewProductsError } = await supabase
            .from('review_products')
            .select('product_id')
            .eq('review_id', reviewId);

        if (reviewProductsError) {
            console.error(reviewProductsError);
            return;
        }

        await supabase.from('review_products').delete().eq('review_id', reviewId);

        if (reviewProducts && reviewProducts.length > 0) {
            const productId = reviewProducts[0].product_id;
            const { data: reviews, error: reviewsError } = await supabase
                .from('reviews')
                .select('product_name')
                .eq('product_id', productId)
                .limit(1);

            if (reviewsError) {
                console.error(reviewsError);
                return;
            }

            if (!reviews || reviews.length === 0) {
                await supabase.from('products').delete().eq('id', productId);
            }

            await supabase.rpc('update_average_assessment', {p_product_id: productId});
        }

    } catch (e) {
        console.error(e);
    }
}

