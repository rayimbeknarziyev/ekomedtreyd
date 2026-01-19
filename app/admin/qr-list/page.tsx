"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../style/QrList.module.css";

interface QrItem {
  id: string;
  type: "text" | "image";
  content_text?: string;
  image_path?: string;
  created_at: string;
}

export default function QrListPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [qrList, setQrList] = useState<QrItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "1";
    if (!isAdmin) {
      router.push("/admin");
      return;
    }
    setIsAdmin(true);
    fetchQrList();
  }, [router]);

  async function fetchQrList() {
    try {
      console.log("Fetching QR list...");
      const { data, error } = await supabase
        .from("qr_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Fetch QR list error:", error);
        throw error;
      }

      console.log("Fetched QR list:", data?.length || 0, "items");
      setQrList(data || []);
    } catch (error) {
      console.error("Error fetching QR list:", error);
      alert("Ro'yxatni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  }

  async function deleteQr(id: string) {
    if (!confirm(`Bu QR kodni o'chirishni istaysizmi?\n\nID: ${id}`)) return;

    setDeletingId(id);

    try {
      // Avval rasmni topish
      const qr = qrList.find((q) => q.id === id);

      console.log("Deleting QR:", {
        id,
        type: qr?.type,
        image_path: qr?.image_path,
      });

      // Agar rasm QR bo'lsa, storage'dan o'chirish
      if (qr?.type === "image" && qr.image_path) {
        console.log("Deleting image from storage:", qr.image_path);
        const { error: storageError } = await supabase.storage
          .from("qr-images")
          .remove([qr.image_path]);

        if (storageError) {
          console.error("Storage deletion error:", storageError);
          if (!storageError.message.includes("not found")) {
            throw new Error(
              `Rasmni o'chirishda xatolik: ${storageError.message}`
            );
          } else {
            console.warn(
              "Image not found in storage, continuing with DB deletion"
            );
          }
        } else {
          console.log("✅ Image deleted from storage");
        }
      }

      // Database'dan o'chirish
      console.log("Deleting from database...");
      const { error: deleteError } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Database deletion error:", deleteError);

        if (deleteError.code === "42501") {
          throw new Error(
            "RLS (Row Level Security) muammosi!\n\n" +
              "Iltimos, quyidagi SQL ni Supabase dashboardda ishga tushiring:\n\n" +
              'CREATE POLICY "Enable delete access for all users" \n' +
              "ON qr_codes FOR DELETE USING (true);\n\n" +
              "Yoki:\n" +
              "ALTER TABLE qr_codes DISABLE ROW LEVEL SECURITY;"
          );
        }

        throw new Error(
          `Database'dan o'chirishda xatolik: ${deleteError.message}`
        );
      }

      console.log("✅ Database record deleted");

      // Ro'yxatni yangilash
      const updatedList = qrList.filter((q) => q.id !== id);
      setQrList(updatedList);

      console.log("Local state updated. Remaining items:", updatedList.length);

      // Success alert
      alert("✅ QR kod muvaffaqiyatli o'chirildi!");
    } catch (error: any) {
      console.error("Full delete error:", error);
      alert("❌ Xatolik: " + error.message);
    } finally {
      setDeletingId(null);
      // Har holatda listni yangilash
      fetchQrList();
    }
  }

  const filteredQr = qrList.filter(
    (qr) =>
      qr.id.toLowerCase().includes(search.toLowerCase()) ||
      (qr.type === "text" &&
        qr.content_text?.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isAdmin) {
    return (
      <div className={styles.loading}>Admin huquqlari tekshirilmoqda...</div>
    );
  }

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>QR kodlar royxati yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1>QR Kodlar Royxati</h1>
        <div className={styles.headerActions}>
          <Link href="/admin" className={styles.backButton}>
            ← Ortga (QR Yaratish)
          </Link>
          <Link href="/admin/dashboard" className={styles.dashboardButton}>
            📊 Dashboard
          </Link>
        </div>
      </div>

      <div className={styles.infoBox}>
        <p>
          📊 Jami: <strong>{qrList.length}</strong> ta QR kod
        </p>
        <p>
          📝 Matn:{" "}
          <strong>{qrList.filter((q) => q.type === "text").length}</strong> ta
        </p>
        <p>
          🖼️ Rasm:{" "}
          <strong>{qrList.filter((q) => q.type === "image").length}</strong> ta
        </p>
      </div>

      <div className={styles.searchSection}>
        <input
          type="text"
          placeholder="QR kod qidirish (ID yoki matn bo'yicha)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.searchResults}>
          {filteredQr.length} ta natija
        </span>
      </div>

      <div className={styles.qrTableContainer}>
        <table className={styles.qrTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Turi</th>
              <th>Kontent</th>
              <th>Sana</th>
              <th>Harakatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredQr.map((qr) => (
              <tr
                key={qr.id}
                className={deletingId === qr.id ? styles.deletingRow : ""}
              >
                <td className={styles.qrId}>
                  <span title={qr.id}>{qr.id.substring(0, 12)}...</span>
                </td>
                <td>
                  <span
                    className={
                      qr.type === "text" ? styles.typeText : styles.typeImage
                    }
                  >
                    {qr.type === "text" ? "📝 Matn" : "🖼️ Rasm"}
                  </span>
                </td>
                <td className={styles.qrContent}>
                  {qr.type === "text"
                    ? (qr.content_text?.substring(0, 50) || "Bo'sh") + "..."
                    : qr.image_path || "Rasm"}
                </td>
                <td className={styles.qrDate}>
                  {new Date(qr.created_at).toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className={styles.actions}>
                  <Link
                    href={`/q/${qr.id}`}
                    target="_blank"
                    className={styles.actionButton}
                    title="QR kodni ko'rish"
                  >
                    👁️ Korish
                  </Link>
                  <button
                    onClick={() => deleteQr(qr.id)}
                    disabled={deletingId === qr.id}
                    className={`${styles.actionButton} ${styles.deleteButton} ${
                      deletingId === qr.id ? styles.deleting : ""
                    }`}
                    title="QR kodni o'chirish"
                  >
                    {deletingId === qr.id
                      ? "⏳ O'chirilmoqda..."
                      : "🗑️ O'chirish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredQr.length === 0 && qrList.length === 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📭</div>
            <h3>QR Kodlar Topilmadi</h3>
            <p>Hozircha hech qanday QR kod yaratilmagan</p>
            <Link href="/admin" className={styles.createButton}>
              🚀 Birinchi QR Kod Yaratish
            </Link>
          </div>
        )}

        {filteredQr.length === 0 && qrList.length > 0 && (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🔍</div>
            <h3>Qidiruv Boyicha Natija Topilmadi</h3>
            <p>
              <strong>{search}</strong> boyicha hech narsa topilmadi
            </p>
            <button
              onClick={() => setSearch("")}
              className={styles.clearButton}
            >
              🔄 Qidiruvni tozalash
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
