"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Send,
  ChevronRight,
  Bot,
  ShieldAlert,
  Newspaper,
  Clock,
  Plug,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type Step = 1 | 2 | 3 | 4;

type GoalType =
  | "auto_responder"
  | "group_buddy"
  | "newsletter_bridge"
  | "scheduled_drops"
  | "app_tool"
  | "custom";

interface FormData {
  goal: GoalType;
  primaryName: string;
  websiteOrLink: string;
  category: string;
  contactEmail: string;

  // Step 2: Use Case & Requirements
  useCaseDescription: string;
  desiredFeatures: string;

  // Step 3: Priority & Impact
  importance: "nice_to_have" | "medium" | "high" | "critical";
  userBenefitRange: string;

  // Step 4: Additional Information
  additionalNotes: string;
}

const GOAL_OPTIONS: Array<{
  id: GoalType;
  title: string;
  badge: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  primaryLabel: string;
  primaryPlaceholder: string;
  linkLabel: string;
  linkPlaceholder: string;
  defaultCategory: string;
  defaultPrompt: string;
}> = [
  {
    id: "auto_responder",
    title: "24/7 AI Auto-Responder",
    badge: "Most Popular",
    description: "Instant replies to customer pricing, FAQs, catalogs & Cal.com bookings at 2:00 AM.",
    icon: Bot,
    color: "text-[#2563eb] bg-blue-50 border-blue-200",
    primaryLabel: "Business, Agency, or Brand Name",
    primaryPlaceholder: "e.g. Onos Creative Studio, Nova Dental Clinic",
    linkLabel: "Business Website or Portfolio (Optional)",
    linkPlaceholder: "https://yourbrand.com",
    defaultCategory: "Direct Messaging & WhatsApp APIs",
    defaultPrompt: "We want JidoSapp to automatically respond to customer inquiries on WhatsApp with instant answers, dynamic tier pricing, and a Cal.com booking link.",
  },
  {
    id: "group_buddy",
    title: "Group Buddy (Anti-Spam Sentinel)",
    badge: "Community Shield",
    description: "Scan messages in real time, auto-delete scam/crypto links, issue strikes, and exit offenders.",
    icon: ShieldAlert,
    color: "text-emerald-700 bg-emerald-50 border-emerald-200",
    primaryLabel: "WhatsApp Group Name or Community Topic",
    primaryPlaceholder: "e.g. Frontend Developers Hub, Tech Founders VIP",
    linkLabel: "Group Invite Link or Website (Optional)",
    linkPlaceholder: "https://chat.whatsapp.com/...",
    defaultCategory: "Direct Messaging & WhatsApp APIs",
    defaultPrompt: "We manage high-traffic WhatsApp groups and need JidoSapp Group Buddy to delete unauthorized telegram/crypto invite links and enforce a 2-strike auto-exit rule.",
  },
  {
    id: "newsletter_bridge",
    title: "Newsletter-to-Status Bridge",
    badge: "1-Tap Story Bridge",
    description: "Publish your essays or newsletters (Penna, Substack, custom CMS) straight to WhatsApp Status in 1 tap.",
    icon: Newspaper,
    color: "text-indigo-700 bg-indigo-50 border-indigo-200",
    primaryLabel: "Newsletter or Publication Name",
    primaryPlaceholder: "e.g. Tech Essays by Precious, Product Notes",
    linkLabel: "Newsletter Link (e.g. Penna, Substack, Blog)",
    linkPlaceholder: "https://penna.dev/yourname or your publication",
    defaultCategory: "AI & Docs / Newsletter",
    defaultPrompt: "When a new article is published on our newsletter (Penna, Substack, or CMS), bridge the formatted headline and tracked read link directly to WhatsApp Status.",
  },
  {
    id: "scheduled_drops",
    title: "7:00 AM Scheduled Drops",
    badge: "Consistency Engine",
    description: "Queue portfolio showcases & broadcast campaigns in advance to drop daily at 7:00 AM sharp.",
    icon: Clock,
    color: "text-amber-700 bg-amber-50 border-amber-200",
    primaryLabel: "Creator, Brand, or Portfolio Name",
    primaryPlaceholder: "e.g. Shola Visuals, Daily Motion Drops",
    linkLabel: "Portfolio or Social Link (Optional)",
    linkPlaceholder: "https://behance.net/yourprofile",
    defaultCategory: "Scheduling & Calendars",
    defaultPrompt: "We want to queue our graphic design portfolio showcases in advance and have JidoSapp broadcast them to WhatsApp Status every morning at 7:00 AM sharp.",
  },
  {
    id: "app_tool",
    title: "Connect App / SaaS Tool",
    badge: "Tool Integration",
    description: "Connect Penna, Proforms, HubSpot, Stripe, Notion, Slack, Zendesk, or custom REST APIs.",
    icon: Plug,
    color: "text-purple-700 bg-purple-50 border-purple-200",
    primaryLabel: "Application or SaaS Tool Name",
    primaryPlaceholder: "e.g. Penna, Proforms, HubSpot, Stripe, Notion",
    linkLabel: "Application Website or API Docs (Optional)",
    linkPlaceholder: "https://...",
    defaultCategory: "Other / Developer Tooling",
    defaultPrompt: "We want bi-directional sync between this application and our dedicated JidoSapp WhatsApp Cloud API instance for automated alerts and customer workflows.",
  },
  {
    id: "custom",
    title: "Custom WhatsApp Autonomous Bot",
    badge: "Tailor-Made",
    description: "Have a unique workflow? Tell us your goal and our engineers will build your dedicated instance.",
    icon: Workflow,
    color: "text-cyan-700 bg-cyan-50 border-cyan-200",
    primaryLabel: "Project or Bot Name",
    primaryPlaceholder: "e.g. VIP Concierge & Booking Engine",
    linkLabel: "Project Reference or System Link (Optional)",
    linkPlaceholder: "https://...",
    defaultCategory: "Custom Webhooks & REST Endpoints",
    defaultPrompt: "We have custom business requirements for our WhatsApp Cloud API automation pipeline.",
  },
];

