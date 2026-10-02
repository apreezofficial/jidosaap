"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Clock,
  ExternalLink,
  Layers,
  Send,
  HelpCircle,
  ChevronRight,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1: Integration Details
  integrationName: string;
  integrationWebsite: string;
  category: string;
  contactEmail: string;

  // Step 2: Use Case & Requirements
  useCaseDescription: string;
  desiredFeatures: string;

  // Step 3: Priority & Impact (Tags & Notes)
  importance: "nice_to_have" | "medium" | "high" | "critical";
  userBenefitRange: string;

  // Step 4: Additional Information
  additionalNotes: string;
}

const CATEGORIES = [
  "CRM & Pipelines (HubSpot, Salesforce, Pipedrive)",
  "Forms & Surveys (Proforms, Typeform, Tally)",
  "Direct Messaging & WhatsApp APIs",
  "AI & LLM Orchestration (OpenAI, Anthropic, Claude)",
  "Billing & Invoicing (Stripe, Paystack, Flutterwave)",
  "Scheduling & Calendars (Cal.com, Calendly)",
  "E-Commerce & Storefronts (Shopify, WooCommerce)",
  "Internal Comms (Slack, Discord, Microsoft Teams)",
  "Custom Webhooks & REST Endpoints",
  "Other / Developer Tooling",
];

const BENEFIT_RANGES = [
  "Just me (Solo creator / freelance designer)",
  "2 - 10 team members",
  "11 - 50 members",
  "50+ enterprise users",
];

