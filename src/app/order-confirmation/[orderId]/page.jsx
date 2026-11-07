import React from "react";
import { OrderConfirmationClient } from "./OrderConfirmationClient";

export const metadata = {
  title: "Order Placed Successfully — Haute Couture & Lifestyle",
};

export default async function OrderConfirmationPage({ params }) {
  const { orderId } = await params;
  return <OrderConfirmationClient orderNumber={orderId} />;
}
