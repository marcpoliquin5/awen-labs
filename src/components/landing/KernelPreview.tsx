import Reveal, { SectionHeading } from "./Reveal";

const code = [
  ["c", "# Illustrative syntax: the kernel programming model is on the roadmap."],
  ["k", "import awen"],
  ["", ""],
  ["d", "@awen.kernel(target=\"photonic\")"],
  ["k", "def attention_scores(q: Tensor[\"n\", \"d\"], k: Tensor[\"m\", \"d\"]):"],
  ["c", "    # Matrix products run on the interferometer mesh;"],
  ["c", "    # the compiler handles tiling, precision, and calibration."],
  ["", "    s = q @ k.T"],
  ["", "    return awen.softmax(s / awen.sqrt(q.shape[-1]))"],
] as const;

const color: Record<string, string> = {
  c: "text-muted-foreground/80",
  k: "text-amber-200",
  d: "text-accent",
  "": "text-foreground/90",
};

export default function KernelPreview() {
  return (
    <section id="kernels" className="relative py-28 md:py-32 scroll-mt-20">
      <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center [&>*]:min-w-0">
        <SectionHeading eyebrow="Programming model" title="Write the math. Let light do the multiply.">
          The goal is a developer experience that feels familiar to anyone who has written a GPU
          kernel, while the toolchain takes care of mapping onto optical hardware and keeping
          analog error within explicit budgets.
        </SectionHeading>
        <Reveal delay={0.1}>
          <div className="relative rounded-2xl border border-border/60 bg-[hsl(40_12%_4%)] shadow-[0_30px_80px_-20px_hsl(43_74%_55%/0.25)] overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border/50 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">kernel.py · preview</span>
            </div>
            <pre className="overflow-x-auto p-6 text-[13px] leading-7 font-mono">
              <code>
                {code.map(([t, line], i) => (
                  <div key={i} className={color[t]}>
                    {line || "\u00a0"}
                  </div>
                ))}
              </code>
            </pre>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
