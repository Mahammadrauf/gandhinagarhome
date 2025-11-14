"use client";

import React from "react";
import Header from "@/components/Header";
import SellPageForm from "@/components/StartListingBanner";

export default function SellFormPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <SellPageForm />
    </main>
  );
}
