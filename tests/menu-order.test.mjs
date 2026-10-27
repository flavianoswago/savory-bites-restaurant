import assert from "node:assert/strict";
import test from "node:test";
import {
  buildWhatsAppCheckoutUrl,
  buildWhatsAppOrderMessage,
  calculateSubtotal,
  filterDishes,
  updateCartQuantity,
} from "../app/menu-data.ts";

test("category filters only show dishes assigned to the selected category", () => {
  assert.deepEqual(filterDishes("Chicken", "").map((dish) => dish.id), ["chicken"]);
  assert.deepEqual(filterDishes("Beef", "").map((dish) => dish.id), ["burger"]);
  assert.deepEqual(filterDishes("Fast Food", "").map((dish) => dish.id), ["burger", "pizza"]);
  assert.deepEqual(filterDishes("Fish", ""), []);
  assert.deepEqual(filterDishes("All", "PIZZA").map((dish) => dish.id), ["pizza"]);
});

test("quantity controls add, decrement, and remove items without negative quantities", () => {
  let cart = {};
  cart = updateCartQuantity(cart, "chicken", 2);
  cart = updateCartQuantity(cart, "burger", 1);
  assert.deepEqual(cart, { chicken: 2, burger: 1 });
  cart = updateCartQuantity(cart, "chicken", -1);
  assert.equal(cart.chicken, 1);
  cart = updateCartQuantity(cart, "burger", -1);
  cart = updateCartQuantity(cart, "burger", -1);
  assert.equal(cart.burger, undefined);
  assert.equal(cart.chicken, 1);
});

test("subtotal uses the existing dish prices and current quantities", () => {
  assert.equal(calculateSubtotal({ chicken: 2, burger: 1, pizza: 1 }), 3550);
});

test("WhatsApp checkout includes items, quantities, unit prices, subtotal, fulfilment, and verified number", () => {
  const cart = { chicken: 1, pizza: 1 };
  const message = buildWhatsAppOrderMessage(cart, "Delivery", "48654-597 Kakamega");
  const url = buildWhatsAppCheckoutUrl(cart, "Delivery", "48654-597 Kakamega");
  const decodedMessage = decodeURIComponent(url.split("?text=")[1]);

  assert.match(message, /1 x Grilled Chicken — KSh 850 each \(KSh 850\)/);
  assert.match(message, /1 x Italian Pizza — KSh 1,200 each \(KSh 1,200\)/);
  assert.match(message, /Subtotal: KSh 2,050/);
  assert.match(message, /Delivery address: 48654-597 Kakamega/);
  assert.ok(url.startsWith("https://wa.me/254112810217?text="));
  assert.equal(decodedMessage, message);
});
