"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, FlaskConical, Code2, Library, ListTree } from "lucide-react";
import { useCourseProgress } from "./CourseProgress";

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
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="返回课程首页">
        <span className="brand-mark">S</span>
        <span>SNN Foundations</span>
      </Link>
      <nav aria-label="主导航">
        {links.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} className={path === href || (href !== "/" && path.startsWith(href)) ? "active" : ""}>
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
      <div className="header-progress" aria-label={`课程进度 ${percent}%`}>
        <span>{percent}%</span>
        <i><b style={{ width: `${percent}%` }} /></i>
      </div>
    </header>
  );
}
