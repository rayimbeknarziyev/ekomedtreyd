"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../style/AdminDashborad.module.css";

// QR kod yozuvlari uchun interface
interface QRCodeRecord {
  id: string;
  type: "text" | "image";
  created_at: string;
}

export default function AdminDashboard() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<{
    totalQr: number;
    textQr: number;
    imageQr: number;
    recentQr: QRCodeRecord[];
  }>({
    totalQr: 0,
    textQr: 0,
    imageQr: 0,
    recentQr: [],
  });

  const router = useRouter();

  // Statistika olish uchun async function
  async function fetchStats() {
    try {
      // Total QR codes
      const { count: total } = await supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true });

      // Text QR codes
      const { count: textCount } = await supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("type", "text");

      // Image QR codes
      const { count: imageCount } = await supabase
        .from("qr_codes")
        .select("*", { count: "exact", head: true })
        .eq("type", "image");

      // Recent QR codes
      const { data: recent } = await supabase
        .from("qr_codes")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      setStats({
        totalQr: total || 0,
        textQr: textCount || 0,
        imageQr: imageCount || 0,
        recentQr: recent || [],
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }

  useEffect(() => {
    async function init() {
      const adminFlag = localStorage.getItem("isAdmin") === "1";
      if (!adminFlag) {
        router.push("/admin");
        return;
      }
      setIsAdmin(true);
      await fetchStats();
    }
    init();
  }, [router]);

  if (!isAdmin) {
    return <div className={styles.loading}>Yuklanmoqda...</div>;
  }

  return (
    <main className={styles.dashboard}>
      {/* Header */}
      <div className={styles.header}>
        <h1>Admin Dashboard</h1>
        <div className={styles.adminNav}>
          <Link href="/admin" className={styles.navLink}>
            QR Yaratish
          </Link>
          <Link
            href="/admin/dashboard"
            className={`${styles.navLink} ${styles.active}`}
          >
            Dashboard
          </Link>
          <Link href="/admin/qr-list" className={styles.navLink}>
            QR Royxati
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("isAdmin");
              router.push("/admin");
            }}
            className={styles.logoutBtn}
          >
            Chiqish
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Jami QR Kodlar</h3>
            <p className={styles.statNumber}>{stats.totalQr}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statContent}>
            <h3>Matn QR Kodlar</h3>
            <p className={styles.statNumber}>{stats.textQr}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🖼️</div>
          <div className={styles.statContent}>
            <h3>Rasm QR Kodlar</h3>
            <p className={styles.statNumber}>{stats.imageQr}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🚀</div>
          <div className={styles.statContent}>
            <h3>Faol QR Kodlar</h3>
            <p className={styles.statNumber}>{stats.totalQr}</p>
          </div>
        </div>
      </div>

      {/* Recent QR Codes */}
      <div className={styles.recentSection}>
        <h2>Oxirgi QR Kodlar</h2>
        <div className={styles.recentTable}>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Turi</th>
                <th>Yaratilgan sana</th>
                <th>Harakatlar</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentQr.map((qr) => (
                <tr key={qr.id}>
                  <td>{qr.id.substring(0, 8)}...</td>
                  <td>
                    <span
                      className={
                        qr.type === "text"
                          ? styles.textBadge
                          : styles.imageBadge
                      }
                    >
                      {qr.type === "text" ? "📝 Matn" : "🖼️ Rasm"}
                    </span>
                  </td>
                  <td>
                    {qr.created_at
                      ? new Date(qr.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <Link
                      href={`/q/${qr.id}`}
                      target="_blank"
                      className={styles.viewLink}
                    >
                      Korish
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
