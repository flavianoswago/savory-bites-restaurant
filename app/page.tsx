import Image from "next/image";
import RestaurantTools from "./restaurant-tools";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";
import WhatsAppShare from "./whatsapp-share";

const openingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="hero" id="home" aria-labelledby="hero-title">
        <div className="hero-content">
          <p className="eyebrow"><span className="eyebrow-line" /> GOOD FOOD, GOOD COMPANY</p>
          <h1 id="hero-title">Good food.<br /><em>Great moments.</em></h1>
          <p className="hero-description">
            Come hungry, leave happy. Fresh ingredients, generous plates, and a warm seat waiting just for you.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#menu">Explore the menu <span aria-hidden="true">↗</span></a>
            <a className="text-link" href="#about">Our story <span aria-hidden="true">↓</span></a>
          </div>
          <p className="hero-note"><span>01</span> PREPARED WITH CARE IN KAKAMEGA</p>
        </div>

        <div className="hero-visual">
          <Image
            className="hero-photo"
            src="/images/food/hero-grilled-meal.jpg"
            alt="A generous restaurant platter with grilled chicken, fresh salad, fries and sides"
            fill
            priority
            sizes="(max-width: 760px) 100vw, 54vw"
          />
          <div className="hero-photo-caption"><span>FROM OUR KITCHEN</span><span>Freshly grilled · Made with care</span></div>
        </div>
      </section>

      <section className="promise-strip" aria-label="The Savory Bites difference">
        <p className="promise-intro">A good meal begins<br /><em>with the little things.</em></p>
        <article className="promise"><span className="promise-icon" aria-hidden="true">✳</span><div><h2>Fresh ingredients</h2><p>Carefully selected for every dish.</p></div></article>
        <article className="promise"><span className="promise-icon" aria-hidden="true">♨</span><div><h2>Thoughtful cooking</h2><p>Prepared with attention and care.</p></div></article>
        <article className="promise"><span className="promise-icon" aria-hidden="true">♡</span><div><h2>A warm welcome</h2><p>There’s a place for you at our table.</p></div></article>
      </section>

      <section className="menu-section" id="menu" aria-labelledby="menu-title">
        <div className="section-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> MADE HERE, SHARED HERE</p><h2 id="menu-title">A few <em>favourites.</em></h2></div>
          <p className="heading-aside">Good things from our kitchen,<br />ready for your table.</p>
        </div>
        <RestaurantTools mode="menu" />
      </section>

      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-image">
          <Image
            src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1300&q=85"
            alt="A warmly lit restaurant table ready for dinner"
            width={1300}
            height={1050}
            sizes="(max-width: 800px) 88vw, 55vw"
          />
          <span className="about-image-caption">A place to slow down and stay awhile</span>
        </div>
        <div className="about-content">
          <p className="eyebrow"><span className="eyebrow-line" /> A TABLE FOR EVERYONE</p>
          <h2 id="about-title">More than<br />just <em>a meal.</em></h2>
          <p>At Savory Bites, the best moments happen around the table. We bring honest cooking and a welcoming atmosphere together, so every visit feels a little like coming home.</p>
          <a className="primary-button" href="#reserve">Save your seat <span aria-hidden="true">↗</span></a>
          <p className="about-signoff">Good food brings us together <span>— Savory Bites</span></p>
        </div>
      </section>

      <RestaurantTools mode="booking" />

      <section className="visit-section" id="contact" aria-labelledby="visit-title">
        <div className="visit-heading">
          <p className="eyebrow"><span className="eyebrow-line" /> YOUR NEIGHBOURHOOD TABLE</p>
          <h2 id="visit-title">Come hungry.<br /><em>Leave happy.</em></h2>
          <p>Kakamega Town<br />P.O. Box 48654-597</p>
          <div className="visit-actions">
            <a className="primary-button" href="https://www.google.com/maps/search/?api=1&query=Savory+Bites+Kakamega+Town" target="_blank" rel="noreferrer">Get directions <span aria-hidden="true">↗</span></a>
            <a className="visit-phone" href="tel:+254112810217">Call +254 112 810 217</a>
          </div>
        </div>
        <div className="hours-card">
          <div className="hours-card-heading"><span>OPENING HOURS</span><span>EVERY DAY</span></div>
          {openingDays.map((day) => <div className="hours-row" key={day}><span>{day}</span><strong>7:00 AM – 8:00 PM</strong></div>)}
          <a className="hours-map-link" href="https://www.google.com/maps/search/?api=1&query=Savory+Bites+Kakamega+Town" target="_blank" rel="noreferrer">View on Google Maps <span aria-hidden="true">↗</span></a>
        </div>
      </section>

      <section className="contact-section" aria-labelledby="contact-title">
        <p className="eyebrow"><span className="eyebrow-line" /> YOUR SEAT IS WAITING</p>
        <h2 id="contact-title">Something good<br />is <em>on the table.</em></h2>
        <p>Bring your people. We’ll take care of the rest.</p>
        <WhatsAppShare />
        <span className="contact-detail">KAKAMEGA TOWN <i>·</i> OPEN EVERY DAY 7AM–8PM</span>
      </section>

      <SiteFooter />
      <a className="floating-whatsapp" href="https://wa.me/254112810217?text=Hello%20Savory%20Bites!" target="_blank" rel="noreferrer" aria-label="Chat with Savory Bites on WhatsApp"><span aria-hidden="true">◉</span> WhatsApp</a>
    </main>
  );
}
