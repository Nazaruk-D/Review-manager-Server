import {supabase} from "../../supabase/supabase";

export async function fetchProductNames(): Promise<string[]> {
    const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("name");

    if (productsError) {
        console.error("Error in getProductNames:", productsError);
        return [];
    }

    return productsData?.map((product: {name: string}) => product.name) ?? [];
}
