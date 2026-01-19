import React from "react";
import styles from "../style/About.module.css";

export default function AboutPage() {
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Eko Med Treyd Haqida</h1>
        <p>
          Eko Med Treyd — tibbiy uskunalar va med texnika yo‘nalishida faoliyat
          yurituvchi zamonaviy kompaniya. Biz sifatli mahsulotlar va ishonchli
          yechimlar orqali sog‘liqni saqlash sohasiga hissa qo‘shamiz.
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3 className={styles.title}>Dorixona Xodimlari Uchun Kurslar</h3>
          <p>
            Eko Med Treyd tomonidan tashkil etiladigan o‘quv kurslari dorixona
            xodimlarining kasbiy malakasini oshirishga qaratilgan. Kurslar
            davomida dori vositalarini to‘g‘ri saqlash va tavsiya qilish,
            mijozlar bilan professional muloqot olib borish hamda farmatsevtika
            sohasidagi yangiliklardan xabardor bo‘lish bo‘yicha amaliy va
            nazariy bilimlar beriladi.
          </p>
        </div>

        <div className={styles.feature}>
          <h3 className={styles.title}>Ishonchlilik va Sifat</h3>
          <p>
            Eko Med Treyd kurslarida barcha darslar amaliy va nazariy jihatdan
            sifatli taʼlim berishga moʻljallangan. Dorixona xodimlari zamonaviy
            farmatsevtika standartlariga mos bilim va ko‘nikmalarni egallaydi.
            Har bir kurs qatnashchisi professional va ishonchli xizmat
            ko‘rsatishga tayyor bo‘ladi.
          </p>
        </div>

        <div className={styles.feature}>
          <h3>Tezkor Xizmat va Amaliyot</h3>
          <p>
            Kurslar davomida dorixona xodimlari amaliy mashg‘ulotlar orqali
            bilimlarini mustahkamlaydi va real ish jarayoniga tez moslashadi.
            Eko Med Treyd qatnashchilarga tezkor, samarali va amaliy tajriba
            berishni ustuvor maqsad qiladi.
          </p>
        </div>
      </div>


      <div className={styles.contactInfo}>
        <h2>Bog‘lanish</h2>
        <p>
          Agar sizda savollar bo‘lsa yoki hamkorlik qilishni istasangiz, biz
          bilan bog‘laning:
        </p>
        <ul className={styles.contactList}>
          <li>✉️ Email: info@ekomedtreyd.uz</li>
          <li>📱 Telefon / Telegram: @ekomedtreyd</li>
          <li>🌐 Veb-sayt: www.ekomedtreyd.uz</li>
        </ul>
      </div>
    </main>
  );
}
