export type MenuCategory = "Chicken" | "Fish" | "Kenyan Favourites" | "Beef" | "Fast Food" | "Drinks";

export type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  categories: MenuCategory[];
  image: string;
  tag: string;
};

export type Cart = Record<string, number>;
export type Fulfilment = "Pickup" | "Delivery";
export const whatsAppCheckoutNumber = "254112810217";

export const menuCategories: MenuCategory[] = [
  "Chicken",
  "Fish",
  "Kenyan Favourites",
  "Beef",
  "Fast Food",
  "Drinks",
];

export const dishes: Dish[] = [
  {
    id: "chicken",
    name: "Grilled Chicken",
    description: "Herb-marinated chicken grilled to perfection.",
    price: 850,
    categories: ["Chicken"],
    image: "/images/food/grilled-chicken.jpg",
    tag: "CHEF'S CHOICE",
  },
  {
    id: "burger",
    name: "Classic Beef Burger",
    description: "Juicy beef, melted cheese and fresh vegetables.",
    price: 650,
    categories: ["Beef", "Fast Food"],
    image: "/images/food/classic-beef-burger.jpg",
    tag: "CUSTOMER FAVOURITE",
  },
  {
    id: "pizza",
    name: "Italian Pizza",
    description: "Golden crust, rich tomato sauce and mozzarella.",
    price: 1200,
    categories: ["Fast Food"],
    image: "/images/food/italian-pizza.jpg",
    tag: "FRESHLY BAKED",
  },
];

export const formatMoney = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;

export function filterDishes(category: "All" | MenuCategory, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase();

  return dishes.filter((dish) =>
    (category === "All" || dish.categories.includes(category)) &&
    `${dish.name} ${dish.description}`.toLocaleLowerCase().includes(normalizedQuery)
  );
}

export function updateCartQuantity(cart: Cart, id: string, amount: number): Cart {
  const nextQuantity = Math.max(0, (cart[id] ?? 0) + amount);
  const next = { ...cart };

  if (nextQuantity === 0) delete next[id];
  else next[id] = nextQuantity;

  return next;
}

export function normalizeSavedCart(value: unknown): Cart {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};

  return Object.fromEntries(
    Object.entries(value)
      .filter(([id, quantity]) =>
        dishes.some((dish) => dish.id === id) &&
        Number.isSafeInteger(quantity) &&
        Number(quantity) > 0
      )
      .map(([id, quantity]) => [id, Number(quantity)])
  );
}

export function calculateSubtotal(cart: Cart) {
  return dishes.reduce((subtotal, dish) => subtotal + dish.price * (cart[dish.id] ?? 0), 0);
}

export function buildWhatsAppOrderMessage(cart: Cart, fulfilment: Fulfilment, deliveryAddress = "") {
  const selectedDishes = dishes.filter((dish) => (cart[dish.id] ?? 0) > 0);
  const subtotal = calculateSubtotal(cart);
  const lines = selectedDishes.map((dish) => {
    const quantity = cart[dish.id];
    return `${quantity} x ${dish.name} — ${formatMoney(dish.price)} each (${formatMoney(dish.price * quantity)})`;
  });
  const delivery = fulfilment === "Delivery" && deliveryAddress.trim()
    ? `Delivery address: ${deliveryAddress.trim()}`
    : fulfilment;

  return [
    "Hello Savory Bites! I would like to place an order:",
    ...lines,
    "",
    `Subtotal: ${formatMoney(subtotal)}`,
    delivery,
    "Please confirm availability and payment options.",
  ].join("\n");
}

export function buildWhatsAppCheckoutUrl(cart: Cart, fulfilment: Fulfilment, deliveryAddress = "") {
  const message = buildWhatsAppOrderMessage(cart, fulfilment, deliveryAddress);
  return `https://wa.me/${whatsAppCheckoutNumber}?text=${encodeURIComponent(message)}`;
}
