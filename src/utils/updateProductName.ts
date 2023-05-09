import {supabase} from "../supabase/supabase";

export async function updateProductName(title: string, assessment: string, reviewId: string) {
    try {
        const titleLowerCase = title.toLowerCase();
        const titleFormatted = titleLowerCase.charAt(0).toUpperCase() + titleLowerCase.slice(1);
        const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("id")
            .eq("name", titleFormatted)
            .limit(1);

        if (productsError) {
            throw productsError;
        }
        let productId: number;

        if (productsData && productsData.length > 0 && productsData[0].id) {
            productId = productsData[0].id;
        } else {
            const { data: newProductData, error: newProductError } = await supabase
                .from("products")
                .insert({ name: titleFormatted })
                .select("id")
                .single();

            if (newProductError) {
                throw newProductError;
            }

            productId = newProductData.id;
        }
        await supabase
            .from("review_products")
            .update({product_id: productId, assessment})
            .eq('review_id', reviewId)
            .single();

        await supabase.rpc('update_average_assessment', {p_product_id: productId});

    } catch (error) {
        console.error("Error in updateProductName:", error);
    }
}
