const request = require("supertest");
const app = require("../app.js");
const User = require("../Models/UserSchema.js");
const Product = require("../Models/ProductSchema.js");
const bcrypt = require("bcryptjs");
const { connectDB } = require("../Database/ConnectorDB.js");
const mongoose = require("mongoose");

const timestamp = Date.now(); // Ensures uniqueness         // #..#

const testUser = {
    userId: `user-${timestamp}`,            // #..#
    email: `producttestuser${timestamp}@example.com`,   // #..#
    password: "password123",
    username: "producttestuser",
    role: "user",
};

const testProduct = {
    productId: `product-${timestamp}`, // #..#
    name: `Test Product ${timestamp}`, // #..#
    quantity: 100,
    price: 99.99,
};
describe("Product Management", () => {
    let token;

    beforeAll(async () => {
        // Connect to the test database
        await connectDB();

        // Clean up any existing test user
        await User.deleteOne({
            userId: testUser.userId,
            email: testUser.email,
        }); // #..#

        // Hash the password and create the user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(testUser.password, salt);
        await User.create({ ...testUser, password: hashedPassword });

        // Login to get token
        const res = await request(app).post("/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        token = res.body.token;
    });

    it("should create a new product", async () => {
        const res = await request(app)
            .post("/products")
            .set("Authorization", `Bearer ${token}`)
            .send(testProduct);

        expect(res.statusCode).toEqual(201);
        expect(res.body.success).toBeTruthy();
        expect(res.body.data).toHaveProperty("name", testProduct.name);
        expect(res.body.data).toHaveProperty("quantity", testProduct.quantity);
        expect(res.body.data).toHaveProperty("price", testProduct.price);
    });

    it("should retrieve all products", async () => {
        const res = await request(app)
            .get("/products")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBeTruthy();
        expect(Array.isArray(res.body.data)).toBeTruthy();
    });
});

afterAll(async () => {
    // Clean up test user and product
    await User.deleteOne({ userId: testUser.userId, email: testUser.email }); // #..#
    await Product.deleteOne({ productId: testProduct.productId }); // #..#
    await mongoose.connection.close();  // #..#
});
