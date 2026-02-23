import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // тільки на сервері!
);

// простий захист адмінки
function requireAdmin(req, res, next) {
  const token = req.headers["x-admin-token"];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

// upload в пам'ять (без збереження на диск)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// PUBLIC: отримати новини
app.get("/api/news", async (req, res) => {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("id", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  res.json(data);
});

// ADMIN: створити новину (з фото)
app.post("/api/admin/news", requireAdmin, upload.single("image"), async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "title/content required" });

    let image_url = null;

    // якщо є фото — вантажимо в Supabase Storage
    if (req.file) {
      const ext = (req.file.originalname.split(".").pop() || "jpg").toLowerCase();
      const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("news-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: false
        });

      if (upErr) return res.status(500).json({ message: upErr.message });

      // отримати public URL
      const { data: pub } = supabase.storage.from("news-images").getPublicUrl(fileName);
      image_url = pub.publicUrl;
    }

    const { data, error } = await supabase
      .from("news")
      .insert([{ title, content, image_url }])
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json(data);
  } catch (e) {
    res.status(500).json({ message: String(e) });
  }
});

app.listen(process.env.PORT || 5050, () => {
  console.log(`API running on http://localhost:${process.env.PORT || 5050}`);
});