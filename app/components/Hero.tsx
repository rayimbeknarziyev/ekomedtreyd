import React from "react";
import styles from "../style/Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.heroTitle}>QR bilan interaktiv kontent</h1>
      <p className={styles.heroText}>
        Admin o‘z matnini yoki rasmni yuklab QR yaratadi. Foydalanuvchi skaner
        qilsa, kontent ko‘rsatiladi.
      </p>
    </section>
  );
}
