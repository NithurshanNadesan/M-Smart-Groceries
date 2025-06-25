import p1_img from "./banana flower.jpg";
import p2_img from "./anchor basmathi.jpg";
import p3_img from "./coconut.jpg";
import p4_img from "./red dhal.jpg";
import p5_img from "./garlic.jpg";
import p6_img from "./knor mix.jpg";
import p7_img from "./papaya.jpg";
import p8_img from "./pasta.jpg";
import p9_img from "./pumpkin.jpg";
import p10_img from "./soya.jpg";
import p11_img from "./sour plantain.jpg";
import p12_img from "./water melon.jpg";

import p13_img from "./pepsi.JPG";
import p14_img from "./casava chips.jpeg";
import p15_img from "./Redbull.jpeg";
import p16_img from "./mixture.png";
import p17_img from "./Kist Ride.JPG";
import p18_img from "./onion bite.jpeg";
import p19_img from "./Water.jpeg";
import p20_img from "./jambo peanut.png";
import p21_img from "./Milo.jpeg";
import p22_img from "./chip cookie biscuit.jpeg";
import p23_img from "./Milk-Chocolate-Drink.jpg";
import p24_img from "./revello chocalate.jpg";

import p25_img from "./product_25.png";
import p26_img from "./product_26.png";
import p27_img from "./product_27.png";
import p28_img from "./product_28.png";
import p29_img from "./product_29.png";
import p30_img from "./product_30.png";
import p31_img from "./product_31.png";
import p32_img from "./product_32.png";
import p33_img from "./product_33.png";
import p34_img from "./product_34.png";
import p35_img from "./product_35.png";
import p36_img from "./product_36.png";

import p37_img from "./product_25.png";
import p38_img from "./product_26.png";
import p39_img from "./product_27.png";
import p40_img from "./product_28.png";
import p41_img from "./product_29.png";
import p42_img from "./product_30.png";
import p43_img from "./product_31.png";
import p44_img from "./product_32.png";
import p45_img from "./product_33.png";
import p46_img from "./product_34.png";
import p47_img from "./product_35.png";
import p48_img from "./product_36.png";

import p111_img from './capsicum.jpeg'
import p222_img from './big_onion.jpeg'
import p333_img from './banana.jpeg'
import p444_img from './tomato.jpeg'


