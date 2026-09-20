import type { DeepDive } from "@/data/deepDives";

export function ChapterDeepDive({ items }: { items: DeepDive[] }) {
  return <div className="deep-dive-list">
    {items.map((item, index) => <article className="deep-dive" key={item.title}>
      <div className="deep-dive-index">{String(index + 1).padStart(2, "0")}</div>
      <div>
        <h3>{item.title}</h3>
        <p>{item.body}</p>
        {item.bullets && <ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}
        {item.takeaway && <div className="deep-dive-takeaway"><b>带走这一点</b>{item.takeaway}</div>}
      </div>
    </article>)}
  </div>;
}
