import {supabase} from "../supabase/supabase";

export async function addProductName(title: string, assessment: string, newReviewId: any) {
    try {
        const titleLowerCase = title.toLowerCase();
        const titleFormatted = titleLowerCase.charAt(0).toUpperCase() + titleLowerCase.slice(1);
        let productId
        const {data: productsData} = await supabase
            .from('products')
            .select('id')
            .eq('name', titleFormatted)
            .limit(1);

        if (productsData?.[0]?.id) {
            productId = productsData?.[0]?.id
        } else {
            const {data: newProductData} = await supabase
                .from('products')
                .insert({name: titleFormatted})
                .select("id")
                .single();
            productId = newProductData?.id
        }

        await supabase
            .from('review_products')
            .insert({
                review_id: newReviewId,
                product_id: productId,
                assessment
            });
        await supabase.rpc('update_average_assessment', {p_product_id: productId});
    } catch(e) {
        console.log(e);
    }
}
