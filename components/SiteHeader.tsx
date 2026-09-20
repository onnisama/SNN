"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FlaskConical, Code2, Library, ListTree, Menu, X } from "lucide-react";
import { useCourseProgress } from "./CourseProgress";
import { useEffect, useState } from "react";

const links = [
  { href: "/", label: "学习路径", icon: BookOpen },
  { href: "/labs/", label: "交互实验", icon: FlaskConical },
  { href: "/code-lab/", label: "代码实验", icon: Code2 },
  { href: "/papers/", label: "论文库", icon: Library },
  { href: "/glossary/", label: "术语表", icon: ListTree },
];

export function SiteHeader() {
  const path = usePathname();
  const { percent } = useCourseProgress();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="返回课程首页">
        <span className="brand-mark">S</span>
        <span>SNN Foundations <small>FOUNDATION COURSE</small></span>
      </Link>
      <nav id="main-navigation" aria-label="主导航" className={open ? "open" : ""}>
        {links.map(({ href, label, icon: Icon }) => (
          <Link onClick={() => setOpen(false)} key={href} href={href} aria-current={path === href || (href !== "/" && path.startsWith(href)) ? "page" : undefined} className={path === href || (href !== "/" && path.startsWith(href)) ? "active" : ""}>
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="header-progress" role="progressbar" aria-label="课程进度" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
        <span>PROGRESS {percent}%</span>
      </div>
      <button className="menu-button" aria-label={open ? "关闭菜单" : "打开菜单"} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={19} aria-hidden="true"/> : <Menu size={19} aria-hidden="true"/>}</button>
    </header>
  );
}
