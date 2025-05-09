const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const Product = require("../Models/ProductSchema.js");

const getAllProducts = async(req,res)=>
{
    
    try{
        const products = await Product.find({});
        res.status(200).json({success:true,data:products});
    }
    catch(error)
    {
        console.error("Error in fetching all the products:",error.message);
        res.status(500).json({success:false,message:"Server Error"});
    }
};
const getProductByName = async (req, res) => {
    try {
        const name = req.body;
        const product= await Product.findOne({name});
        res.status(200).json({success: true, data: product});
    }
    catch(error) {
        console.error("Error in fetching the Product ", error.message);
        res.status(500).json({success:false,message:"Server Error"});
    }
};

const createProduct = async (req,res) => {
    // const product = req.body;
    // if(!product.name || !product.quantity || !product.price)
    // {
    //     res.status(400).json({success:false, message:"Please provide all name, quantity and price"});
    // }
    // const newProduct= new Product(product);
    // try{

    //     await newProduct.save();
    //     res.status(201).json({success:true,data:newProduct});
    // }
    // catch(error)
    // {
    //     console.error("Error in creation of product:",error.message);
    //     res.status(500).json({success:false,message:"Server Error"});
    // }

    try {
        const { name, quantity, price } = req.body;

        if (!name || !quantity || !price) {
            return res.status(400).json({
                success: false,
                message: "Please provide the details: name, quantity and price",
            });
        }

        const image = req.file ? "uploads/" + req.file.filename : null;

        const newProduct = new Product({ name, quantity, price, image });

        await newProduct.save();

        res.status(201).json({ success: true, data: newProduct });
    } catch (error) {
        console.error("Error in creation of product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

const deleteProduct = async (req,res)=>{
    
    try {
        const { productName } = req.body;
        if (!productName) {
            return res.status(400).json({ success: false, message: "Product name required" });
        }

        const deleted = await Product.findOneAndDelete({ name: productName });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (deleted.image) {
            const imagePath = path.resolve(deleted.image);  // Get absolute path
            // OPTIONAL: Ensure file is within uploads directory (safety check)
            const uploadsDir = path.resolve("uploads");
            if (imagePath.startsWith(uploadsDir)) {
                fs.unlink(imagePath, (err) => {
                    if (err) {
                        console.warn("Could not delete image file:", err.message);
                    } else {
                        console.log("Image file deleted:", imagePath);
                    }
                });
            }
        }
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const updateProduct = async (req,res)=>{
    const {name ,...updatedData}= req.body;
    if(!name)
    {
        return res.status(400).json({ success: false, message: "Name of the product is required." });
    }
    try{
        const updatedProduct = await Product.findOneAndUpdate(
            {name},updatedData,{new:true}
        );
        if(!updateProduct)
        {
            return res.status(404).json({ success: false, message: "Product not found." });
        }
        res.status(200).json({ success: true, data: updatedProduct });
    }
    catch (error) {
    console.error("Error updating Product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
    }   
}
module.exports = {getAllProducts,getProductByName,createProduct,deleteProduct,updateProduct};