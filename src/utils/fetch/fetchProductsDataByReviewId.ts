import {supabase} from "../../supabase/supabase";

export async function fetchProductsDataByReviewId(reviewId: string) {
    const {data: products, error} = await supabase
        .from('products')
        .select('name, avg_assessment, review_products!inner(assessment, product_id)')
        .eq('review_products.review_id', reviewId)
        .single<Product>()

    if (error) {
        console.error(error);
        return {title:'', assessment: 0, product_id: 0};
    }

    const title = products?.name
    const avg_assessment = products?.avg_assessment
    const assessment = products?.review_products?.find(p => p.assessment)?.assessment ?? 0
    const product_id = products?.review_products?.find(p => p.product_id)?.product_id ?? 0
    return {title, assessment, product_id, avg_assessment}
}

interface Product {
    name: string;
    avg_assessment: number
    review_products: { assessment: number, product_id: number }[];
}