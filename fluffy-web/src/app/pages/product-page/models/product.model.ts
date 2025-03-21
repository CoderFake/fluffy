export interface Product {
    product_id: number;
    product_name: string;
    pricing: {
        original_price: string;
        discount_percentage: string;
    };
    images: string[];
    image: string;
    color: {
        selected_colors: string[];
    };
    size: {
        available_sizes: string[];
    };
    rating: number;
    description: string;
    collection: string;
} 