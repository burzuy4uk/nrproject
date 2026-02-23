import { createClient } from "@supabase/supabase-js";

export const handler = async () => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from("news")
      .select("*")
      .order("id", { ascending: false });

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