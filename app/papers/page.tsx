import { PapersLibrary } from "@/components/PapersLibrary";
import { papers } from "@/data/papers";

export default function PapersPage() {
  return <div className="page-shell">
    <header className="content-header">
      <span className="big-number">{papers.length}</span>
      <div><h1>Paper Library</h1><p>精选、核验、按学习价值分级；Essential / Recommended / Optional 不是论文质量排名。</p></div>
      <div className="meta-stack"><div>PRIMARY SOURCES</div><div>UPDATED 2026-09</div></div>
    </header>
    <section>
      <div className="section-head"><span className="folio">MAP</span><h2>Research Landscape</h2><p>点击节点筛选论文；从机制、训练到架构与硬件形成一张可走的地图。</p></div>
      <div className="research-map">
        <a className="map-node root" href="#library"><b>SNN</b><span>state · spike · time</span></a>
        {["Foundations","Training","Neuron Dynamics","Architecture","Conversion","Transformer","Event Vision","Hardware"].map((name,i)=><a className="map-node" href={`#library`} key={name}><b>{name}</b><span>{["LIF · surrogate","BPTT · online","learnable state","ResNet · parallel","ANN → SNN","attention · mixer","stream · voxel","Loihi · SpiNNaker"][i]}</span></a>)}
      </div>
    </section>
    <PapersLibrary />
    <div className="callout" style={{margin:"30px 0 80px"}}>
      <b>核验与 CCF 说明</b>
      <p>题名、作者、年份、venue 与链接均指向论文官方页面、出版社页面或会议 proceedings；代码链接仅在论文页或作者仓库可确认时提供。CCF 等级按中国计算机学会当前在线目录映射到 venue；未列入目录的 venue 标记“暂无 CCF 等级”，不做推断。</p>
      <a href="https://www.ccf.org.cn/Academic_Evaluation/AI/" target="_blank" rel="noreferrer" style={{textDecoration:"underline"}}>查看 CCF 人工智能目录 ↗</a>
    </div>
  </div>;
}
