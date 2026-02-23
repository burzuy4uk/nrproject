import { createClient } from "@supabase/supabase-js";

// Простий парсер multipart/form-data без Busboy
function parseMultipart(event) {
  return new Promise((resolve, reject) => {
    try {
      const contentType = event.headers["content-type"] || event.headers["Content-Type"] || "";
      const boundaryMatch = contentType.match(/boundary=(.+)$/);
      if (!boundaryMatch) {
        return reject(new Error("No boundary in content-type"));
      }

      const boundary = boundaryMatch[1].trim();
      const body = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : Buffer.from(event.body || "", "utf8");

      const fields = {};
      let file = null;

      const boundaryBuf = Buffer.from("--" + boundary);
      const parts = splitBuffer(body, boundaryBuf);

      for (const part of parts) {
        if (!part || part.length < 4) continue;

        // Знаходимо подвійний перенос рядка — кінець заголовків
        const headerEnd = indexOfDoubleCRLF(part);
        if (headerEnd === -1) continue;

        const headerStr = part.slice(0, headerEnd).toString("utf8");
        const content = part.slice(headerEnd + 4); // після \r\n\r\n

        // Прибираємо кінцевий \r\n
        const data = content.slice(0, content.length - 2);

        const nameMatch = headerStr.match(/name="([^"]+)"/);
        const filenameMatch = headerStr.match(/filename="([^"]*)"/);
        const mimeMatch = headerStr.match(/Content-Type:\s*([^\r\n]+)/i);

        if (!nameMatch) continue;
        const name = nameMatch[1];

        if (filenameMatch) {
          file = {
            filename: filenameMatch[1],
            mimeType: mimeMatch ? mimeMatch[1].trim() : "application/octet-stream",
            buffer: data,
          };
        } else {
          fields[name] = data.toString("utf8");
        }
      }

      resolve({ fields, file });
    } catch (e) {
      reject(e);
    }
  });
}

function splitBuffer(buf, delimiter) {
  const parts = [];
  let start = 0;
  let idx;
  while ((idx = indexOfBuffer(buf, delimiter, start)) !== -1) {
    parts.push(buf.slice(start, idx));
    start = idx + delimiter.length;
  }
  parts.push(buf.slice(start));
  return parts;
}

function indexOfBuffer(buf, search, offset = 0) {
  for (let i = offset; i <= buf.length - search.length; i++) {
    let found = true;
    for (let j = 0; j < search.length; j++) {
      if (buf[i + j] !== search[j]) { found = false; break; }
    }
    if (found) return i;
  }
  return -1;
}

function indexOfDoubleCRLF(buf) {
  const pattern = Buffer.from("\r\n\r\n");
  return indexOfBuffer(buf, pattern);
}

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const token = event.headers["x-admin-token"] || event.headers["X-Admin-Token"];
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return { statusCode: 401, body: JSON.stringify({ message: "Unauthorized" }) };
  }

  const id = event.queryStringParameters?.id;
  if (!id) {
    return { statusCode: 400, body: JSON.stringify({ message: "id required" }) };
  }

  try {
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

    const updates = { title, content };

    // Якщо є нове фото — завантажуємо
    if (file && file.buffer?.length) {
      const ext = (file.filename?.split(".").pop() || "jpg").toLowerCase();
      const filePath = `news/${Date.now()}-${Math.random().toString(16).slice(2)}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from("news-images")
        .upload(filePath, file.buffer, { contentType: file.mimeType, upsert: false });

      if (upErr) {
        return { statusCode: 500, body: JSON.stringify({ message: "Upload error: " + upErr.message }) };
      }

      const { data: pub } = supabase.storage.from("news-images").getPublicUrl(filePath);
      updates.image_url = pub.publicUrl;
    }

    const { data, error } = await supabase
      .from("news")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data),
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: String(e) }) };
  }
};