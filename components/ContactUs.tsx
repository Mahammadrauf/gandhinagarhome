"use client";

import React, { useState } from "react";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(null);

  const onChange =
    (key: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((s) => ({ ...s, [key]: e.target.value }));
      setStatus(null);
    };

  const validate = () => {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim());
    const phoneOk = /^[0-9+\-\s]{7,15}$/.test(form.phone.trim());
    return (
      form.firstName.trim().length >= 2 &&
      form.lastName.trim().length >= 2 &&
      emailOk &&
      phoneOk &&
      form.message.trim().length >= 10
    );
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      setStatus({ ok: false, msg: "Please fill all fields correctly." });
      return;
    }
    try {
      setLoading(true);
      setStatus(null);

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          message: form.message.trim(),
          // simple honeypot slot if you want to add later
        }),
      });

      if (!res.ok) throw new Error("Failed");

      setStatus({ ok: true, msg: "Thanks! We’ll get back to you shortly." });
      setForm({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch {
      setStatus({ ok: false, msg: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition p-3";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-4">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-black">Contact Us</h2>
          <p className="text-black/70 mt-2">
            Have a question about buying, selling, or listing? Tell us a bit about you.
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl bg-primary/5 ring-1 ring-primary/15 shadow-sm p-6 sm:p-8">
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">First name</label>
              <input
                className={inputBase}
                placeholder="John"
                value={form.firstName}
                onChange={onChange("firstName")}
                required
                minLength={2}
                name="firstName"
                autoComplete="given-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">Last name</label>
              <input
                className={inputBase}
                placeholder="Doe"
                value={form.lastName}
                onChange={onChange("lastName")}
                required
                minLength={2}
                name="lastName"
                autoComplete="family-name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">Email</label>
              <input
                type="email"
                className={inputBase}
                placeholder="you@example.com"
                value={form.email}
                onChange={onChange("email")}
                required
                name="email"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">Mobile No.</label>
              <input
                className={inputBase}
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={onChange("phone")}
                required
                name="phone"
                autoComplete="tel"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 mb-2">Your Query</label>
              <textarea
                className={inputBase + " min-h-[140px] resize-y"}
                placeholder="Tell us about your requirement…"
                value={form.message}
                onChange={onChange("message")}
                required
                minLength={10}
                name="message"
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-between">
              {status && (
                <p
                  className={
                    "text-sm " + (status.ok ? "text-emerald-700" : "text-red-600")
                  }
                >
                  {status.msg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="ml-auto inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white px-6 py-3 font-semibold shadow hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition"
                aria-busy={loading}
              >
                {loading ? "Submitting…" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
