"use client";

import { Wrench, Mail, Globe, ExternalLink, RefreshCw, ShieldAlert, Phone } from "lucide-react";
import type { Profile } from "@/lib/types";

interface MaintenancePageProps {
  profile?: Profile;
  settingsMap?: Record<string, string>;
}

export function MaintenancePage({ profile, settingsMap }: MaintenancePageProps) {
  const siteName = settingsMap?.site_name || profile?.name || "Bayu Purnomo";
  const ownerEmail = settingsMap?.owner_email || profile?.email || "bayupurnomo.dev@gmail.com";
  const githubUrl = settingsMap?.social_github || profile?.socials?.github || "https://github.com/bayupaths";
  const linkedinUrl = settingsMap?.social_linkedin || profile?.socials?.linkedin || "https://linkedin.com/in/bayupurnomo1710";
  const whatsappUrl = settingsMap?.social_whatsapp || profile?.socials?.whatsapp || "https://wa.me/628812785635";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-background text-foreground p-4 sm:p-6 lg:p-8 select-none">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-[120px] opacity-70 animate-pulse" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/15 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-border/80 glass-strong p-6 sm:p-10 shadow-2xl shadow-accent/5 transition-all duration-300">
        
        {/* Top Status Pill */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold text-accent-ink shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            <ShieldAlert size={14} className="text-accent-ink" />
            <span>PEMELIHARAAN SISTEM</span>
          </div>
        </div>

        {/* Animated Icon Badge */}
        <div className="flex justify-center mb-6">
          <div className="relative flex items-center justify-center h-20 w-20 rounded-2xl border border-accent/40 bg-accent/10 shadow-lg shadow-accent/10">
            <Wrench className="h-10 w-10 text-accent-ink animate-bounce" />
          </div>
        </div>

        {/* Headings */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Mode Pemeliharaan Aktif
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Halaman publik <span className="font-semibold text-foreground">{siteName}</span> sedang dalam pemeliharaan berkala untuk peningkatan sistem dan pembaruan performa.
          </p>
        </div>

        {/* Info Card Box */}
        <div className="rounded-2xl border border-border/80 bg-muted/30 p-4 sm:p-5 space-y-3 mb-8 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Status Website:</span>
            <span className="font-semibold text-accent-ink flex items-center gap-1.5">
              Under Maintenance Mode
            </span>
          </div>
          <div className="border-t border-border/60 pt-3 flex items-center justify-between">
            <span className="text-muted-foreground font-medium">Estimasi Selesai:</span>
            <span className="font-semibold text-foreground">Segera Kembali Online</span>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="space-y-4">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Butuh Bantuan Segera? Hubungi Admin
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {ownerEmail && (
              <a
                href={`mailto:${ownerEmail}`}
                className="flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-xs font-semibold text-foreground hover:border-accent/40 hover:bg-accent/10 hover:text-accent-ink transition-all duration-200"
              >
                <Mail size={14} className="text-accent-ink" />
                <span>Email</span>
              </a>
            )}

            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-xs font-semibold text-foreground hover:border-success/40 hover:bg-success/10 hover:text-success-ink transition-all duration-200"
              >
                <Phone size={14} className="text-success-ink" />
                <span>WhatsApp</span>
              </a>
            )}

            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-xs font-semibold text-foreground hover:border-accent/40 hover:bg-accent/10 hover:text-accent-ink transition-all duration-200"
              >
                <Globe size={14} />
                <span>GitHub</span>
              </a>
            )}

            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border glass px-3.5 py-2 text-xs font-semibold text-foreground hover:border-accent/40 hover:bg-accent/10 hover:text-accent-ink transition-all duration-200"
              >
                <ExternalLink size={14} />
                <span>LinkedIn</span>
              </a>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 pt-6 border-t border-border/60 flex flex-col items-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-xs font-semibold text-accent-fg hover:opacity-90 shadow-md shadow-accent/20 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            <RefreshCw size={14} />
            <span>Coba Muat Ulang Halaman</span>
          </button>
          
          <p className="text-[10px] text-muted-foreground font-mono">
            &copy; {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
}
