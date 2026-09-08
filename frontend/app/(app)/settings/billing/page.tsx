"use client";

import React, { useState } from "react";
import { useBilling } from "@/hooks/useWhatsApp";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import {
  CheckCircle2, CreditCard, Zap, Bot, Users, Phone,
  BarChart3, HardDrive, ExternalLink, Crown,
} from "lucide-react";
import { api } from "@/lib/api";

const PLAN_FEATURES: Record<string, string[]> = {
  starter:  ["1 WhatsApp connection", "500 AI conversations/mo", "1,000 automation runs/mo", "500 contacts", "1 team member", "1 GB storage"],
  business: ["3 WhatsApp connections", "2,500 AI conversations/mo", "10,000 automation runs/mo", "5,000 contacts", "5 team members", "10 GB storage"],
  pro:      ["10 WhatsApp connections", "10,000 AI conversations/mo", "50,000 automation runs/mo", "25,000 contacts", "15 team members", "50 GB storage"],
  agency:   ["Unlimited connections", "Unlimited AI conversations", "Unlimited automation runs", "Unlimited contacts", "Unlimited team members", "250 GB storage"],
};

export default function BillingPage() {
  const { subscription, plans, usage, loading } = useBilling();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const [openingPortal, setOpeningPortal] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setCheckingOut(planId);
    const res = await api.post<{ checkout_url: string }>("/billing/checkout", {
      plan_id: planId,
      billing_period: billingPeriod,
    });
    setCheckingOut(null);
    if (res.success && res.data?.checkout_url) {
      window.location.href = res.data.checkout_url;
    }
  };

  const handlePortal = async () => {
    setOpeningPortal(true);
    const res = await api.post<{ portal_url: string }>("/billing/portal");
    setOpeningPortal(false);
    if (res.success && res.data?.portal_url) {
      window.open(res.data.portal_url, "_blank");
    }
  };

  const usageMetrics = [
    { key: "ai_requests",      label: "AI Conversations",  icon: Bot,      limitKey: "ai_conversations" },
    { key: "automation_runs",  label: "Automation Runs",   icon: Zap,      limitKey: "automation_runs" },
    { key: "messages_sent",    label: "Messages Sent",     icon: Phone,    limitKey: "messages" },
    { key: "storage_bytes",    label: "Storage",           icon: HardDrive, limitKey: "storage_gb" },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Billing & Subscription</h1>
        <p className="text-xs text-zinc-500 mt-0.5">Manage your plan, usage, and payment details</p>
      </div>

      {/* Current plan */}
      {!loading && subscription && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Current Plan</CardTitle>
              {subscription.stripe_customer_id && (
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={openingPortal}
                  onClick={handlePortal}
                  className="gap-1.5 text-xs"
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  Manage Billing
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center">
                <Crown className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <p className="text-lg font-bold text-zinc-900">{subscription.plan_name || "Free"} Plan</p>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    subscription.status === "active" ? "success" :
                    subscription.status === "trialing" ? "warning" :
                    subscription.status === "past_due" ? "destructive" : "secondary"
                  }>
                    {subscription.status === "trialing" ? "Free Trial" : subscription.status || "No subscription"}
                  </Badge>
                  {subscription.price_monthly > 0 && (
                    <span className="text-sm text-zinc-600">
                      {formatCurrency(subscription.price_monthly)}/month
                    </span>
                  )}
                </div>
                {subscription.current_period_end && (
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {subscription.cancel_at_period_end
                      ? `Cancels on ${formatDate(subscription.current_period_end)}`
                      : `Renews ${formatDate(subscription.current_period_end)}`}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Usage */}
      {!loading && usage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">Usage This Month</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 gap-4">
              {usageMetrics.map((metric) => {
                const used = usage.usage?.[metric.key] ?? 0;
                const limit = subscription?.limits?.[metric.limitKey];
                const pct = limit ? Math.min((used / limit) * 100, 100) : 0;
                const Icon = metric.icon;
                return (
                  <div key={metric.key} className="p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className="h-4 w-4 text-zinc-500" />
                      <span className="text-xs font-medium text-zinc-700">{metric.label}</span>
                    </div>
                    <p className="text-lg font-bold text-zinc-900">
                      {metric.key === "storage_bytes" ? `${(used / 1e9).toFixed(1)} GB` : used.toLocaleString()}
                    </p>
                    {limit && (
                      <>
                        <div className="mt-2 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all", pct > 80 ? "bg-red-500" : "bg-rose-500")}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-zinc-400 mt-1">
                          of {limit.toLocaleString()} limit
                        </p>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-zinc-900">Available Plans</h2>
          <div className="flex bg-zinc-100 rounded-lg p-1">
            {(["monthly", "yearly"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setBillingPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  billingPeriod === p ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
                )}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
                {p === "yearly" && <span className="ml-1 text-emerald-600">−20%</span>}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-zinc-200 rounded-xl p-5 animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan: any) => {
              const isCurrentPlan = subscription?.plan_slug === plan.slug;
              const features = PLAN_FEATURES[plan.slug] || [];
              const price = billingPeriod === "yearly" ? plan.price_yearly : plan.price_monthly;
              const isPopular = plan.slug === "business";
              return (
                <div
                  key={plan.id}
                  className={cn(
                    "relative rounded-xl border p-5 flex flex-col",
                    isPopular ? "border-rose-400 shadow-md" : "border-zinc-200 bg-white",
                    isCurrentPlan && "bg-rose-50/30"
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
                      <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        POPULAR
                      </span>
                    </div>
                  )}
                  <div className="mb-3">
                    <p className="text-sm font-bold text-zinc-900">{plan.name}</p>
                    <div className="mt-1">
                      <span className="text-2xl font-bold text-zinc-900">${price}</span>
                      <span className="text-xs text-zinc-400">/mo</span>
                    </div>
                    {billingPeriod === "yearly" && (
                      <p className="text-[10px] text-emerald-600">billed ${(price * 12).toFixed(0)}/year</p>
                    )}
                  </div>
                  <ul className="space-y-1.5 flex-1 mb-4">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-[11px] text-zinc-600">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="sm"
                    variant={isCurrentPlan ? "outline" : isPopular ? "primary" : "outline"}
                    isLoading={checkingOut === plan.id}
                    disabled={isCurrentPlan}
                    onClick={() => handleUpgrade(plan.id)}
                    className="w-full text-xs"
                  >
                    {isCurrentPlan ? "Current Plan" : "Upgrade"}
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
