import React from "react";
import Link from "next/link";
import { Play } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-zinc-200/80 shadow-xs text-xs font-semibold text-zinc-700">
          Testimonials
        </div>
        <h2
          className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-normal leading-[1.05] max-w-4xl mx-auto font-outfit"
          style={{ letterSpacing: "-2px", fontWeight: 400 }}
        >
          <span className="block text-zinc-950 font-normal">
            Loved by creators,
          </span>
          <span className="block text-[#9ca3af] mt-1 sm:mt-1.5 font-normal">
            founders &amp; agency leaders.
          </span>
        </h2>
      </div>

      {/* Masonry-style Grid of Testimonials */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto text-left">
        {/* Card 1 */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            "The 1-tap WhatsApp Status bridge completely transformed how I distribute my newsletter on penna.dev. I never have to manually copy, paste, and reformat on my phone again."
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
              PO
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Precious Okon</div>
              <div className="text-[11px] text-zinc-400">Founder @ penna.dev</div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            "Posting daily portfolio designs at 7:00 AM sharp without having to wake up early changed my business. Clients think I never sleep. It influenced inquiries so heavily my retainer booked out."
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
              SW
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Shola W.</div>
              <div className="text-[11px] text-zinc-400">Freelance Brand Designer</div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            "Running developer groups with over 3,000 members used to be a full-time moderation nightmare. JidoSapp's spam filter deletes scam links in seconds and boots repeat offenders instantly."
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
              MJ
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Michael J.</div>
              <div className="text-[11px] text-zinc-400">Community Director</div>
            </div>
          </div>
        </div>

        {/* Card 4 */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            "The 24/7 auto-responder answers high-intent client inquiries at 2:00 AM with our rate card and Calendly link. We captured $14,000 in retainers from leads who would have moved on."
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
              DT
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Daniela T.</div>
              <div className="text-[11px] text-zinc-400">Agency Director</div>
            </div>
          </div>
        </div>

        {/* Card 5 */}
        <div className="rounded-3xl border border-zinc-200/80 bg-white p-7 space-y-6 shadow-xs flex flex-col justify-between">
          <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal">
            "Getting our own dedicated subdomain on jidosaap.xyz meant zero bot collisions and pure isolated webhooks. The architecture is enterprise grade."
          </p>
          <div className="flex items-center gap-3 pt-2 border-t border-zinc-100">
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 font-bold flex items-center justify-center text-xs">
              AM
            </div>
            <div>
              <div className="text-xs font-bold text-zinc-900">Alex M.</div>
              <div className="text-[11px] text-zinc-400">Full-Stack Lead</div>
            </div>
          </div>
        </div>

        {/* Card 6: Video Testimonial Card with YouTube Squircle */}
        <div className="rounded-3xl border border-zinc-200/80 bg-zinc-900 text-white p-7 space-y-6 shadow-md flex flex-col justify-between relative overflow-hidden">
          {/* Floating YouTube Badge */}
          <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center shadow-md">
            <Play className="h-5 w-5 fill-white" />
          </div>
          <div className="space-y-2 pt-6">
            <div className="text-xs font-bold text-emerald-400 font-mono">CASE STUDY VIDEO</div>
            <h4 className="text-base font-bold text-white">How Shola 3x'd his client conversions</h4>
            <p className="text-xs text-zinc-400">Watch the 2-minute walkthrough of the 7:00 AM consistency engine.</p>
          </div>
          <Link href="/request-integration">
            <button className="h-9 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white border border-white/20 transition-all">
              Watch video review
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
