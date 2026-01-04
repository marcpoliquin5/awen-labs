import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ExternalLink, Tag } from "lucide-react";

export interface ResearchItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
  status: "Prototype" | "Draft" | "Published";
  date: string;
  link?: string;
}

interface ResearchGridProps {
  items: ResearchItem[];
  limit?: number;
}

const statusColors = {
  Prototype: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Draft: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Published: "bg-green-500/20 text-green-400 border-green-500/30",
};

const ResearchGrid = ({ items, limit }: ResearchGridProps) => {
  const displayItems = limit ? items.slice(0, limit) : items;

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayItems.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 glow-border"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <span
              className={`text-xs font-medium px-2 py-1 rounded-full border ${
                statusColors[item.status]
              }`}
            >
              {item.status}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
          </h3>

          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {item.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground">{item.date}</span>
            {item.link && (
              <Link
                to={item.link}
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-accent transition-colors"
              >
                Read more
                <ExternalLink className="w-4 h-4" />
              </Link>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  );
};

export default ResearchGrid;
