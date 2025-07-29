import { serve } from "https://deno.land/std/http/server.ts";
serve(async (req)=>{
  try {
    const { name, email, message } = await req.json();
    // ✅ Ambil API Key dari environment
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) throw new Error("API key not set");
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "noreply@yourdomain.com",
        to: "youremail@gmail.com",
        subject: "📬 Pesan Baru dari Website!",
        html: `<p><strong>Nama:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Pesan:</strong> ${message}</p>`
      })
    });
    const result = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({
        error: result
      }), {
        status: res.status,
        headers: {
          "Content-Type": "application/json"
        }
      });
    }
    return new Response(JSON.stringify({
      success: true,
      result
    }), {
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
});
