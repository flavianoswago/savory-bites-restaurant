"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const dishes = [
  { id: "chicken", name: "Grilled Chicken", description: "Herb-marinated chicken, kissed by the flame.", price: 850, category: "Mains", image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1000&q=85", tag: "HOUSE SPECIAL" },
  { id: "burger", name: "Classic Beef Burger", description: "A juicy favourite with all the good things.", price: 650, category: "Mains", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=85", tag: "GUEST FAVOURITE" },
  { id: "pizza", name: "Italian Pizza", description: "Slow-made dough, tomato, basil and mozzarella.", price: 1200, category: "Mains", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1000&q=85", tag: "OVEN FRESH" },
  { id: "salad", name: "Garden Salad", description: "Crisp seasonal greens with a bright house dressing.", price: 550, category: "Vegetarian", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=85", tag: "VEGETARIAN" },
];
type Cart = Record<string, number>;
type Booking = { id: string; name: string; phone: string; date: string; time: string; guests: number; status: "Pending" };
const money = (amount: number) => `KSh ${amount.toLocaleString("en-KE")}`;
const waNumber = "254112810217";

export default function RestaurantTools() {
  const [cart, setCart] = useState<Cart>({});
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [fulfilment, setFulfilment] = useState("Pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingMessage, setBookingMessage] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [ready, setReady] = useState(false);
  const [minimumBookingDate, setMinimumBookingDate] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const savedCart = localStorage.getItem("savory-cart");
        const savedBooking = localStorage.getItem("savory-booking");
        if (savedCart) setCart(JSON.parse(savedCart));
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
    if (ready) localStorage.setItem("savory-cart", JSON.stringify(cart));
  }, [cart, ready]);

  const filtered = useMemo(() => dishes.filter((dish) =>
    (category === "All" || dish.category === category) &&
    `${dish.name} ${dish.description}`.toLowerCase().includes(query.toLowerCase())
  ), [category, query]);
  const count = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const total = dishes.reduce((sum, dish) => sum + dish.price * (cart[dish.id] ?? 0), 0);
  const changeQuantity = (id: string, amount: number) => setCart((current) => {
    const next = { ...current, [id]: Math.max(0, (current[id] ?? 0) + amount) };
    if (!next[id]) delete next[id];
    return next;
  });
  const orderOnWhatsApp = () => {
    const lines = dishes.filter((dish) => cart[dish.id]).map((dish) => `${cart[dish.id]} × ${dish.name} — ${money(dish.price * cart[dish.id])}`);
    if (fulfilment === "Delivery" && !deliveryAddress.trim()) return;
    const text = `Hello Savory Bites! I’d like to place an order:\n${lines.join("\n")}\n\nTotal: ${money(total)}\n${fulfilment}${deliveryAddress ? ` to ${deliveryAddress}` : ""}. Please confirm availability and payment options.`;
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return <>
    <section className="menu-tools" aria-label="Menu ordering">
      <div className="menu-controls"><label className="menu-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find something delicious" aria-label="Search menu" /></label><div className="category-filters">{["All", "Mains", "Vegetarian"].map((item) => <button className={category === item ? "filter-chip active" : "filter-chip"} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
      <div className="menu-grid">{filtered.map((dish, index) => <article className="menu-card" key={dish.id}>
        <div className="menu-image-wrap"><Image className="menu-image" src={dish.image} alt={dish.name} width={1000} height={700} sizes="(max-width: 650px) 88vw, (max-width: 900px) 43vw, 33vw" /><span className="menu-tag">{dish.tag}</span><span className="menu-index">0{index + 1}</span></div>
        <div className="menu-card-content"><div className="menu-title-row"><h3>{dish.name}</h3><strong className="price">{money(dish.price)}</strong></div><p>{dish.description}</p><div className="order-row">{cart[dish.id] ? <div className="quantity-control"><button aria-label={`Remove one ${dish.name}`} onClick={() => changeQuantity(dish.id, -1)}>−</button><span>{cart[dish.id]}</span><button aria-label={`Add one ${dish.name}`} onClick={() => changeQuantity(dish.id, 1)}>+</button></div> : <span className="dish-category">{dish.category}</span>}<button className="add-dish" onClick={() => changeQuantity(dish.id, 1)}>{cart[dish.id] ? "Add another" : "Add to order"} <span>＋</span></button></div></div>
      </article>)}</div>
      {!filtered.length && <p className="empty-state">No dishes match that search. Try another name or category.</p>}
      <button className="cart-launch" onClick={() => setShowCart((value) => !value)} aria-expanded={showCart}>Your order <span>{count}</span> · {money(total)} <b>{showCart ? "−" : "+"}</b></button>
      {showCart && <div className="cart-panel"><div className="cart-heading"><div><p className="eyebrow">READY WHEN YOU ARE</p><h3>Your order</h3></div><button aria-label="Close cart" onClick={() => setShowCart(false)}>×</button></div>
        {!count ? <p className="empty-state">Your basket is empty. Add something tasty from the menu.</p> : <>{dishes.filter((dish) => cart[dish.id]).map((dish) => <div className="cart-line" key={dish.id}><div><strong>{dish.name}</strong><small>{money(dish.price)} each</small></div><div className="quantity-control"><button onClick={() => changeQuantity(dish.id, -1)} aria-label={`Remove one ${dish.name}`}>−</button><span>{cart[dish.id]}</span><button onClick={() => changeQuantity(dish.id, 1)} aria-label={`Add one ${dish.name}`}>+</button></div><b>{money(dish.price * cart[dish.id])}</b></div>)}
        <div className="fulfilment"><span>How would you like it?</span><div><button className={fulfilment === "Pickup" ? "filter-chip active" : "filter-chip"} onClick={() => setFulfilment("Pickup")}>Pickup</button><button className={fulfilment === "Delivery" ? "filter-chip active" : "filter-chip"} onClick={() => setFulfilment("Delivery")}>Delivery</button></div></div>
        {fulfilment === "Delivery" && <input className="form-input" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Delivery address in Kakamega" aria-label="Delivery address" />}
        <div className="cart-total"><span>Order total</span><strong>{money(total)}</strong></div><button className="primary-button whatsapp-order" disabled={!count || (fulfilment === "Delivery" && !deliveryAddress.trim())} onClick={orderOnWhatsApp}>Place order on WhatsApp <span>↗</span></button><small className="cart-note">Your order summary will open in WhatsApp for the restaurant to confirm.</small></>}
      </div>}
    </section>

    <section className="booking-section" id="reserve"><div className="booking-copy"><p className="eyebrow"><span className="eyebrow-line" /> SAVE YOUR SEAT</p><h2>Make it a<br /><em>table for you.</em></h2><p>Send a reservation request and we’ll confirm it with you on WhatsApp.</p>{booking && <div className="booking-status"><span className="status-dot"/><div><strong>{booking.status} · {booking.id}</strong><small>{booking.date} at {booking.time} · {booking.guests} guests</small></div></div>}</div>
      <form className="booking-form" action={submitBooking}><div className="form-row"><label>Your name<input className="form-input" name="name" required autoComplete="name" placeholder="Name for the booking" /></label><label>Phone number<input className="form-input" name="phone" required type="tel" autoComplete="tel" placeholder="e.g. 0712 345 678" /></label></div><div className="form-row"><label>Date<input className="form-input" name="date" required type="date" min={minimumBookingDate || undefined} /></label><label>Time<select className="form-input" name="time" required defaultValue=""><option value="" disabled>Select a time</option>{Array.from({ length: 14 }, (_, index) => { const hour = index + 7; return <option key={hour} value={`${String(hour).padStart(2, "0")}:00`}>{hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 ${hour < 12 ? "AM" : "PM"}`}</option>; })}</select></label></div><label>Number of guests<select className="form-input" name="guests" defaultValue="2">{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} {index === 0 ? "guest" : "guests"}</option>)}</select></label><button className="primary-button" type="submit">Request a table <span>↗</span></button>{bookingMessage && <p className="form-success" role="status">{bookingMessage}</p>}<small className="cart-note">Requests are saved in this browser and remain pending until the restaurant confirms.</small></form>
    </section>
  </>;
}
