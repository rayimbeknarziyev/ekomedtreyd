import React from "react";
import styles from "../style/Contact.module.css";

export default function ContactPage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1>📬 Biz bilan boglaning</h1>
        <p>
          Eko Med Treyd dorixona xodimlari va tibbiyot muassasalari uchun
          ishonchli xizmat ko‘rsatadi. Savol yoki takliflaringiz bo‘lsa, biz
          bilan bog‘laning.
        </p>
      </section>

      <section className={styles.contactInfo}>
        <h2>Bizning aloqa malumotlarimiz</h2>
        <ul>
          <li>
            ✉️ Telefon:{" "}
            <a>+998 99 310 55 35</a>
          </li>
          <li>
            📱 Telegram:{" "}
            <a
              href="https://t.me/ekomedtreyd"
              target="_blank"
              rel="noopener noreferrer"
            >
              @ekomedtreyd
            </a>
          </li>
          <li>🏢 Manzil: Toshkent, O‘zbekiston</li>
          <li>
            🌐 Sayt:{" "}
            <a
              href="https://www.ekomedtreyd.uz"
              target="_blank"
              rel="noopener noreferrer"
            >
              www.ekomedtreyd.uz
            </a>
          </li>
        </ul>
      </section>
    </main>
  );
}
