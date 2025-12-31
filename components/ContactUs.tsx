"use client";

import React, { useState } from "react";
import axios from 'axios';
import API_URL from '@/app/config/config';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  preferred: "Call" | "WhatsApp" | "Email";
};

export default function ContactUs() {
  const [form, setForm] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    preferred: "Call", // default
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | { ok: boolean; msg: string }>(
    null
  );

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

      const response = await axios.post(`${API_URL}/contact`, {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        mobileNo: form.phone.trim(),
        preferredModeOfContact: form.preferred,
        query: form.message.trim(),
      });

      if (response.data.success) {
        setStatus({ ok: true, msg: response.data.message || "Thanks! We'll get back to you shortly." });
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
          preferred: "Call", // reset
        });
      } else {
        throw new Error(response.data.message || "Failed to submit contact form");
      }
    } catch (error: any) {
      console.error("Contact API error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Something went wrong. Please try again.";
      setStatus({ ok: false, msg: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition p-3";

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Contact Us
          </h2>

          {/* === REPLACED: exact expanding green line from WhyInvest / ExploreLocation === */}
          <div
            className="h-1.5 bg-[#056F5E] mx-auto mt-4 rounded-full w-24 hover:w-64 transition-all duration-500 ease-in-out cursor-pointer"
          />

          <p className="text-black/70 mt-4">
            Have a question about buying, selling, or listing? Tell us a bit
            about you.
          </p>
        </div>

        <div className="mx-auto max-w-4xl rounded-3xl bg-primary/5 ring-1 ring-primary/15 shadow-sm p-6 sm:p-8">
          <form
            onSubmit={submit}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            <div>
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                First name
              </label>
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
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Last name
              </label>
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
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Email
              </label>
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
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Mobile No.
              </label>
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

            {/* Preferred Mode of Contact */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 mb-3">
                Preferred Mode of Contact
              </label>
              <div className="flex items-center gap-3 flex-wrap">
                {(["Call", "WhatsApp", "Email"] as const).map((opt) => {
                  const label = opt;
                  const active = form.preferred === opt;

                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        setForm((s) => ({ ...s, preferred: opt }))
                      }
                      className={[
                        "px-5 py-2 rounded-full text-sm font-semibold transition-all",
                        active
                          ? "bg-[#0b6b53] text-white shadow"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-emerald-900 mb-2">
                Your Query
              </label>
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
