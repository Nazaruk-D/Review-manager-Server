import {supabase} from "../supabase/supabase";

export async function fetchProductsDataByReviewId(reviewId: string) {
    const {data: products, error} = await supabase
        .from('products')
        .select('name, review_products!inner(assessment)')
        .eq('review_products.review_id', reviewId)
        .single<Product>()

    if (error) {
        console.error(error);
        return {title:'', assessment: 0};
    }

    const title = products?.name
    const assessment = products?.review_products?.find(p => p.assessment)?.assessment ?? 0
    return {title, assessment}
}

interface Product {
    name: string;
    review_products: { assessment: number }[];
}