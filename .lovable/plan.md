# Fix cart payment for frames and the 2-piece Hyrox display

## The confirmed problem

On the cart page, the orange "Place Your Order and Secure Your Payment" button for frames
and for the 2-piece Hyrox display opens one fixed Stripe payment page.

That fixed page always charges the same amount, no matter what is in the cart. So:

- A cart with 2 frames, or a more expensive frame, is charged the wrong price.
- No order is saved, so you get no record of the customer's name, WhatsApp number,
  colours, race details, or GPX file.
- No confirmation email is sent to you or the customer after payment.

The Soft Flask Drying Stand already works correctly: it collects details, saves the
order, then opens a Stripe page built from the real cart contents.

## Proposed fix

Make frames and the 2-piece Hyrox display behave like the Flask product.

1. **Frames (Keepsaker, Achiever, Legacy, 3D Map, Hyrox Hex):** the cart button goes
   back to the existing checkout page, where the customer enters their details and race
   information. This is where the order gets saved and emailed to you.
2. **After the order is saved,** send the customer to a Stripe payment page that is built
   from their actual cart — correct items, quantities and total — instead of the fixed link.
3. **Payment confirmation:** the existing payment webhook then marks the order paid and
   triggers the confirmation emails, the same way the Flask orders already do.
4. Keep the note under the button about confirming design details and shipping over
   WhatsApp after payment.

## What you need to decide

The frames and the 2-piece Hyrox display need prices registered in Stripe so the
payment page can charge the right amount. Two options:

- **A:** Charge directly from the prices shown on the site (AED 220 / 260 / 350 / 100 / 140).
  Nothing extra to set up.
- **B:** Set up each product formally in Stripe first, which gives tidier product names
  on receipts and in the Stripe dashboard.

Option A is faster and I recommend it; prices stay controlled from the site.

## Alternative if you prefer today's behaviour

If you deliberately want customers to pay a flat amount and sort out details later, I can
instead keep the payment link but still save the order and send the emails first — so you
always have the order on record. Say the word and I'll plan that instead.

## Technical notes

- `src/routes/cart.tsx`: replace both static `<a href="https://buy.stripe.com/...">` links
  with the flow used by the Flask items (details form → `submitOrderRequest` /
  `submitFlaskOrder` equivalent → dynamic Checkout Session → same-tab redirect).
- `src/lib/payments.functions.ts`: add a generic `createCartCheckout` server function using
  `price_data` line items derived from `ALL_PRODUCTS` prices, with `orderRequestId` metadata
  and `allow_promotion_codes: true`.
- Frame items keep routing through `/checkout` so the personalisation and GPX fields are
  still collected; the payment redirect happens after the order request row is created.
- `src/routes/api/public/payments/webhook.ts` already reconciles by `metadata.orderRequestId`
  or `client_reference_id`, so no webhook change is needed.
