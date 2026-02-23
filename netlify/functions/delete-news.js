import { createClient } from "@supabase/supabase-js";

export const handler = async (event) => {
  if (event.httpMethod !== "DELETE") {
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
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Дістаємо новину щоб знайти фото
    const { data: row } = await supabase
      .from("news")
      .select("image_url")
      .eq("id", id)
      .single();

    // Якщо є фото — видаляємо з bucket
    if (row?.image_url) {
      try {
        const url = new URL(row.image_url);
        // Шлях виглядає як: /storage/v1/object/public/news-images/news/filename.jpg
        const parts = url.pathname.split("/news-images/");
        if (parts.length > 1) {
          await supabase.storage.from("news-images").remove([parts[1]]);
        }
      } catch (imgErr) {
        // Не зупиняємось якщо фото не вдалось видалити
        console.error("Image delete error:", imgErr);
      }
    }

    // Видаляємо новину з БД
    const { error } = await supabase.from("news").delete().eq("id", id);

    if (error) {
      return { statusCode: 500, body: JSON.stringify({ message: error.message }) };
    }

    return {
      statusCode: 200,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ success: true }),
    };

  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ message: String(e) }) };
  }
};