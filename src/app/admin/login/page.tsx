"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import { Lock, Mail, ArrowRight } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        // Redirect to admin projects or dashboard
        router.push("/admin/projects");
      } else {
        setError(res.error || "로그인에 실패했습니다.");
      }
    } catch (err) {
      const error = err as Error;
      setError(error?.message || "알 수 없는 에러가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl space-y-6">
      {/* Title */}
      <div className="space-y-2 text-center">
        <span className="text-[10px] font-bold tracking-widest text-accent uppercase">
          NEXUS PORTFOLIO CMS
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight">관리자 로그인</h1>
        <p className="text-xs text-neutral-400 font-light">
          등록된 어드민 메일과 패스워드로 로그인해 주세요.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/20 border border-red-800 rounded-lg text-xs text-red-300 font-medium">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
            <Mail className="h-3.5 w-3.5" />
            이메일 주소
          </label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@team.com"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase flex items-center gap-1">
            <Lock className="h-3.5 w-3.5" />
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-accent hover:bg-blue-700 text-white font-bold text-xs tracking-widest py-3.5 rounded-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer uppercase"
        >
          {isSubmitting ? "LOGGING IN..." : "LOGIN"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {/* Notice */}
      <div className="pt-2 border-t border-neutral-800/80 text-center">
        <p className="text-[10px] text-neutral-500 font-light leading-relaxed">
          로컬 데모 계정 정보: <br />
          <strong className="text-neutral-400">admin@team.com</strong> / <strong className="text-neutral-400">admin1234</strong>
        </p>
      </div>
    </div>
  );
}
