"use client";

import { useEffect, useState } from "react";
import { getSettings } from "@/lib/db";
import { Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/mockData";
import { Mail, ExternalLink, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load contact settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API Network Request delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Save inquiry to localStorage (Demo persistence)
    const localInquiries = JSON.parse(localStorage.getItem("nexus_inquiries") || "[]");
    localInquiries.push({
      ...formData,
      id: `inq-${Date.now()}`,
      created_at: new Date().toISOString(),
    });
    localStorage.setItem("nexus_inquiries", JSON.stringify(localInquiries));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });

    // Auto-clear success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 sm:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Left Side: Contact Information */}
        <div className="lg:col-span-5 space-y-12">
          <div className="space-y-4">
            <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
              TALK TO US
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              브랜드의 새로운 도약을 함께 준비합니다.
            </h1>
            <p className="text-sm sm:text-base text-neutral-500 font-light leading-relaxed">
              신규 프로젝트 의뢰, 예산별 가견적 분석, 단기 에디팅 아웃소싱 파트너십 제안 등 어떤 문의든 환영합니다.
            </p>
          </div>

          <div className="space-y-6 pt-6 border-t border-border">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-card-bg rounded-lg">
                <Mail className="h-5 w-5 text-neutral-600" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 block uppercase">
                  DIRECT EMAIL
                </span>
                <a
                  href={`mailto:${settings.contact_email}`}
                  className="text-base font-bold text-foreground hover:text-accent transition-colors"
                >
                  {settings.contact_email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-card-bg rounded-lg">
                <svg className="h-5 w-5 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 block uppercase">
                  INSTAGRAM
                </span>
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-foreground hover:text-accent flex items-center gap-1 transition-colors"
                >
                  Instagram Feed
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-card-bg rounded-lg">
                <svg className="h-5 w-5 text-neutral-600 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
                </svg>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold tracking-widest text-neutral-400 block uppercase">
                  BEHANCE PORTFOLIO
                </span>
                <a
                  href={settings.behance_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-foreground hover:text-accent flex items-center gap-1 transition-colors"
                >
                  Behance Profile
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-7 bg-card-bg border border-border p-8 sm:p-10 rounded-xl relative overflow-hidden">
          {isSubmitted && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 z-10 animate-fade-in">
              <CheckCircle className="h-14 w-14 text-accent mb-4" />
              <h3 className="text-xl font-bold tracking-tight mb-2">문의가 접수되었습니다</h3>
              <p className="text-sm text-neutral-500 max-w-sm font-light leading-relaxed">
                성공적으로 송신 완료되었습니다. 기재해주신 이메일 주소로 검토 후 영업일 기준 48시간 이내에 답신드리겠습니다.
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold tracking-tight">프로젝트 의뢰 폼</h2>
              <p className="text-xs text-neutral-400 font-light">빠르고 정확한 피드백을 위해 꼼꼼히 작성해 주세요.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    담당자명 / 회사명 *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="홍길동 (넥서스 주식회사)"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                    회신받을 이메일 *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="yourname@domain.com"
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  문의 목적 / 제목 *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="2026 브랜드 패션 필름 비디오 에디팅 의뢰 건"
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="message" className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                  의뢰 예산 / 세부 상세 설명 *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="예산 범위, 핵심 일정 가이드라인, 구체적인 작업 분량 및 선호 스타일 등을 함께 기재해주시면 더 디테일한 제안이 가능합니다."
                  className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-foreground text-background font-bold text-xs tracking-widest py-4 rounded-lg transition-transform hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed uppercase"
              >
                {isSubmitting ? "SENDING..." : "SEND INQUIRY"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
