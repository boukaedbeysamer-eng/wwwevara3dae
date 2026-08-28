import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { createFlaskCheckout } from "@/lib/payments.functions";

export type FlaskCheckoutItem = { color: "Black" | "White" | "Blue"; qty: number };

interface Props {
  requestId: string;
  email: string;
  fullName: string;
  whatsapp: string;
  items: FlaskCheckoutItem[];
}

export function FlaskEmbeddedCheckout({ requestId, email, fullName, whatsapp, items }: Props) {
  const fetchClientSecret = async (): Promise<string> => {
    const result = await createFlaskCheckout({
      data: {
        requestId,
        email,
        fullName,
        whatsapp,
        items,
        environment: getStripeEnvironment(),
        origin: window.location.origin,
      },
    });
    if ("error" in result) throw new Error(result.error);
    if (!result.clientSecret) throw new Error("Stripe did not return a client secret");
    return result.clientSecret;
  };

  return (
    <div id="checkout" className="mt-8">
      <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
