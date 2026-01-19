"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import QRCode from "qrcode";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../style/AdminPage.module.css";

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "admin1234";

// Fayl nomini tozalash funksiyasi
function sanitizeFileName(filename: string): string {
  return filename
    .toLowerCase() // Kichik harfga o'tkazish
    .replace(/[а-яё]/g, (char) => {
      // Kirill harflarini transliteratsiya qilish
      const cyrillicMap: { [key: string]: string } = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ё: "yo",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "kh",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "shch",
        ъ: "",
        ы: "y",
        ь: "",
        э: "e",
        ю: "yu",
        я: "ya",
      };
      return cyrillicMap[char] || char;
    })
    .replace(/[^a-z0-9.\-_]/g, "_") // Faqat raqam, harf, nuqta, tire va pastki chiziqqa ruxsat
    .replace(/\s+/g, "_") // Bo'shliqlarni pastki chiziqqa almashtirish
    .replace(/_{2,}/g, "_") // Ketma-ket pastki chiziqlarni bittaga qisqartirish
    .replace(/^_+|_+$/g, ""); // Bosh va oxiridagi pastki chiziqlarni olib tashlash
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"text" | "image">("text");
  const [textValue, setTextValue] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus === "1") {
      setIsAdmin(true);
    }
  }, []);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem("isAdmin", "1");
      router.push("/admin/dashboard");
    } else {
      alert("Noto'g'ri login yoki parol");
    }
  }

  async function createQr(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      let record: any = { type: mode };

      if (mode === "text") {
        if (!textValue.trim()) {
          throw new Error("Matn kiriting");
        }
        record.content_text = textValue;
      } else if (mode === "image") {
        if (!file) {
          throw new Error("Rasm tanlang");
        }

        // Rasmni validatsiya qilish
        if (!file.type.startsWith("image/")) {
          throw new Error("Faqat rasm fayllari qabul qilinadi");
        }
        if (file.size > 5 * 1024 * 1024) {
          // 5MB limit
          throw new Error("Rasm hajmi 5MB dan kichik bo'lishi kerak");
        }

        // Fayl nomini tozalash
        const cleanFileName = sanitizeFileName(file.name);
        const fileExtension = cleanFileName.split(".").pop();
        const newFileName = `${uuidv4()}.${fileExtension}`;

        // Storage ga yuklash
        const { error: uploadError } = await supabase.storage
          .from("qr-images")
          .upload(newFileName, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          if (uploadError.message.includes("bucket")) {
            throw new Error(
              "Storage bucket topilmadi. Iltimos, Supabase dashboardda 'qr-images' bucket ni yarating"
            );
          } else if (uploadError.message.includes("Invalid key")) {
            throw new Error(
              "Fayl nomida noto'g'ri belgilar bor. Iltimos, fayl nomini o'zgartiring (faqat ingliz harflari, raqamlar va '-', '_' belgilari bo'lsin)"
            );
          }
          throw uploadError;
        }

        record.image_path = newFileName;
      }

      // Database ga saqlash
      const { data, error } = await supabase
        .from("qr_codes")
        .insert([record])
        .select()
        .single();

      if (error) throw error;

      const id = data.id as string;
      // QR kod generatsiya qilish
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      const target = `${appUrl}/q/${id}`;
      const qrUrl = await QRCode.toDataURL(target, {
        width: 300,
        margin: 2,
        color: {
          dark: "#1e293b",
          light: "#ffffff",
        },
      });

      setQrDataUrl(qrUrl);
      alert(
        "QR kod muvaffaqiyatli yaratildi! Endi uni yuklab olishingiz mumkin."
      );

      // Formni tozalash
      if (mode === "text") setTextValue("");
      if (mode === "image") {
        setFile(null);
        setFileName("");
      }
    } catch (err: any) {
      console.error("Create QR error:", err);
      alert("Xatolik: " + (err.message || JSON.stringify(err)));
    } finally {
      setSaving(false);
    }
  }

  function downloadQr() {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = `qr_${Date.now()}.png`;
    a.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setFileName(selectedFile?.name || "");
  }

  function logout() {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    router.push("/");
  }

  if (!isAdmin) {
    return (
      <main className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2 className={styles.loginTitle}>Admin Tizimiga Kirish</h2>
          <p className={styles.loginSubtitle}>
            Faqat ruxsat etilgan adminlar kirishi mumkin
          </p>

          <form onSubmit={login} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                placeholder="admin@gmail.com"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Parol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                placeholder="admin1234"
                required
              />
            </div>

            <button type="submit" className={styles.loginButton}>
              Kirish
            </button>
          </form>

          <div className={styles.loginFooter}>
            <p>Demo malumotlar:</p>
            <p>
              Email: <strong>admin@gmail.com</strong>
            </p>
            <p>
              Parol: <strong>admin1234</strong>
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.adminContainer}>
      <div className={styles.adminHeader}>
        <h1>QR Kod Yaratish Paneli</h1>
        <div className={styles.adminNav}>
          <Link href="/admin/dashboard" className={styles.navLink}>
            Dashboard
          </Link>
          <Link href="/admin/qr-list" className={styles.navLink}>
            QR Royxati
          </Link>
          <button onClick={logout} className={styles.logoutButton}>
            Chiqish
          </button>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.creationCard}>
          <div className={styles.modeSelector}>
            <button
              className={`${styles.modeButton} ${
                mode === "text" ? styles.active : ""
              }`}
              onClick={() => setMode("text")}
            >
              📝 Matn QR
            </button>
            <button
              className={`${styles.modeButton} ${
                mode === "image" ? styles.active : ""
              }`}
              onClick={() => setMode("image")}
            >
              🖼️ Rasm QR
            </button>
          </div>

          <form onSubmit={createQr} className={styles.creationForm}>
            {mode === "text" && (
              <div className={styles.textSection}>
                <label className={styles.sectionLabel}>Matn Kiriting</label>
                <textarea
                  value={textValue}
                  onChange={(e) => setTextValue(e.target.value)}
                  className={styles.textarea}
                  rows={6}
                  placeholder="QR kod ichiga joylashadigan matnni kiriting..."
                  required
                />
                <div className={styles.charCount}>{textValue.length} belgi</div>
              </div>
            )}

            {mode === "image" && (
              <div className={styles.imageSection}>
                <label className={styles.sectionLabel}>Rasm Yuklash</label>
                <div className={styles.fileUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                    id="fileInput"
                    required
                  />
                  <label htmlFor="fileInput" className={styles.fileLabel}>
                    {fileName || "Rasm tanlang..."}
                    <span className={styles.browseButton}>Tanlash</span>
                  </label>
                </div>
                {file && (
                  <div className={styles.fileInfo}>
                    <p>📄 {fileName}</p>
                    <p>
                      📦{" "}
                      {file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
                        : `${(file.size / 1024).toFixed(2)} KB`}
                    </p>
                    <p className={styles.fileNoteText}>
                      ⚠️ Fayl nomi avtomatik ravishda tozalanadi
                    </p>
                  </div>
                )}
                <p className={styles.fileNote}>
                  ❗ Rasm hajmi 5MB dan oshmasligi kerak
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className={styles.createButton}
            >
              {saving ? "⏳ QR Yaratilmoqda..." : "✨ QR Yaratish"}
            </button>
          </form>

          {qrDataUrl && (
            <div className={styles.qrPreview}>
              <h3 className={styles.qrTitle}>QR Kod Tayyor!</h3>
              <div className={styles.qrImageWrapper}>
                <img src={qrDataUrl} alt="QR Code" className={styles.qrImage} />
              </div>
              <div className={styles.qrActions}>
                <button onClick={downloadQr} className={styles.downloadButton}>
                  📥 Yuklab Olish
                </button>
                <button
                  onClick={() => setQrDataUrl(null)}
                  className={styles.clearButton}
                >
                  🆕 Yangi QR
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.infoPanel}>
          <h3>💡 Qollanma</h3>
          <ul className={styles.guideList}>
            <li>Matn yoki rasm turini tanlang</li>
            <li>Kontentni kiriting yoki yuklang</li>
            <li>QR Yaratish tugmasini bosing</li>
            <li>Tayyor QR kodni yuklab oling</li>
            <li>QR royxatidan barcha QR laringizni koring</li>
          </ul>

          <div className={styles.stats}>
            <h3>📊 Tezkor Stats</h3>
            <Link href="/admin/dashboard" className={styles.dashboardLink}>
              Batafsil statistikani korish →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}