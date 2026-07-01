"use client";

import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "@/lib/db";
import { Settings } from "@/lib/types";
import { DEFAULT_SETTINGS } from "@/lib/mockData";
import { Save, CheckCircle, Globe, Mail } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings in editor:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      await updateSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000); // clear after 4s
    } catch (err) {
      const error = err as Error;
      alert("설정 저장에 실패했습니다: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        <span className="text-xs font-bold tracking-widest text-neutral-400">RETRIEVING PROPERTIES...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
            CMS PREFERENCES
          </span>
          <h1 className="text-2xl font-black text-white tracking-tight">전역 사이트 설정</h1>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/20 border border-emerald-800 rounded-xl text-xs text-emerald-400 font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4" />
          사이트 설정 정보가 성공적으로 반영되었습니다.
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form inputs (Columns: 8) */}
        <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
          {/* Site Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
              사이트 타이틀 (Site Title)
            </label>
            <input
              type="text"
              name="site_title"
              value={settings.site_title}
              onChange={handleChange}
              placeholder="NEXUS Creative Team"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
            />
          </div>

          {/* Site Description */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
              사이트 설명 (Site Description)
            </label>
            <textarea
              name="site_description"
              rows={3}
              value={settings.site_description}
              onChange={handleChange}
              placeholder="브랜딩 및 비디오 에디팅 포트폴리오 사이트"
              className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none leading-relaxed"
            />
          </div>

          {/* Hero Section Banner Texts */}
          <div className="border-t border-neutral-800 pt-6 space-y-6">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-neutral-500" />
              메인 홈 히어로 텍스트 편집
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
                히어로 대형 타이틀
              </label>
              <input
                type="text"
                name="hero_title"
                value={settings.hero_title}
                onChange={handleChange}
                placeholder="We Shape Ideas Into Impactful Visual Stories."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
                히어로 서브 설명문구
              </label>
              <textarea
                name="hero_subtitle"
                rows={3}
                value={settings.hero_subtitle}
                onChange={handleChange}
                placeholder="넥서스는 브랜드 가치를 시각적으로 도출합니다."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Info Panels (Columns: 4) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Contacts & Social Networks */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl space-y-5">
            <h3 className="text-xs font-bold text-white tracking-wide uppercase border-b border-neutral-800 pb-3 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-neutral-500" />
              문의처 & SNS 채널 관리
            </h3>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
                대표 문의 이메일
              </label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                placeholder="contact@nexus.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
                인스타그램 프로필 주소
              </label>
              <input
                type="text"
                name="instagram_url"
                value={settings.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase block">
                비핸스 포트폴리오 주소
              </label>
              <input
                type="text"
                name="behance_url"
                value={settings.behance_url}
                onChange={handleChange}
                placeholder="https://behance.net/..."
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-accent"
              />
            </div>
          </div>

          {/* Action Trigger Box */}
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl space-y-4">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-accent hover:bg-blue-700 text-white font-bold text-xs tracking-widest py-3.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {isSaving ? "저장 중..." : "설정 저장하기"}
            </button>
            <p className="text-[8px] text-neutral-500 leading-normal text-center">
              저장을 완료하면 푸터 정보 및 첫 로딩 화면 등의 구성요소가 동적으로 즉각 갱신됩니다.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
