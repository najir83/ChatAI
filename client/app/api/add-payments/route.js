// app/api/payments/create-order/route.js

import Razorpay from "razorpay";

export async function POST(request) {
  try {
    const { amount } = await request.json();

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,      // replace with test key
      key_secret:process.env.RAZORPAY_KEY_SCERET,        // replace with test secret
    });

    const options = {
      amount: amount * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_order_${Math.floor(Math.random() * 1000000)}`,
    };

    const order = await razorpay.orders.create(options);

    return Response.json({ success: true, order });
  } catch (error) {
    // console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Order creation failed" }),
      { status: 500 }
    );
  }
}
