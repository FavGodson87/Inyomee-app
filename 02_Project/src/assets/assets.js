// images
import header from "./header.png";
import inyo from "./inyo.svg";
import breakfast from "./breakfast.png";
import waffle from "./waffle.png";
import papers from "./paper.png";
import paperrr from "./paperrr.png";

import add_icon_white from "./add_icon_white.png";
import add_icon_green from "./add_icon_green.png";
import remove_icon_red from "./remove_icon_red.png";
import app_store from "./app_store.png";
import play_store from "./play_store.png";

export const assets = {
  inyo,
  header,
  breakfast,
  waffle,
  papers,
  paperrr,
  add_icon_green,
  add_icon_white,
  remove_icon_red,
  app_store,
  play_store,
};

// foods
import food1 from "./food1.jpg";
import food2 from "./food2.jpg";
import food3 from "./food3.jpg";
import food4 from "./food4.jpg";
import food5 from "./food5.jpg";
import food6 from "./food6.jpg";
import food7 from "./food7.jpg";
import food8 from "./food8.webp";
import food9 from "./food9.jpg";
import food10 from "./food10.jpg";
import food11 from "./food11.jpg";
import food12 from "./food12.jpg";
import food13 from "./food13.jpg";
import food14 from "./food14.jpg";
import food15 from "./food15.png";
import food16 from "./food16.jpg";
import food17 from "./food17.png";
import food18 from "./food18.jpg";
import food19 from "./food19.jpg";
import food20 from "./food20.jpg";
import food21 from "./food21.jpg";
import food22 from "./food22.jpg";
import food23 from "./food23.jpg";
import food24 from "./food24.jpg";
import food25 from "./food25.jpg";
import food26 from "./food26.jpg";
import food27 from "./food27.jpg";
import food28 from "./food28.jpg";
import food29 from "./food29.jpg";
import food30 from "./food30.jpg";
import food31 from "./food31.jpg";
import food32 from "./food32.jpg";
import food33 from "./food33.jpg";
import food34 from "./food34.jpg";
import food35 from "./food35.jpg";
import food36 from "./food36.jpg";
import food37 from "./food37.jpg";
import food38 from "./food38.jpg";
import food39 from "./food39.jpg";
import food40 from "./food40.jpg";
import food41 from "./food41.jpg"
import food42 from "./food42.jpg"
import food43 from "./food43.jpg"
import food44 from "./food44.jpg"

// icons (references only)
import { GiCroissant } from "react-icons/gi";
import { GiDonut } from "react-icons/gi";
import { GiSlicedBread } from "react-icons/gi";
import { GiCakeSlice } from "react-icons/gi";
import { IoIceCream } from "react-icons/io5";
import { GiFullPizza } from "react-icons/gi";
import { GiHamburger } from "react-icons/gi";
import { GiFrenchFries } from "react-icons/gi";
import { GiTacos } from "react-icons/gi";
import { FaCookieBite } from "react-icons/fa";
import { RiDrinks2Fill } from "react-icons/ri";

export const menuList = [
  { menu_name: "Wraps", menu_icon: GiTacos },
  { menu_name: "Pizza", menu_icon: GiFullPizza },
  { menu_name: "Burgers", menu_icon: GiHamburger },
  { menu_name: "Snacks", menu_icon: GiFrenchFries },
  { menu_name: "Pastries", menu_icon: GiCroissant },
  { menu_name: "Sweets", menu_icon: GiDonut },
  { menu_name: "Breads", menu_icon: GiSlicedBread },
  { menu_name: "Cakes", menu_icon: GiCakeSlice },
  { menu_name: "Ice Cream", menu_icon: IoIceCream },
  { menu_name: "Cookies", menu_icon: FaCookieBite },
  { menu_name: "Drinks", menu_icon: RiDrinks2Fill },
];

