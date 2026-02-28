import { NextRequest, NextResponse } from "next/server";
import { stripe, CREDIT_PACKS } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.supabase_user_id;
    const packId = session.metadata?.pack_id;
    const creditsStr = session.metadata?.credits;

    if (!userId || !packId || !creditsStr) {
      console.error("Missing metadata in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    const credits = parseInt(creditsStr, 10);
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    const admin = createAdminClient();

    // Idempotency check — don't double-add if webhook is replayed
    const { data: existingTx } = await admin
      .from("credit_transactions")
      .select("id")
      .eq("stripe_session_id", session.id)
      .single();

    if (existingTx) {
      return NextResponse.json({ received: true });
    }

    // Add credits
    await admin.rpc("add_credits", {
      p_user_id: userId,
      p_amount: credits,
    });

    // Log transaction
    await admin.from("credit_transactions").insert({
      user_id: userId,
      amount: credits,
      type: "purchase",
      stripe_session_id: session.id,
      description: `${pack?.name ?? packId} pack (${credits} credits)`,
    });
  }

  return NextResponse.json({ received: true });
}
