"use client";

import React from "react";
import styles from "./style/MainContent.module.css";

type Props = {
  type: "text" | "image" | null;
  contentText?: string | null;
  imageUrl?: string | null;
};

export default function MainContent({ type, contentText, imageUrl }: Props) {
  console.log("MainContent render:", { type, contentText, imageUrl });

  if (!type) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>📭 Maʼlumot mavjud emas</h2>
          <p>Hozircha ushbu QR kod uchun Eko Med Treyd kontenti mavjud emas.</p>
          <p>Maʼlumotni admin panel orqali qo‘shishingiz mumkin.</p>
        </div>
      </div>
    );
  }

  if (type === "text") {
    return (
      <div className={styles.container}>
        <div className={styles.contentCard}>
          <h2 className={styles.title}>📝 Eko Med Treyd maʼlumoti</h2>
          <div className={styles.textContent}>
            {contentText ||
              "Eko Med Treyd — tibbiy uskunalar va med texnika bo‘yicha ishonchli hamkoringiz."}
          </div>
          <div className={styles.metaInfo}>
            <span className={styles.metaBadge}>Text QR</span>
            <span className={styles.metaDate}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className={styles.container}>
        <div className={styles.contentCard}>
          <h2 className={styles.title}>🖼️ Eko Med Treyd rasmi</h2>
          <div className={styles.imageContainer}>
            {imageUrl ? (
              <>
                <img
                  src={imageUrl}
                  alt="Eko Med Treyd QR orqali ulangan rasm"
                  className={styles.image}
                  onError={(e) => {
                    console.error("Image failed to load:", imageUrl);
                    e.currentTarget.src = "/api/placeholder/400/300";
                  }}
                />
                <div className={styles.imageOverlay}>
                  <p>Eko Med Treyd tomonidan taqdim etilgan rasm</p>
                </div>
              </>
            ) : (
              <div className={styles.noImage}>
                <p>❌ Rasm yuklanmadi</p>
                <p>
                  Rasm manzili noto‘g‘ri yoki Eko Med Treyd tomonidan
                  o‘chirilgan bo‘lishi mumkin
                </p>
              </div>
            )}
          </div>
          <div className={styles.metaInfo}>
            <span className={`${styles.metaBadge} ${styles.imageBadge}`}>
              Image QR
            </span>
            <span className={styles.metaDate}>
              {new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
