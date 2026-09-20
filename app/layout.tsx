import type { Metadata, Viewport } from "next";
import "katex/dist/katex.min.css";
import "./globals.css";
import { CourseProgressProvider } from "@/components/CourseProgress";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "SNN Foundations｜中文交互式课程",
  description: "从 LIF、Surrogate Gradient、BPTT 到事件视觉与 Spiking Transformer 的中文交互式 SNN 基础课程。",
};

export const viewport: Viewport = {
  themeColor: "#f2f0e9",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <CourseProgressProvider>
          <a className="skip-link" href="#main-content">跳到正文</a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <footer className="site-footer">
            <span>SNN Foundations</span>
            <span>课程内容不把理论操作量等同于真实硬件能耗。</span>
          </footer>
        </CourseProgressProvider>
      </body>
    </html>
  );
}
