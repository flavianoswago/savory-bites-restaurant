import WhatsAppShare from "./whatsapp-share";
import RestaurantTools from "./restaurant-tools";
import SiteFooter from "./site-footer";
import Image from "next/image";

const hours = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Home() {
  return (
    <main>
      <div className="topline"><span>KAKAMEGA TOWN, KENYA</span><span>GOOD FOOD, GOOD COMPANY</span><span>OPEN DAILY · 7AM—8PM</span></div>
      <header className="navbar">
        <a className="logo" href="#home" aria-label="Savory Bites home"><span className="logo-mark">S</span><span>Savory<span className="logo-accent">Bites</span><i>.</i></span></a>
        <nav className="nav-links" aria-label="Main navigation"><a href="#home">Home</a><a href="#about">Our Story</a><a href="#menu">The Menu</a><a href="#reserve">Reservations</a><a href="#contact">Visit Us</a></nav>
        <a className="nav-button" href="#menu">Place an order <span>↗</span></a>
      </header>

      <section className="hero" id="home">
        <div className="hero-content"><p className="eyebrow"><span className="eyebrow-line" /> A LITTLE TASTE OF HAPPINESS</p><h1>Good food.<br /><em>Great</em> moments.</h1><p className="hero-description">Come hungry, leave happy. Fresh ingredients, generous plates, and a warm seat waiting just for you.</p><div className="hero-actions"><a className="primary-button" href="#menu">Find your favourite <span>↗</span></a><a className="text-link" href="#about">Get to know us <span>↓</span></a></div><div className="rating"><span className="stars">★★★★★</span><span>Made fresh, served with love</span></div><div className="hero-note"><span>01</span> FRESH FROM OUR KITCHEN</div></div>
        <div className="hero-visual"><div className="hero-photo" role="img" aria-label="Freshly grilled chicken served with herbs" /><div className="photo-label"><span className="label-spark">✳</span><span>Fresh off<br />the grill</span></div><div className="hero-stamp"><span>COOKED WITH</span><strong>♥</strong><span>CARE, ALWAYS</span></div></div>
      </section>

      <section className="promise-strip" aria-label="Our promises"><div className="promise-intro">A good meal starts<br /><em>with the little things.</em></div><article className="promise"><span className="promise-icon">✳</span><div><h3>Fresh, always</h3><p>Good ingredients make<br />great food.</p></div></article><article className="promise"><span className="promise-icon">♨</span><div><h3>Made with heart</h3><p>Our kitchen puts care<br />into every plate.</p></div></article><article className="promise"><span className="promise-icon">♡</span><div><h3>Come as you are</h3><p>There’s always room<br />at our table.</p></div></article></section>

      <section className="menu-section" id="menu"><div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> FROM OUR KITCHEN</p><h2>A few <em>favourites.</em></h2></div><div className="heading-aside"><p>Made to be shared.<br />Hard to forget.</p></div></div><RestaurantTools /></section>

      <section className="about-section" id="about"><div className="about-image"><Image src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1300&q=85" alt="A warmly lit restaurant table ready for dinner" width={1300} height={1050} sizes="(max-width: 800px) 88vw, 55vw" /><span className="about-image-caption">A place to slow down & stay awhile</span></div><div className="about-content"><p className="eyebrow"><span className="eyebrow-line" /> A TABLE FOR EVERYONE</p><h2>More than<br />just <em>a meal.</em></h2><p>At Savory Bites, the best moments happen around the table. We bring honest cooking and a welcoming atmosphere together, so every visit feels a little like coming home.</p><a className="primary-button" href="#reserve">Book a table <span>↗</span></a><div className="about-signoff">Good food brings us together <span>— Savory Bites</span></div></div></section>

      <section className="visit-section" id="contact"><div className="visit-heading"><p className="eyebrow"><span className="eyebrow-line" /> COME FIND US</p><h2>Your neighbourhood<br /><em>table is waiting.</em></h2><p>Kakamega Town · P.O. Box 48654-597</p><div className="visit-actions"><a className="primary-button" href="https://www.google.com/maps/search/?api=1&query=Savory+Bites+Kakamega+Town" target="_blank" rel="noreferrer">Get directions <span>↗</span></a><a className="visit-phone" href="tel:+254112810217">Call +254 112 810 217</a></div></div><div className="hours-card"><div className="hours-card-heading"><span>OPENING HOURS</span><span>EVERY DAY</span></div>{hours.map((day) => <div className="hours-row" key={day}><span>{day}</span><strong>7:00 AM – 8:00 PM</strong></div>)}<a className="hours-map-link" href="https://www.google.com/maps/search/?api=1&query=Savory+Bites+Kakamega+Town" target="_blank" rel="noreferrer">View on Google Maps <span>↗</span></a></div></section>

      <section className="contact-section"><p className="eyebrow"><span className="eyebrow-line" /> YOUR SEAT IS WAITING</p><h2>Something good<br />is <em>on the table.</em></h2><p>Bring your people. We’ll take care of the rest.</p><WhatsAppShare /><span className="contact-detail">KAKAMEGA TOWN <i>·</i> OPEN EVERY DAY 7AM—8PM</span></section>

      <SiteFooter />
      <a className="floating-whatsapp" href="https://wa.me/254112810217?text=Hello%20Savory%20Bites!" target="_blank" rel="noreferrer" aria-label="Chat with Savory Bites on WhatsApp"><span>◉</span> WhatsApp</a>
    </main>
  );
}