const CATEGORIES = [
  "Direct Messaging & WhatsApp APIs",
  "AI & Docs / Newsletter",
  "Forms & Surveys (Proforms, Typeform)",
  "CRM & Pipelines (HubSpot, Salesforce)",
  "Scheduling & Calendars (Cal.com, Calendly)",
  "Billing & Invoicing (Stripe, Paystack)",
  "Internal Comms (Slack, Discord)",
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
  const searchParams = useSearchParams();

  const [currentStep, setCurrentStep] = useState<Step>(1);

  const initialUseCase = searchParams?.get("use_case");
  const initialTool = searchParams?.get("tool");

  let initialGoal: GoalType = "auto_responder";
  let initialPrimaryName = "";

  if (initialUseCase === "group_spam_guardian" || initialUseCase === "group_buddy") {
    initialGoal = "group_buddy";
  } else if (initialUseCase === "newsletter_bridge") {
    initialGoal = "newsletter_bridge";
  } else if (initialUseCase === "graphic_scheduler" || initialUseCase === "scheduled_drops") {
    initialGoal = "scheduled_drops";
  } else if (initialUseCase === "custom") {
    initialGoal = "custom";
  } else if (initialTool) {
    initialGoal = "app_tool";
    initialPrimaryName = initialTool.charAt(0).toUpperCase() + initialTool.slice(1);
  }

  const selectedGoalMeta = GOAL_OPTIONS.find((g) => g.id === initialGoal) || GOAL_OPTIONS[0];

  const [formData, setFormData] = useState<FormData>({
    goal: initialGoal,
    primaryName: initialPrimaryName,
    websiteOrLink: "",
    category: selectedGoalMeta.defaultCategory,
    contactEmail: user?.email || "",
    useCaseDescription: selectedGoalMeta.defaultPrompt,
    desiredFeatures: "",
    importance: "high",
    userBenefitRange: "2 - 10 team members",
    additionalNotes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");

  // Keep goal and fields in sync when goal changes
  const handleSelectGoal = (goalId: GoalType) => {
    const meta = GOAL_OPTIONS.find((g) => g.id === goalId) || GOAL_OPTIONS[0];
    setFormData((prev) => ({
      ...prev,
      goal: goalId,
      category: meta.defaultCategory,
      useCaseDescription: meta.defaultPrompt,
    }));
    if (errors.primaryName) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.primaryName;
        return next;
      });
    }
  };

  const currentGoalMeta = GOAL_OPTIONS.find((g) => g.id === formData.goal) || GOAL_OPTIONS[0];

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
      if (!formData.primaryName.trim()) {
        newErrors.primaryName = `${currentGoalMeta.primaryLabel} is required.`;
      }
      if (!formData.contactEmail.trim() || !formData.contactEmail.includes("@")) {
        newErrors.contactEmail = "Please enter a valid email for setup updates.";
      }
    } else if (step === 2) {
      if (!formData.useCaseDescription.trim()) {
        newErrors.useCaseDescription = "Please describe what you want this automation to accomplish.";
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
        goal: formData.goal,
        name: formData.primaryName,
        website: formData.websiteOrLink,
        category: formData.category,
        contact_email: formData.contactEmail,
        use_case: formData.useCaseDescription,
        desired_features: formData.desiredFeatures,
        priority: formData.importance,
        user_impact: formData.userBenefitRange,
        notes: formData.additionalNotes,
      };

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

  // Keyboard shortcut: Press Enter to proceed to next step
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      if ((e.target as HTMLElement).tagName !== "TEXTAREA") {
        e.preventDefault();
        if (currentStep < 4) {
          handleNext();
        } else {
          handleSubmit();
        }
      }
    }
  };

  const stepsMeta = [
    { number: 1, label: "Step 1", title: "Select Setup & Details" },
    { number: 2, label: "Step 2", title: "Use Case & Rules" },
    { number: 3, label: "Step 3", title: "Priority & Impact" },
    { number: 4, label: "Final", title: "Review & Submit" },
  ];

  return (
    <div
      onKeyDown={handleKeyDown}
      className="w-full max-w-[1140px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 font-outfit"
    >
      {/* ── BREADCRUMB & TOP HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-zinc-400 mb-2">
            <Link href="/" className="hover:text-zinc-600 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-zinc-300" />
            <span className="text-zinc-700 font-semibold">Request Setup &amp; Automation</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-950 font-outfit">
            Set Up Your WhatsApp Superpower
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-1 font-outfit">
            Whether you want Group Buddy, 24/7 Auto-Responder, Newsletter Status Bridge, or a SaaS integration.
          </p>
        </div>

        {/* Right CTA */}
        <div className="flex items-center gap-3">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-[#2563eb] text-xs font-semibold shadow-2xs hover:bg-blue-100/70 transition-all font-outfit"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Explore Live Use Cases</span>
          </Link>
        </div>
      </div>

      {/* ── STEPPER PROGRESS INDICATOR ── */}
      <div className="max-w-2xl mx-auto mb-10 px-4">
        <div className="relative flex items-center justify-between">
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
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 border-2 font-mono",
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

                <span
                  className={cn(
                    "mt-2 text-xs font-semibold tracking-tight transition-colors font-outfit",
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
              <h2 className="text-2xl font-bold tracking-tight text-zinc-950 pt-2 font-outfit">
                Automation Request Received!
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed font-outfit">
                Thank you! Our automation engineers have received your request for{" "}
                <span className="font-semibold text-zinc-900">{formData.primaryName}</span> ({currentGoalMeta.title}). We will reach out to{" "}
                <span className="font-semibold text-zinc-900">{formData.contactEmail}</span> with your subdomain setup details.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/dashboard"
                className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center justify-center transition-all font-outfit"
              >
                Go to Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  setFormData({
                    goal: "auto_responder",
                    primaryName: "",
                    websiteOrLink: "",
                    category: GOAL_OPTIONS[0].defaultCategory,
                    contactEmail: user?.email || "",
                    useCaseDescription: GOAL_OPTIONS[0].defaultPrompt,
                    desiredFeatures: "",
                    importance: "high",
                    userBenefitRange: "2 - 10 team members",
                    additionalNotes: "",
                  });
                }}
                className="h-10 px-5 rounded-xl bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold hover:bg-zinc-50 transition-all font-outfit"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep < 4) handleNext();
              else handleSubmit();
            }}
          >
            {/* ── STEP 1: GOAL SELECTOR & CONTEXTUAL DETAILS ── */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 font-outfit">
                    1. What would you like to build or automate?
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-outfit">
                    Pick your superpower below. The form adapts automatically.
                  </p>
                </div>

                {/* 6 Grid Tiles for Use Case Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {GOAL_OPTIONS.map((opt) => {
                    const Icon = opt.icon;
                    const isSelected = formData.goal === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleSelectGoal(opt.id)}
                        className={cn(
                          "p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-2 relative",
                          isSelected
                            ? "border-[#2563eb] bg-blue-50/50 shadow-xs ring-1 ring-[#2563eb]"
                            : "border-zinc-200/80 bg-white hover:border-zinc-300 hover:bg-zinc-50/40"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className={cn("p-2 rounded-xl border flex items-center justify-center", opt.color)}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className={cn(
                            "text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full font-outfit",
                            isSelected ? "bg-[#2563eb] text-white" : "bg-zinc-100 text-zinc-600"
                          )}>
                            {opt.badge}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-zinc-900 leading-snug font-outfit">
                            {opt.title}
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed font-outfit">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Contextual Input Fields based on Selected Goal */}
                <div className="pt-2 border-t border-zinc-100 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 uppercase tracking-wider font-outfit">
                      2. Details for {currentGoalMeta.title}
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Primary Name Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800 flex items-center justify-between font-outfit">
                        <span>
                          {currentGoalMeta.primaryLabel} <span className="text-[#2563eb]">*</span>
                        </span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.primaryName}
                        onChange={(e) => updateField("primaryName", e.target.value)}
                        placeholder={currentGoalMeta.primaryPlaceholder}
                        className={cn(
                          "w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all font-outfit",
                          errors.primaryName ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]"
                        )}
                      />
                      {errors.primaryName && (
                        <p className="text-[11px] text-red-600 font-medium font-outfit">{errors.primaryName}</p>
                      )}
                    </div>

                    {/* Secondary Link / Reference Field */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800 font-outfit">
                        {currentGoalMeta.linkLabel}
                      </label>
                      <input
                        type="text"
                        value={formData.websiteOrLink}
                        onChange={(e) => updateField("websiteOrLink", e.target.value)}
                        placeholder={currentGoalMeta.linkPlaceholder}
                        className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all font-outfit"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Category Selection */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800 font-outfit">
                        Workflow Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all cursor-pointer font-outfit"
                      >
                        {CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Contact Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-800 font-outfit">
                        Your Contact Email <span className="text-[#2563eb]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        placeholder="you@company.com"
                        className={cn(
                          "w-full h-11 px-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all font-outfit",
                          errors.contactEmail ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]"
                        )}
                      />
                      {errors.contactEmail && (
                        <p className="text-[11px] text-red-600 font-medium font-outfit">{errors.contactEmail}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <Link
                    href="/solutions"
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center justify-center font-outfit"
                  >
                    Cancel
                  </Link>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium font-outfit">
                      Press Enter ↵ to continue
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98 font-outfit"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 2: USE CASE & REQUIREMENTS ── */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 font-outfit">
                    Use Case &amp; Automation Rules
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-outfit">
                    Describe how {formData.primaryName || currentGoalMeta.title} should operate in WhatsApp.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800 font-outfit">
                      How should this workflow work? <span className="text-[#2563eb]">*</span>
                    </label>
                    <textarea
                      rows={6}
                      value={formData.useCaseDescription}
                      onChange={(e) => updateField("useCaseDescription", e.target.value)}
                      placeholder="Describe what triggers the bot, what messages it sends, rules it enforces, or links it provides..."
                      className={cn(
                        "w-full p-3.5 rounded-xl border bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none leading-relaxed font-outfit",
                        errors.useCaseDescription ? "border-red-300 bg-red-50/20" : "border-zinc-200/90 focus:border-[#2563eb]"
                      )}
                    />
                    {errors.useCaseDescription && (
                      <p className="text-[11px] text-red-600 font-medium font-outfit">{errors.useCaseDescription}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-800 font-outfit">
                      Specific Features or Integrations Needed
                    </label>
                    <textarea
                      rows={6}
                      value={formData.desiredFeatures}
                      onChange={(e) => updateField("desiredFeatures", e.target.value)}
                      placeholder="e.g. Cal.com booking sync, Penna article webhook, Stripe checkout link, PDF brochure dispatch, auto-kick after 2 strikes..."
                      className="w-full p-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none leading-relaxed font-outfit"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-1.5 font-outfit"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium font-outfit">
                      Press Enter ↵ to continue
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98 font-outfit"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: PRIORITY & IMPACT ── */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 font-outfit">Priority &amp; Scale</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-outfit">
                    Help our engineering team size your dedicated subdomain and WhatsApp Cloud API infrastructure.
                  </p>
                </div>

                {/* Priority Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-zinc-800 font-outfit">
                    Priority Level <span className="text-[#2563eb]">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "medium", title: "Standard", desc: "Would improve our daily messaging response speed." },
                      { id: "high", title: "High Priority", desc: "Essential for core business operations and client retainers." },
                      { id: "critical", title: "Immediate / Critical", desc: "Urgent need to launch this week." },
                    ].map((p) => {
                      const isSelected = formData.importance === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => updateField("importance", p.id)}
                          className={cn(
                            "p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between space-y-1.5",
                            isSelected
                              ? "border-[#2563eb] bg-blue-50/50 shadow-xs ring-1 ring-[#2563eb]"
                              : "border-zinc-200/80 bg-white hover:border-zinc-300"
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-zinc-900 font-outfit">{p.title}</span>
                            <div className={cn(
                              "w-3.5 h-3.5 rounded-full border flex items-center justify-center",
                              isSelected ? "border-[#2563eb] bg-[#2563eb]" : "border-zinc-300"
                            )}>
                              {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-500 leading-relaxed font-outfit">
                            {p.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Team Scale */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-semibold text-zinc-800 font-outfit">
                    Target Team or Audience Size
                  </label>
                  <select
                    value={formData.userBenefitRange}
                    onChange={(e) => updateField("userBenefitRange", e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all cursor-pointer font-outfit"
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
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-1.5 font-outfit"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <span className="hidden sm:inline text-[11px] text-zinc-400 font-medium font-outfit">
                      Press Enter ↵ to continue
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98 font-outfit"
                    >
                      <span>Next</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 4: FINAL CONFIRMATION ── */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-950 font-outfit">Additional Information</h3>
                  <p className="text-xs text-zinc-400 mt-0.5 font-outfit">
                    Any specific webhook endpoints, sample JSON payloads, or timeline notes?
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-800 font-outfit">
                    Anything else we should know?
                  </label>
                  <textarea
                    rows={4}
                    value={formData.additionalNotes}
                    onChange={(e) => updateField("additionalNotes", e.target.value)}
                    placeholder="Share additional notes or preferred subdomain name (e.g. yourbrand.jidosaap.xyz)..."
                    className="w-full p-3.5 rounded-xl border border-zinc-200/90 bg-white text-xs font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 transition-all resize-none leading-relaxed font-outfit"
                  />
                </div>

                {/* Summary Pill Box */}
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium font-outfit">Setup Goal:</span>
                    <span className="font-bold text-[#2563eb] font-outfit">{currentGoalMeta.title}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium font-outfit">Target:</span>
                    <span className="font-bold text-zinc-900 font-outfit">{formData.primaryName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500 font-medium font-outfit">Notifications to:</span>
                    <span className="font-mono text-zinc-800">{formData.contactEmail}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-10 px-5 rounded-xl border border-zinc-200 text-xs font-semibold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-1.5 font-outfit"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-10 px-6 rounded-xl bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all active:scale-98 disabled:opacity-70 font-outfit"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Setup Request</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>
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
