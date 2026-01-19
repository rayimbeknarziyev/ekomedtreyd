import React from "react";
import Link from "next/link"; // ✅ Link import
import styles from "../style/Footer.module.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Eko Med Treyd</h3>
            <p className={styles.footerDescription}>
              Eko Med Treyd — tibbiy uskunalar va med texnika bo‘yicha ishonchli
              hamkor. Sifatli mahsulotlar va xizmatlar bilan dorixona xodimlari
              va tibbiyot muassasalarini qo‘llab-quvvatlaymiz.
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Tez Havolalar</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/">Bosh Sahifa</Link>
              </li>
              <li>
                <Link href="/about">Haqida</Link>
              </li>
              <li>
                <Link href="/contact">Aloqa</Link>
              </li>
              <li>
                <Link href="/courses">Kurslar</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.sectionTitle}>Aloqa</h4>
            <ul className={styles.contactInfo}>
              <li>
                <a href="mailto:info@ekomedtreyd.uz">✉️ info@ekomedtreyd.uz</a>
              </li>
              <li>
                <a
                  href="https://t.me/ekomedtreyd"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📱 Telegram
                </a>
              </li>
              <li>
                <a
                  href="https://www.ekomedtreyd.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🌐 Sayt
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {currentYear} Eko Med Treyd. Barcha huquqlar himoyalangan.</p>
          <p className={styles.madeBy}>Made with ❤️ by Eko Med Treyd Team</p>
        </div>
      </div>
    </footer>
  );
}
