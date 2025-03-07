import Stripe from "stripe";

export async function POST(req: Request) {
  const customDonation = Number(req.headers.get("custom_donation"));
  const origin = req.headers.get("origin")!;
  const stripe = new Stripe(process.env.EXPO_PUBLIC_STRIPE_SECRET_KEY!);

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    submit_type: "donate",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "EGP",
          product_data: {
            name: "Custom amount donation",
          },
          unit_amount: formatAmountForStripe(customDonation, "EGP"),
        },
      },
    ],
    success_url: `${origin}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    ui_mode: "hosted",
  });

  return Response.json({
    client_secret: checkoutSession.client_secret,
    url: checkoutSession.url,
  });
}

function formatAmountForStripe(amount: number, currency: string): number {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