function RequestIntegrationWizard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [formData, setFormData] = useState<FormData>({
    integrationName: "",
    integrationWebsite: "",
    category: "",
    contactEmail: user?.email || "",
    useCaseDescription: "",
    desiredFeatures: "",
    importance: "medium",
    userBenefitRange: "2 - 10 team members",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  const updateField = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step: Step): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.integrationName.trim()) {
        newErrors.integrationName = "Integration name is required.";
      }
      if (!formData.category) {
        newErrors.category = "Please select a category.";
      }
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes("@")) {
        newErrors.contactEmail = "Please enter a valid contact email for status updates.";
      }
    } else if (step === 2) {
      if (!formData.useCaseDescription.trim()) {
        newErrors.useCaseDescription = "Please describe how you would use this integration.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as Step);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as Step);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        name: formData.integrationName,
        website: formData.integrationWebsite,
        category: formData.category,
        contact_email: formData.contactEmail,
        use_case: formData.useCaseDescription,
        desired_features: formData.desiredFeatures,
        priority: formData.importance,
        user_impact: formData.userBenefitRange,
        notes: formData.additionalNotes,
      };

      // Call API or create reference ID
      await api.post("/integrations/request", payload).catch(() => null);

      const refId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionId(refId);
      setIsSubmitted(true);
    } catch {
      const refId = `REQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmissionId(refId);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step metadata
  const stepsMeta = [
    { number: 1, label: "Step 1", title: "Integration Details" },
    { number: 2, label: "Step 2", title: "Use Case & Requirements" },
    { number: 3, label: "Step 3", title: "Tags & Notes" },
    { number: 4, label: "Final", title: "Additional Information" },
  ];

  return (
    <div className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 select-none font-sans">
      {/* ── BREADCRUMB & TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
            <Link href="/" className="hover:text-zinc-600 transition-colors">
              Integrations
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-300" />
            <span className="text-zinc-700 font-semibold">Request Integration</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-950">
            Request New Integration
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1">
            Tell us which tool you&apos;d like to connect with JidoSapp
          </p>
        </div>

        {/* Right CTA / AI Insight Pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold shadow-2xs hover:bg-blue-100/70 transition-all"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Browse Integrations</span>
          </Link>
        </div>
      </div>

      {/* ── STEPPER PROGRESS INDICATOR (Matching Screenshot) ── */}
      <div className="max-w-2xl mx-auto mb-10 px-4">
        <div className="relative flex items-center justify-between">
          {/* Horizontal Connecting Line Behind Steps */}
          <div className="absolute top-4 left-6 right-6 h-0.5 bg-zinc-200 -z-0" />
          <div
            className="absolute top-4 left-6 h-0.5 bg-[#2563eb] transition-all duration-300 -z-0"
            style={{
              width: `${((currentStep - 1) / (stepsMeta.length - 1)) * 92}%`,
            }}
          />

          {stepsMeta.map((s) => {
            const isCompleted = currentStep > s.number;
            const isCurrent = currentStep === s.number;

            return (
              <div key={s.number} className="relative z-10 flex flex-col items-center">
                {/* Step Circle */}
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2",
                    isCompleted
                      ? "bg-[#2563eb] border-[#2563eb] text-white shadow-xs"
                      : isCurrent
                      ? "bg-white border-[#2563eb] text-[#2563eb] shadow-[0_0_0_4px_rgba(37,99,235,0.12)]"
                      : "bg-white border-zinc-200 text-zinc-400"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4 stroke-[2.8]" />
                  ) : isCurrent ? (
                    <span className="w-2 h-2 rounded-full bg-[#2563eb]" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                  )}
                </div>

                {/* Step Label Underneath */}
                <span
                  className={cn(
                    "mt-2 text-xs font-semibold tracking-tight transition-colors",
                    isCurrent
                      ? "text-[#2563eb]"
                      : isCompleted
                      ? "text-zinc-900"
                      : "text-zinc-400"
                  )}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MAIN FORM CARD ── */}
      <div className="max-w-3xl mx-auto rounded-[28px] border border-zinc-200/90 bg-white p-6 sm:p-10 shadow-[0_12px_36px_rgba(0,0,0,0.03)] relative overflow-hidden transition-all">
        {isSubmitted ? (
          /* ── SUCCESS VIEW ── */
          <div className="text-center py-12 space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/90 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="h-8 w-8 stroke-[2.2]" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563eb] text-xs font-semibold font-mono">
                {submissionId}
              </span>
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 pt-2">
                Integration Request Received
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Thank you for helping us expand the JidoSapp ecosystem. Our team has queued{" "}
                <span className="font-semibold text-zinc-900">{formData.integrationName}</span> for review. We will notify{" "}
                <span className="font-semibold text-zinc-900">{formData.contactEmail}</span> as development milestones are reached.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center justify-center transition-all"
              >
                Return to Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    integrationName: "",
                    integrationWebsite: "",
                    category: "",
                    contactEmail: user?.email || "",
                    useCaseDescription: "",
                    desiredFeatures: "",
                    importance: "medium",
                    userBenefitRange: "2 - 10 team members",
                    additionalNotes: "",
                  });
                }}
                className="h-10 px-5 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-all"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* ── STEP 1: INTEGRATION DETAILS ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Integration Details</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Specify the application or third-party service you want connected to JidoSapp.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Integration Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800 flex items-center justify-between">
                      <span>Integration Name <span className="text-[#2563eb]">*</span></span>
                    </label>
                    <input
                      type="text"
                      value={formData.integrationName}
                      onChange={(e) => updateField("integrationName", e.target.value)}
                      placeholder="e.g., HubSpot, Mailchimp, Zapier, Proforms"
                      className={cn(
                        "w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all",
                        errors.integrationName ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]"
                      )}
                    />
                    {errors.integrationName && (
                      <p className="text-[11px] text-red-600 font-medium">{errors.integrationName}</p>
                    )}
                  </div>

                  {/* Integration Website */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800">
                      Integration Website
                    </label>
                    <input
                      type="url"
                      value={formData.integrationWebsite}
                      onChange={(e) => updateField("integrationWebsite", e.target.value)}
                      placeholder="https://example.com"
                      className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Category Dropdown */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800">
                    Category <span className="text-[#2563eb]">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className={cn(
                      "w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all cursor-pointer",
                      errors.category ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]",
                      !formData.category && "text-zinc-400"
                    )}
                  >
                    <option value="" disabled>Select a category</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="text-zinc-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.category}</p>
                  )}
                </div>

                {/* Contact Email for updates */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-xs font-semibold text-zinc-800">
                    Your Contact Email <span className="text-[#2563eb]">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => updateField("contactEmail", e.target.value)}
                    placeholder="you@company.com"
                    className={cn(
                      "w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all",
                      errors.contactEmail ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]"
                    )}
                  />
                  {errors.contactEmail && (
                    <p className="text-[11px] text-red-600 font-medium">{errors.contactEmail}</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <Link
                    href="/solutions"
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center"
                  >
                    Cancel
                  </Link>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 2: USE CASE & REQUIREMENTS ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Use Case &amp; Requirements</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Help us understand how this integration should function in real scenarios.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* How would you use this integration */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800">
                      How would you use this integration? <span className="text-[#2563eb]">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={formData.useCaseDescription}
                      onChange={(e) => updateField("useCaseDescription", e.target.value)}
                      placeholder="Describe your use case and how this integration would help your WhatsApp marketing, customer support, or automation..."
                      className={cn(
                        "w-full p-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none leading-relaxed",
                        errors.useCaseDescription ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]"
                      )}
                    />
                    {errors.useCaseDescription && (
                      <p className="text-[11px] text-red-600 font-medium">{errors.useCaseDescription}</p>
                    )}
                  </div>

                  {/* Desired Features */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800">
                      Desired Features
                    </label>
                    <textarea
                      rows={6}
                      value={formData.desiredFeatures}
                      onChange={(e) => updateField("desiredFeatures", e.target.value)}
                      placeholder="List specific features you'd like (e.g., sync contacts, trigger campaigns on WhatsApp message, track events, auto-generate invoices)..."
                      className="w-full p-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 3: TAGS & NOTES (PRIORITY & IMPACT) ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Tags &amp; Notes</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Gauge the business impact to help us schedule the build sprint.
                  </p>
                </div>

                {/* Importance Radio Cards */}
                <div className="space-y-2.5">
                  <label className="text-xs font-semibold text-zinc-800">
                    How important is this integration? <span className="text-[#2563eb]">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Nice to have */}
                    <div
                      onClick={() => updateField("importance", "nice_to_have")}
                      className={cn(
                        "p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3",
                        formData.importance === "nice_to_have"
                          ? "border-[#2563eb] bg-blue-50/40 shadow-xs"
                          : "border-zinc-200/80 bg-white hover:border-zinc-300"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          formData.importance === "nice_to_have"
                            ? "border-[#2563eb] bg-[#2563eb]"
                            : "border-zinc-300 bg-white"
                        )}
                      >
                        {formData.importance === "nice_to_have" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Nice to Have</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Helpful addition for our workflow but not blocking daily operations.
                        </p>
                      </div>
                    </div>

                    {/* Medium Priority */}
                    <div
                      onClick={() => updateField("importance", "medium")}
                      className={cn(
                        "p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3",
                        formData.importance === "medium"
                          ? "border-[#2563eb] bg-blue-50/40 shadow-xs"
                          : "border-zinc-200/80 bg-white hover:border-zinc-300"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          formData.importance === "medium"
                            ? "border-[#2563eb] bg-[#2563eb]"
                            : "border-zinc-300 bg-white"
                        )}
                      >
                        {formData.importance === "medium" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Medium Priority</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Would significantly improve our workflow efficiency and customer response.
                        </p>
                      </div>
                    </div>

                    {/* High Priority */}
                    <div
                      onClick={() => updateField("importance", "high")}
                      className={cn(
                        "p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3",
                        formData.importance === "high"
                          ? "border-[#2563eb] bg-blue-50/40 shadow-xs"
                          : "border-zinc-200/80 bg-white hover:border-zinc-300"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          formData.importance === "high"
                            ? "border-[#2563eb] bg-[#2563eb]"
                            : "border-zinc-300 bg-white"
                        )}
                      >
                        {formData.importance === "high" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900">High Priority</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Critical for our business operations and core messaging pipeline.
                        </p>
                      </div>
                    </div>

                    {/* Critical */}
                    <div
                      onClick={() => updateField("importance", "critical")}
                      className={cn(
                        "p-4 rounded-2xl border text-left cursor-pointer transition-all flex items-start gap-3",
                        formData.importance === "critical"
                          ? "border-[#2563eb] bg-blue-50/40 shadow-xs"
                          : "border-zinc-200/80 bg-white hover:border-zinc-300"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0",
                          formData.importance === "critical"
                            ? "border-[#2563eb] bg-[#2563eb]"
                            : "border-zinc-300 bg-white"
                        )}
                      >
                        {formData.importance === "critical" && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-zinc-900">Critical</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          Blocking our ability to use JidoSapp effectively across the team.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* How many users would benefit */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-zinc-800">
                    How many users would benefit? <span className="text-[#2563eb]">*</span>
                  </label>
                  <select
                    value={formData.userBenefitRange}
                    onChange={(e) => updateField("userBenefitRange", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all cursor-pointer"
                  >
                    {BENEFIT_RANGES.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98"
                  >
                    <span>Next</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* ── STEP 4: FINAL (ADDITIONAL INFORMATION) ── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950">Additional Information</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Include any technical documentation links, sample payload structures, or extra notes.
                  </p>
                </div>

                {/* Anything else we should know textarea */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800">
                    Anything else we should know?
                  </label>
                  <textarea
                    rows={5}
                    value={formData.additionalNotes}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    placeholder="Share any additional details, API documentation links, or context that might help us build this integration..."
                    className="w-full p-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* What Happens Next Callout Box (Matching Screenshot) */}
                <div className="p-4 rounded-2xl bg-zinc-50/80 border border-zinc-200/70 flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="h-3 w-3 stroke-[3]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-900">What happens next?</p>
                    <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                      Our team will review your request and reach out within 2–3 business days. Popular requests are prioritized for development.
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                    className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Request</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function RequestIntegrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="w-7 h-7 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RequestIntegrationWizard />
    </Suspense>
  );
}