let all_product = [
  {
    id: 1,
    name: "Banana Flower",
    variant: "500g",
    category: "fresh items",
    image: p1_img,
    new_price: 200.0,
    old_price: 220.0,
  },
  {
    id: 2,
    name: "Basmathi Rice",
    variant: "5Kg",
    category: "pantry staples",
    image: p2_img,
    new_price: 3000.0,
    old_price: 2800.0,
  },
  {
    id: 3,
    name: "Coconut",
    variant: "1Pc",
    category: "fresh items",
    image: p3_img,
    new_price: 200.0,
    old_price: 170.0,
  },
  {
    id: 4,
    name: "Red Dhal",
    variant: "1kg",
    category: "pantry staples",
    image: p4_img,
    new_price: 320.0,
    old_price: 280.0,
  },
  {
    id: 5,
    name: "Garlic",
    variant: "250g",
    category: "fresh items",
    image: p5_img,
    new_price: 160.0,
    old_price: 170.0,
  },
  {
    id: 6,
    name: "Knor Mix",
    variant: "20g",
    category: "pantry staples",
    image: p6_img,
    new_price: 180.0,
    old_price: 200.0,
  },
  {
    id: 7,
    name: "Papaya",
    variant: "500g",
    category: "fresh items",
    image: p7_img,
    new_price: 185.0,
    old_price: 215.0,
  },
  {
    id: 8,
    name: "Pasta",
    variant: "400g",
    category: "pantry staples",
    image: p8_img,
    new_price: 360.0,
    old_price: 385.0,
  },
  {
    id: 9,
    name: "Pumpkin",
    variant: "500g",
    category: "fresh items",
    image: p9_img,
    new_price: 70.0,
    old_price: 100.0,
  },
  {
    id: 10,
    name: "Soya Meat",
    variant: "90g",
    category: "pantry staples",
    image: p10_img,
    new_price: 140.0,
    old_price: 160.0,
  },
  {
    id: 11,
    name: "Banana (Rubber)",
    variant: "500g",
    category: "fresh items",
    image: p11_img,
    new_price: 100.0,
    old_price: 90.0,
  },
  {
    id: 12,
    name: "Watermelon",
    variant: "500g",
    category: "fresh items",
    image: p12_img,
    new_price: 80.0,
    old_price: 120.0,
  },
  {
    id:111,
    name:"Capsicum",
    variant:"250g",
    image:p111_img,
    new_price:140.00,
    old_price:200.00,
  },
  {id:222,
    name:"Big Onion (India)",
    variant:"500g",
    image:p222_img,
    new_price:160.00,
    old_price:180.00,
  },
  {id:333,
    name:"Banana (Seeni)",
    variant:"1Kg",
    image:p333_img,
    new_price:200.00,
    old_price:250.00,
  },
  {id:444,
    name:"Tomato",
    variant:"250g",
    image:p444_img,
    new_price:80.00,
    old_price:95.00,
  },
  {
    id: 13,
    name: "Pepsi Soda",
    variant: "1.5L",
    category: "beverage",
    image: p13_img,
    new_price: 400.0,
    old_price: 420.0,
  },
  {
    id: 14,
    name: "Casava Chips (Hot & Spicy)",
    variant: "100g",
    category: "snacks",
    image: p14_img,
    new_price: 180.0,
    old_price: 200.0,
  },
  {
    id: 15,
    name: "Redbull Energy Drink",
    variant: "250ml",
    category: "beverage",
    image: p15_img,
    new_price: 800.0,
    old_price: 900.0,
  },
  {
    id: 16,
    name: "Coaktail Mixture",
    variant: "100g",
    category: "snacks",
    image: p16_img,
    new_price: 120.0,
    old_price: 150.0,
  },
  {
    id: 17,
    name: "Kist Ride (Red Berry)",
    variant: "250ml",
    category: "beverage",
    image: p17_img,
    new_price: 400.0,
    old_price: 450.0,
  },
  {
    id: 18,
    name: "Cheesy Onion Bite",
    variant: "100g",
    category: "snacks",
    image: p18_img,
    new_price: 300.0,
    old_price: 360.0,
  },
  {
    id: 19,
    name: "Aquafina Drinking Water",
    variant: "500ml",
    category: "beverage",
    image: p19_img,
    new_price: 90.0,
    old_price: 100.0,
  },
  {
    id: 20,
    name: "Jambo Peanut (Hot & Spicy)",
    variant: "70g",
    category: "snacks",
    image: p20_img,
    new_price: 220.0,
    old_price: 250.0,
  },
  {
    id: 21,
    name: "Milo Drink Pack",
    variant: "180ml",
    category: "beverage",
    image: p21_img,
    new_price: 130.0,
    old_price: 150.0,
  },
  {
    id: 22,
    name: "Chocalate Chip Cookie",
    variant: "100g",
    category: "snacks",
    image: p22_img,
    new_price: 200.0,
    old_price: 250.0,
  },
  {
    id: 23,
    name: "Milk Chocalate Drink",
    variant: "190ml",
    category: "beverage",
    image: p23_img,
    new_price: 200.0,
    old_price: 250.0,
  },
  {
    id: 24,
    name: "Revello Chocalate (Crispies)",
    variant: "50g",
    category: "snacks",
    image: p24_img,
    new_price: 220.0,
    old_price: 260.0,
  },
  {
    id: 25,
    name: "mmmmm",
    category: "personalAndChild",
    image: p25_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 26,
    name: "mmmmm",
    category: "personalAndChild",
    image: p26_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 27,
    name: "mmmmm",
    category: "personalAndChild",
    image: p27_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 28,
    name: "mmmmm",
    category: "personalAndChild",
    image: p28_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 29,
    name: "mmmmm",
    category: "personalAndChild",
    image: p29_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 30,
    name: "mmmmm",
    category: "personalAndChild",
    image: p30_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 31,
    name: "mmmmm",
    category: "personalAndChild",
    image: p31_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 32,
    name: "mmmmm",
    category: "personalAndChild",
    image: p32_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 33,
    name: "mmmmm",
    category: "personalAndChild",
    image: p33_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 34,
    name: "mmmmm",
    category: "personalAndChild",
    image: p34_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 35,
    name: "mmmmm",
    category: "personalAndChild",
    image: p35_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 36,
    name: "mmmmm",
    category: "personalAndChild",
    image: p36_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 37,
    name: "mmmmm",
    category: "household",
    image: p37_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 38,
    name: "mmmmm",
    category: "household",
    image: p38_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 39,
    name: "mmmmm",
    category: "household",
    image: p39_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 40,
    name: "mmmmm",
    category: "household",
    image: p40_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 41,
    name: "mmmmm",
    category: "household",
    image: p41_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 42,
    name: "mmmmm",
    category: "household",
    image: p42_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 43,
    name: "mmmmm",
    category: "household",
    image: p43_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 44,
    name: "mmmmm",
    category: "household",
    image: p44_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 45,
    name: "mmmmm",
    category: "household",
    image: p45_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 46,
    name: "mmmmm",
    category: "household",
    image: p46_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 47,
    name: "mmmmm",
    category: "household",
    image: p47_img,
    new_price: 85.0,
    old_price: 120.5,
  },
  {
    id: 48,
    name: "mmmmm",
    category: "household",
    image: p48_img,
    new_price: 85.0,
    old_price: 120.5,
  }
];

export default all_product;
