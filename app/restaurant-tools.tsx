"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  calculateSubtotal,
  buildWhatsAppCheckoutUrl,
  dishes,
  filterDishes,
  formatMoney,
  menuCategories,
  normalizeSavedCart,
  updateCartQuantity,
  whatsAppCheckoutNumber,
  type Cart,
  type Fulfilment,
  type MenuCategory,
} from "./menu-data";

type Booking = { id: string; name: string; phone: string; date: string; time: string; guests: number; status: "Pending" };

export default function RestaurantTools({ mode = "all" }: { mode?: "all" | "menu" | "booking" }) {
  const [cart, setCart] = useState<Cart>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | MenuCategory>("All");
  const [fulfilment, setFulfilment] = useState<Fulfilment>("Pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [orderFeedback, setOrderFeedback] = useState("");
  const [ready, setReady] = useState(false);
  const [minimumBookingDate, setMinimumBookingDate] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("savory-cart");
        const savedBooking = localStorage.getItem("savory-booking");
        if (savedCart) setCart(normalizeSavedCart(JSON.parse(savedCart)));
        if (savedBooking) setBooking(JSON.parse(savedBooking));
      } catch { /* Ignore invalid browser storage and start a fresh session. */ }

      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
        .toISOString()
        .slice(0, 10);
      setMinimumBookingDate(localToday);
      setReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      localStorage.setItem("savory-cart", JSON.stringify(cart));
    } catch {
      // Keep ordering usable if browser storage is unavailable or full.
    }
  }, [cart, ready]);

  const filtered = useMemo(() => filterDishes(category, query), [category, query]);
  const categoryCounts = useMemo(() => Object.fromEntries(
    menuCategories.map((item) => [item, dishes.filter((dish) => dish.categories.includes(item)).length])
  ) as Record<MenuCategory, number>, []);
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const subtotal = calculateSubtotal(cart);
  const changeQuantity = (id: string, amount: number) => {
    setOrderFeedback("");
    setCart((current) => updateCartQuantity(current, id, amount));
  };
  const orderOnWhatsApp = () => {
    if (!count || (fulfilment === "Delivery" && !deliveryAddress.trim())) return;

    window.open(buildWhatsAppCheckoutUrl(cart, fulfilment, deliveryAddress), "_blank", "noopener,noreferrer");
    setOrderFeedback("Your order summary is prepared. If WhatsApp did not open, try checkout again. Press Send in WhatsApp to place the request.");
  };
  const submitBooking = (formData: FormData) => {
    const next: Booking = {
      id: `SB-${Date.now().toString().slice(-6)}`,
      name: String(formData.get("name")), phone: String(formData.get("phone")),
      date: String(formData.get("date")), time: String(formData.get("time")),
      guests: Number(formData.get("guests")), status: "Pending",
    };
    localStorage.setItem("savory-booking", JSON.stringify(next));
    setBooking(next);
    setBookingMessage(`Request ${next.id} saved as pending. We’ll confirm your table on WhatsApp.`);
    const message = `Hello Savory Bites, please confirm my table request (${next.id}): ${next.name}, ${next.guests} guests, ${next.date} at ${next.time}.`;
    window.open(`https://wa.me/${whatsAppCheckoutNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <>
    {mode !== "booking" && (
    <section className="menu-tools" aria-label="Menu ordering" aria-busy={!ready}>
      <div className="menu-controls">
        <label className="menu-search"><span aria-hidden="true">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the menu" aria-label="Search menu" /></label>
        <div className="category-filters" aria-label="Filter menu by category">
          <button type="button" className={category === "All" ? "filter-chip active" : "filter-chip"} aria-pressed={category === "All"} onClick={() => setCategory("All")}>All <span className="category-count">{dishes.length}</span></button>
          {menuCategories.map((item) => {
            const itemCount = categoryCounts[item];
            return <button type="button" className={category === item ? "filter-chip active" : "filter-chip"} key={item} aria-label={itemCount ? `${item}, ${itemCount} ${itemCount === 1 ? "dish" : "dishes"}` : `${item}, no dishes currently listed`} aria-pressed={category === item} disabled={!itemCount} onClick={() => setCategory(item)}>{item} <span className="category-count">{itemCount}</span></button>;
          })}
        </div>
      </div>
      <p className="menu-category-note">Fish, Kenyan Favourites and Drinks have no dishes listed yet.</p>
      {!ready && <p className="menu-loading" role="status"><span className="menu-spinner" aria-hidden="true" /> Restoring your saved order…</p>}
      <p className="sr-only" aria-live="polite">{filtered.length} {filtered.length === 1 ? "dish" : "dishes"} shown.</p>
      <div className="menu-grid">
        {filtered.map((dish, index) => <article className="menu-card" key={dish.id}>
          <div className="menu-image-wrap"><Image className="menu-image" src={dish.image} alt={dish.name} width={1000} height={700} sizes="(max-width: 650px) 88vw, (max-width: 900px) 43vw, 33vw" /><span className="menu-tag">{dish.tag}</span><span className="menu-index">0{index + 1}</span></div>
          <div className="menu-card-content">
            <div className="menu-title-row"><h3>{dish.name}</h3><strong className="price">{formatMoney(dish.price)}</strong></div>
            <p>{dish.description}</p>
            <div className="order-row">
              {cart[dish.id] ? <div className="quantity-control" role="group" aria-label={`${dish.name} quantity`}><button type="button" aria-label={`Remove one ${dish.name}`} onClick={() => changeQuantity(dish.id, -1)}>−</button><span aria-live="polite">{cart[dish.id]}</span><button type="button" aria-label={`Add one ${dish.name}`} onClick={() => changeQuantity(dish.id, 1)}>+</button></div> : <span className="dish-category">{dish.categories.join(" · ")}</span>}
              <button className="add-dish" type="button" disabled={!ready} onClick={() => changeQuantity(dish.id, 1)}>{!ready ? "Loading…" : cart[dish.id] ? "Add another" : "Add to order"} <span aria-hidden="true">＋</span></button>
            </div>
          </div>
        </article>)}
      </div>
      {!filtered.length && <p className="empty-state" role="status">No dishes match that search. Try another name or category.</p>}
      <button className="cart-launch" type="button" disabled={!ready} onClick={() => setShowCart((value) => !value)} aria-expanded={showCart} aria-controls="savory-cart-panel" aria-label={ready ? `${count} items in your order, subtotal ${formatMoney(subtotal)}. ${showCart ? "Close" : "Open"} order summary` : "Loading your saved order"}>{ready ? <>Your order <span>{count}</span> · {formatMoney(subtotal)} <b aria-hidden="true">{showCart ? "−" : "+"}</b></> : "Loading order…"}</button>
      {showCart && <div className="cart-panel" id="savory-cart-panel" role="region" aria-label="Order summary">
        <div className="cart-heading"><div><p className="eyebrow">READY WHEN YOU ARE</p><h3>Your order</h3></div><button type="button" aria-label="Close order summary" onClick={() => setShowCart(false)}>×</button></div>
        {!ready ? <p className="menu-loading" role="status"><span className="menu-spinner" aria-hidden="true" /> Restoring your saved order…</p> : !count ? <p className="empty-state cart-empty">Your basket is empty. Add something tasty from the menu.</p> : <>
          {dishes.filter((dish) => cart[dish.id]).map((dish) => <div className="cart-line" key={dish.id}>
            <div><strong>{dish.name}</strong><small>{formatMoney(dish.price)} each</small></div>
            <div className="quantity-control" role="group" aria-label={`${dish.name} quantity`}><button type="button" onClick={() => changeQuantity(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button><span aria-live="polite">{cart[dish.id]}</span><button type="button" onClick={() => changeQuantity(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button></div>
            <b>{formatMoney(dish.price * cart[dish.id])}</b>
          </div>)}
          <div className="fulfilment"><span>How would you like it?</span><div><button type="button" className={fulfilment === "Pickup" ? "filter-chip active" : "filter-chip"} aria-pressed={fulfilment === "Pickup"} onClick={() => { setFulfilment("Pickup"); setOrderFeedback(""); }}>Pickup</button><button type="button" className={fulfilment === "Delivery" ? "filter-chip active" : "filter-chip"} aria-pressed={fulfilment === "Delivery"} onClick={() => { setFulfilment("Delivery"); setOrderFeedback(""); }}>Delivery</button></div></div>
          {fulfilment === "Delivery" && <label className="delivery-address">Delivery address<input className="form-input" required value={deliveryAddress} onChange={(event) => { setDeliveryAddress(event.target.value); setOrderFeedback(""); }} placeholder="Enter your delivery address" autoComplete="street-address" /></label>}
          <div className="cart-total"><span>Subtotal</span><strong>{formatMoney(subtotal)}</strong></div>
          <button className="primary-button whatsapp-order" type="button" disabled={!count || (fulfilment === "Delivery" && !deliveryAddress.trim())} onClick={orderOnWhatsApp}>Place order on WhatsApp <span aria-hidden="true">↗</span></button>
          {orderFeedback ? <p className="order-feedback" role="status">{orderFeedback}</p> : <small className="cart-note">Review your order in WhatsApp and press Send to place the request. No delivery fee is included.</small>}
        </>}
      </div>}
    </section>
    )}

    {mode !== "menu" && (
    <section className="booking-section" id="reserve"><div className="booking-copy"><p className="eyebrow"><span className="eyebrow-line" /> SAVE YOUR SEAT</p><h2>Make it a<br /><em>table for you.</em></h2><p>Send a reservation request and we’ll confirm it with you on WhatsApp.</p>{booking && <div className="booking-status"><span className="status-dot"/><div><strong>{booking.status} · {booking.id}</strong><small>{booking.date} at {booking.time} · {booking.guests} guests</small></div></div>}</div>
      <form className="booking-form" action={submitBooking}><div className="form-row"><label>Your name<input className="form-input" name="name" required autoComplete="name" placeholder="Name for the booking" /></label><label>Phone number<input className="form-input" name="phone" required type="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" /></label></div><div className="form-row"><label>Date<input className="form-input" name="date" required type="date" min={minimumBookingDate || undefined} /></label><label>Time<select className="form-input" name="time" required defaultValue=""><option value="" disabled>Select a time</option>{Array.from({ length: 14 }, (_, index) => { const hour = index + 7; return <option key={hour} value={`${String(hour).padStart(2, "0")}:00`}>{hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 ${hour < 12 ? "AM" : "PM"}`}</option>; })}</select></label></div><label>Number of guests<select className="form-input" name="guests" defaultValue="2">{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "guest" : "guests"}</option>)}</select></label><button className="primary-button" type="submit">Request a table <span>↗</span></button>{bookingMessage && <p className="form-success" role="status">{bookingMessage}</p>}<small className="cart-note">Requests are saved in this browser and remain pending until the restaurant confirms.</small></form>
    </section>
    )}
  </>;
}