export const foodList = [
  {
    _id: "1",
    name: "Meat Pie",
    image: food1,
    price: 600,
    description: "Flaky pastry filled with seasoned minced beef.",
    category: "Pastries",
  },
  {
    _id: "2",
    name: "Chicken Pie",
    image: food2,
    price: 700,
    description: "Golden pastry filled with creamy chicken and potatoes.",
    category: "Pastries",
  },
  {
    _id: "3",
    name: "Sausage Roll",
    image: food3,
    price: 500,
    description: "Crispy roll wrapped around juicy spiced sausage.",
    category: "Pastries",
  },
  {
    _id: "4",
    name: "Samosa",
    image: food4,
    price: 400,
    description: "Crispy triangle pastry with savory potato and spice mix.",
    category: "Pastries",
  },


  // SWEETS
  {
    _id: "5",
    name: "Donut",
    image: food5,
    price: 800,
    description: "Soft, fluffy donuts coated in sugar glaze or cream filling.",
    category: "Sweets",
  },
  {
    _id: "6",
    name: "Cupcake",
    image: food6,
    price: 700,
    description: "Moist sponge topped with creamy frosting and sprinkles.",
    category: "Sweets",
  },
  {
    _id: "7",
    name: "Muffins",
    image: food7,
    price: 900,
    description: "Wholesome muffins packed with chocolate chips or berries.",
    category: "Sweets",
  },
  {
    _id: "8",
    name: "Puff-puff",
    image: food8,
    price: 500,
    description: "Golden fried dough balls with a sweet, fluffy ins_ide.",
    category: "Sweets",
  },


  // BREADS
  {
    _id: "9",
    name: "Croissant",
    image: food9,
    price: 1200,
    description: "Buttery, flaky pastry with a soft center.",
    category: "Breads",
  },
  {
    _id: "10",
    name: "Cinnamon Roll",
    image: food10,
    price: 1500,
    description: "Warm roll swirled with cinnamon and drizzled with icing.",
    category: "Breads",
  },
  {
    _id: "11",
    name: "Brioche Bun",
    image: food11,
    price: 1000,
    description: "Soft, slightly sweet bread — perfect for sandwiches.",
    category: "Breads",
  },
  {
    _id: "12",
    name: "Bagel",
    image: food12,
    price: 1200,
    description: "Chewy, boiled-and-baked bread ring, great with cream cheese.",
    category: "Breads",
  },


  // CAKES
  {
    _id: "13",
    name: "Red Velvet Cake",
    image: food13,
    price: 2500,
    description: "Moist red sponge with cream cheese frosting.",
    category: "Cakes",
  },
  {
    _id: "14",
    name: "Brownie",
    image: food14,
    price: 3000,
    description: "Fudgy chocolate square with a gooey center.",
    category: "Cakes",
  },
  {
    _id: "15",
    name: "Vanilla Cake",
    image: food15,
    price: 2000,
    description:
      "Moist vanilla sponge topped with cream frosting and blueberries.",
    category: "Cakes",
  },
  {
    _id: "16",
    name: "Carrot Cake",
    image: food16,
    price: 2000,
    description: "Spiced carrot cake topped with cream cheese icing.",
    category: "Cakes",
  },


  // ICECREAM
  {
    _id: "17",
    name: "Vanilla Ice Cream",
    image: food17,
    price: 1700,
    description: "Classic creamy vanilla scoop.",
    category: "Ice Cream",
  },
  {
    _id: "18",
    name: "Chocolate Ice Cream",
    image: food18,
    price: 2500,
    description: "Rich chocolate flavor in every bite.",
    category: "Ice Cream",
  },
  {
    _id: "19",
    name: "Strawberry Ice Cream",
    image: food19,
    price: 1800,
    description: "Sweet and fruity strawberry delight.",
    category: "Ice Cream",
  },
  {
    _id: "20",
    name: "Cookies and Cream",
    image: food20,
    price: 2000,
    description: "Creamy ice cream packed with cookie chunks.",
    category: "Ice Cream",
  },


  // PIZZA
  {
    _id: "21",
    name: "Margherita Pizza",
    image: food21,
    price: 3500,
    description: "Classic tomato, mozzarella, and basil.",
    category: "Pizza",
  },
  {
    _id: "22",
    name: "Pepperoni Pizza",
    image: food22,
    price: 4000,
    description: "Cheesy pizza topped with spicy pepperoni slices.",
    category: "Pizza",
  },
  {
    _id: "23",
    name: "BBQ Chicken Pizza",
    image: food23,
    price: 4500,
    description: "Tangy BBQ sauce with grilled chicken and cheese.",
    category: "Pizza",
  },
  {
    _id: "24",
    name: "Veggie Pizza",
    image: food24,
    price: 3800,
    description: "Loaded with mushrooms, peppers, onions, and olives.",
    category: "Pizza",
  },


  // BURGER
  {
    _id: "25",
    name: "Classic Beef Burger",
    image: food25,
    price: 2500,
    description: "Juicy beef patty with lettuce, tomato, and cheese.",
    category: "Burgers",
  },
  {
    _id: "26",
    name: "Chicken Burger",
    image: food26,
    price: 2800,
    description: "Crispy chicken fillet with creamy sauce.",
    category: "Burgers",
  },
  {
    _id: "27",
    name: "Veggie Burger",
    image: food27,
    price: 2300,
    description: "Plant-based patty with fresh toppings.",
    category: "Burgers",
  },
  {
    _id: "28",
    name: "Grilled Cheese Sandwich",
    image: food28,
    price: 1800,
    description: "Golden toast stuffed with gooey melted cheese.",
    category: "Burgers",
  },


  // SNACKS
  {
    _id: "29",
    name: "French Fries",
    image: food29,
    price: 1200,
    description: "Crispy golden fries with salt and ketchup.",
    category: "Snacks",
  },
  {
    _id: "30",
    name: "Chicken Wings",
    image: food30,
    price: 2500,
    description: "Spicy, tender wings with dipping sauce.",
    category: "Snacks",
  },
  {
    _id: "31",
    name: "Onion Rings",
    image: food31,
    price: 1500,
    description: "Crispy battered onion slices.",
    category: "Snacks",
  },
  {
    _id: "32",
    name: "Mozzarella Sticks",
    image: food32,
    price: 2000,
    description: "Crunchy sticks filled with melted cheese.",
    category: "Snacks",
  },


  // WRAPS
  {
    _id: "33",
    name: "Chicken Shawarma",
    image: food33,
    price: 4000,
    description: "Chicken, veggies, and garlic sauce in a soft pita.",
    category: "Wraps",
  },
  {
    _id: "34",
    name: "Beef Shawarma",
    image: food34,
    price: 3200,
    description: "Savory beef strips wrapped with veggies and sauce.",
    category: "Wraps",
  },
  {
    _id: "35",
    name: "Falafel Wrap",
    image: food35,
    price: 1800,
    description: "Crispy chickpea falafel with hummus and salad.",
    category: "Wraps",
  },
  {
    _id: "36",
    name: "Veggie Wrap",
    image: food36,
    price: 1700,
    description: "Healthy grilled veggies in a soft wrap.",
    category: "Wraps",
  },


  // COOKIES
  {
    _id: "37",
    name: "Choc-Chip Cookie",
    image: food37,
    price: 500,
    description: "Classic cookie with gooey chocolate chips.",
    category: "Cookies",
  },
  {
    _id: "38",
    name: "Oat-Raisin Cookie",
    image: food38,
    price: 400,
    description: "Chewy oatmeal cookie with sweet raisins.",
    category: "Cookies",
  },
  {
    _id: "39",
    name: "Double Choc-Cookie",
    image: food39,
    price: 800,
    description: "Rich chocolate cookie with extra cocoa goodness.",
    category: "Cookies",
  },
  {
    _id: "40",
    name: "PB Cookie",
    image: food40,
    price: 500,
    description: "Nutty cookie with smooth peanut butter flavor.",
    category: "Cookies",
  },

  // DRINKS
  {
    _id: "41",
    name: "Smoothies",
    image: food41,
    price: 3500,
    description: "Blended fresh fruits for a creamy, healthy treat.",
    category: "Drinks",
  },
  {
    _id: "42",
    name: "Milkshake",
    image: food42,
    price: 2500,
    description: "Thick, sweet, and creamy milk-based drink",
    category: "Drinks",
  },
  {
    _id: "43",
    name: "Juice",
    image: food43,
    price: 1500,
    description: "Refreshing natural fruit juice, packed with flavor",
    category: "Drinks",
  },
  {
    _id: "44",
    name: "Soda",
    image: food44,
    price: 800,
    description: "Fizzy, sweet, and refreshing carbonated drink.",
    category: "Drinks",
  },
];
