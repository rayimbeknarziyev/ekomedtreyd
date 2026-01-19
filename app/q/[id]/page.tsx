"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import MainContent from "../../page";
import styles from "../../style/QrPage.module.css"; 

export default function QPage() {
  const params = useParams();
  const id = params?.id as string | undefined;

  const [loading, setLoading] = useState(true);
  const [type, setType] = useState<"text" | "image" | null>(null);
  const [contentText, setContentText] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("QR kod ID si topilmadi");
      setLoading(false);
      return;
    }

    console.log("Loading QR with ID:", id);

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching from qr_codes table...");

        // Avval jadvaldan ma'lumot olish
        const { data, error: dbError } = await supabase
          .from("qr_codes")
          .select("*")
          .eq("id", id)
          .single();

        console.log("Database response:", { data, error: dbError });

        if (dbError) {
          console.error("Database error details:", {
            code: dbError.code,
            message: dbError.message,
            details: dbError.details,
            hint: dbError.hint,
          });

          if (dbError.code === "PGRST116") {
            setError(`Bu ID bilan QR kod topilmadi: ${id}`);
          } else if (dbError.code === "42501") {
            setError(
              "RLS (Row Level Security) muammosi. Jadvalga o'qish ruxsati yo'q."
            );
          } else {
            setError(`Ma'lumotlar bazasi xatosi: ${dbError.message}`);
          }

          setType(null);
          return;
        }

        if (cancelled) return;

        const rec = data;

        if (!rec) {
          console.log("No record found for ID:", id);
          setError(`Bu QR kod mavjud emas yoki o'chirilgan: ${id}`);
          setType(null);
          return;
        }

        console.log("Found record:", rec);

        if (rec.type === "text") {
          setType("text");
          setContentText(rec.content_text || "Kontent yo'q");
          console.log("Text content:", rec.content_text);
        } else if (rec.type === "image") {
          setType("image");
          if (rec.image_path) {
            console.log("Image path:", rec.image_path);
            // Storage'dan public URL olish
            const { data: urlData } = supabase.storage
              .from("qr-images")
              .getPublicUrl(rec.image_path);

            console.log("Public URL data:", urlData);
            setImageUrl(urlData.publicUrl);

            // URL ni test qilish
            if (urlData.publicUrl) {
              const img = new Image();
              img.onload = () => console.log("Image loaded successfully");
              img.onerror = () =>
                console.error("Image failed to load:", urlData.publicUrl);
              img.src = urlData.publicUrl;
            }
          } else {
            setError("Rasm yo'li topilmadi");
          }
        } else {
          setError(`Noma'lum QR turi: ${rec.type}`);
          setType(null);
        }
      } catch (err: any) {
        console.error("Unexpected error:", err);
        setError(`Kutilmagan xatolik: ${err.message}`);
        setType(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
          console.log("Loading finished. State:", {
            type,
            contentText,
            imageUrl,
            error,
          });
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Debug uchun komponent har safar render bo'lganda log qilish
  console.log("Component render:", {
    id,
    loading,
    type,
    contentText,
    imageUrl,
    error,
  });

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>QR kod kontenti yuklanmoqda...</p>
          <p className={styles.debugInfo}>ID: {id}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h3>❌ Xatolik</h3>
          <p>{error}</p>
          <p className={styles.debugInfo}>QR ID: {id}</p>
          <button
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Yangilash
          </button>
        </div>
      </div>
    );
  }

  if (!type) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h3>📭 Kontent topilmadi</h3>
          <p>Bu QR kod uchun hech qanday kontent topilmadi.</p>
          <p>Admin panel orqali yangi kontent qoshishingiz mumkin.</p>
        </div>
      </div>
    );
  }

  return (
    <MainContent
      type={type}
      contentText={contentText ?? undefined}
      imageUrl={imageUrl ?? undefined}
    />
  );
}
