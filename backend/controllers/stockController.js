const ProductVariant = require("../models/productVariants");
const Product = require("../models/products");
const Category = require("../models/categories");

const getStockByCategory = async (req, res) => {
    try {
        const stockData = await ProductVariant.aggregate([
            {
                $lookup: {
                    from: "products",
                    localField: "productFk",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.categoryFk",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },
            {
                $group: {
                    _id: "$category.categoryName", // field name
                    totalStock: { $sum: "$stock" }
                }
            },

        ]);

        res.json(stockData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching stock data", error });
    }
};

module.exports = { getStockByCategory };
