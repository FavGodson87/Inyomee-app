// backend/seedFood.js
import mongoose from "mongoose";
import 'dotenv/config';
import itemModal from './models/itemModal.js' 
import { connectDB } from "./config/db.js";

// Array of 44 food items
const foodsToInsert = [
  { name: "Meat Pie", description: "Flaky pastry filled with seasoned minced beef.", price: 600, category: "Pastries", imageUrl: "/uploads/food1.jpg" },
  { name: "Chicken Pie", description: "Golden pastry filled with creamy chicken and potatoes.", price: 700, category: "Pastries", imageUrl: "/uploads/food2.jpg" },
  { name: "Sausage Roll", description: "Crispy roll wrapped around juicy spiced sausage.", price: 500, category: "Pastries", imageUrl: "/uploads/food3.jpg" },
  { name: "Samosa", description: "Crispy triangle pastry with savory potato and spice mix.", price: 400, category: "Pastries", imageUrl: "/uploads/food4.jpg" },
  { name: "Donut", description: "Soft, fluffy donuts coated in sugar glaze or cream filling.", price: 800, category: "Sweets", imageUrl: "/uploads/food5.jpg" },
  { name: "Cupcake", description: "Moist sponge topped with creamy frosting and sprinkles.", price: 700, category: "Sweets", imageUrl: "/uploads/food6.jpg" },
  { name: "Muffins", description: "Wholesome muffins packed with chocolate chips or berries.", price: 900, category: "Sweets", imageUrl: "/uploads/food7.jpg" },
  { name: "Puff-puff", description: "Golden fried dough balls with a sweet, fluffy inside.", price: 500, category: "Sweets", imageUrl: "/uploads/food8.webp" },
  { name: "Croissant", description: "Buttery, flaky pastry with a soft center.", price: 1200, category: "Breads", imageUrl: "/uploads/food9.jpg" },
  { name: "Cinnamon Roll", description: "Warm roll swirled with cinnamon and drizzled with icing.", price: 1500, category: "Breads", imageUrl: "/uploads/food10.jpg" },
  { name: "Brioche Bun", description: "Soft, slightly sweet bread — perfect for sandwiches.", price: 1000, category: "Breads", imageUrl: "/uploads/food11.jpg" },
  { name: "Bagel", description: "Chewy, boiled-and-baked bread ring, great with cream cheese.", price: 1200, category: "Breads", imageUrl: "/uploads/food12.jpg" },
  { name: "Red Velvet Cake", description: "Moist red sponge with cream cheese frosting.", price: 2500, category: "Cakes", imageUrl: "/uploads/food13.jpg" },
  { name: "Brownie", description: "Fudgy chocolate square with a gooey center.", price: 3000, category: "Cakes", imageUrl: "/uploads/food14.jpg" },
  { name: "Vanilla Cake", description: "Moist vanilla sponge topped with cream frosting and blueberries.", price: 2000, category: "Cakes", imageUrl: "/uploads/food15.png" },
  { name: "Carrot Cake", description: "Spiced carrot cake topped with cream cheese icing.", price: 2000, category: "Cakes", imageUrl: "/uploads/food16.jpg" },
  { name: "Vanilla Ice Cream", description: "Classic creamy vanilla scoop.", price: 1700, category: "Ice Cream", imageUrl: "/uploads/food17.png" },
  { name: "Chocolate Ice Cream", description: "Rich chocolate flavor in every bite.", price: 2500, category: "Ice Cream", imageUrl: "/uploads/food18.jpg" },
  { name: "Strawberry Ice Cream", description: "Sweet and fruity strawberry delight.", price: 1800, category: "Ice Cream", imageUrl: "/uploads/food19.jpg" },
  { name: "Cookies and Cream", description: "Creamy ice cream packed with cookie chunks.", price: 2000, category: "Ice Cream", imageUrl: "/uploads/food20.jpg" },
  { name: "Margherita Pizza", description: "Classic tomato, mozzarella, and basil.", price: 3500, category: "Pizza", imageUrl: "/uploads/food21.jpg" },
  { name: "Pepperoni Pizza", description: "Cheesy pizza topped with spicy pepperoni slices.", price: 4000, category: "Pizza", imageUrl: "/uploads/food22.jpg" },
  { name: "BBQ Chicken Pizza", description: "Tangy BBQ sauce with grilled chicken and cheese.", price: 4500, category: "Pizza", imageUrl: "/uploads/food23.jpg" },
  { name: "Veggie Pizza", description: "Loaded with mushrooms, peppers, onions, and olives.", price: 3800, category: "Pizza", imageUrl: "/uploads/food24.jpg" },
  { name: "Classic Beef Burger", description: "Juicy beef patty with lettuce, tomato, and cheese.", price: 2500, category: "Burgers", imageUrl: "/uploads/food25.jpg" },
  { name: "Chicken Burger", description: "Crispy chicken fillet with creamy sauce.", price: 2800, category: "Burgers", imageUrl: "/uploads/food26.jpg" },
  { name: "Veggie Burger", description: "Plant-based patty with fresh toppings.", price: 2300, category: "Burgers", imageUrl: "/uploads/food27.jpg" },
  { name: "Grilled Cheese Sandwich", description: "Golden toast stuffed with gooey melted cheese.", price: 1800, category: "Burgers", imageUrl: "/uploads/food28.jpg" },
  { name: "French Fries", description: "Crispy golden fries with salt and ketchup.", price: 1200, category: "Snacks", imageUrl: "/uploads/food29.jpg" },
  { name: "Chicken Wings", description: "Spicy, tender wings with dipping sauce.", price: 2500, category: "Snacks", imageUrl: "/uploads/food30.jpg" },
  { name: "Onion Rings", description: "Crispy battered onion slices.", price: 1500, category: "Snacks", imageUrl: "/uploads/food31.jpg" },
  { name: "Mozzarella Sticks", description: "Crunchy sticks filled with melted cheese.", price: 2000, category: "Snacks", imageUrl: "/uploads/food32.jpg" },
  { name: "Chicken Shawarma", description: "Chicken, veggies, and garlic sauce in a soft pita.", price: 4000, category: "Wraps", imageUrl: "/uploads/food33.jpg" },
  { name: "Beef Shawarma", description: "Savory beef strips wrapped with veggies and sauce.", price: 3200, category: "Wraps", imageUrl: "/uploads/food34.jpg" },
  { name: "Falafel Wrap", description: "Crispy chickpea falafel with hummus and salad.", price: 1800, category: "Wraps", imageUrl: "/uploads/food35.jpg" },
  { name: "Veggie Wrap", description: "Healthy grilled veggies in a soft wrap.", price: 1700, category: "Wraps", imageUrl: "/uploads/food36.jpg" },
  { name: "Choc-Chip Cookie", description: "Classic cookie with gooey chocolate chips.", price: 500, category: "Cookies", imageUrl: "/uploads/food37.jpg" },
  { name: "Oat-Raisin Cookie", description: "Chewy oatmeal cookie with sweet raisins.", price: 400, category: "Cookies", imageUrl: "/uploads/food38.jpg" },
  { name: "Double Choc-Cookie", description: "Rich chocolate cookie with extra cocoa goodness.", price: 800, category: "Cookies", imageUrl: "/uploads/food39.jpg" },
  { name: "PB Cookie", description: "Nutty cookie with smooth peanut butter flavor.", price: 500, category: "Cookies", imageUrl: "/uploads/food40.jpg" },
  { name: "Smoothies", description: "Blended fresh fruits for a creamy, healthy treat.", price: 3500, category: "Drinks", imageUrl: "/uploads/food41.jpg" },
  { name: "Milkshake", description: "Thick, sweet, and creamy milk-based drink", price: 2500, category: "Drinks", imageUrl: "/uploads/food42.jpg" },
  { name: "Juice", description: "Refreshing natural fruit juice, packed with flavor", price: 1500, category: "Drinks", imageUrl: "/uploads/food43.jpg" },
  { name: "Soda", description: "Fizzy, sweet, and refreshing carbonated drink.", price: 800, category: "Drinks", imageUrl: "/uploads/food44.jpg" }
];


async function seedFoods() {
  try {
    await connectDB();

    // Clear existing foods
    await itemModal.deleteMany({});
    console.log("Existing foods cleared");

    // Insert foods
    await itemModal.insertMany(foodsToInsert);
    console.log("All 44 food items added successfully!");

    process.exit(0);
  } catch (err) {
    console.error("Error seeding food:", err);
    process.exit(1);
  }
}

seedFoods();
