import Busboy from "busboy";
import { createClient } from "@supabase/supabase-js";

function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    const fields = {};
    let file = null;

    const bb = Busboy({ headers: event.headers });

    bb.on("file", (name, stream, info) => {
      const chunks = [];
      stream.on("data", (d) => chunks.push(d));
      stream.on("end", () => {
        file = {
          fieldname: name,
          filename: info.filename,
          mimeType: info.mimeType,
          buffer: Buffer.concat(chunks),
        };
      });
    });

    bb.on("field", (name, val) => { fields[name] = val; });

    bb.on("error", reject);
    bb.on("finish", () => resolve({ fields, file }));

    const body = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body || "", "utf8");

    bb.end(body);
  });
}

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    // простий захист адмінки токеном
    const token = event.headers["x-admin-token"] || event.headers["X-Admin-Token"];
    if (!token || token !== process.env.ADMIN_TOKEN) {
      return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
    }

    const { fields, file } = await parseMultipart(event);

    const title = (fields.title || "").trim();
    const content = (fields.content || "").trim();

    if (!title || !content) {
      return { statusCode: 400, body: JSON.stringify({ message: "title/content required" }) };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    let image_url = null;

    if (file && file.buffer?.length) {
      const ext = (file.filename?.split(".").pop() || "jpg").toLowerCase();
      const filePath = `news/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("news-images")
        .upload(filePath, file.buffer, { contentType: file.mimeType, upsert: false });

      if (upErr) {
        return { statusCode: 500, body: JSON.stringify({ message: upErr.message }) };
      }

      // public URL для public bucket
      const { data: pub } = supabase.storage.from("news-images").getPublicUrl(filePath);
      image_url = pub.publicUrl;
    }

    const { data, error } = await supabase
      .from("news")
      .insert([{ title, content, image_url }])
      .select()
      .single();

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }

    return {
      statusCode: 201,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: String(e) }) };
  }
};