import { motion } from "framer-motion";
import { Github, MessageCircle, Mail, Users, Heart } from "lucide-react";

const communityLinks = [
  {
    icon: Github,
    title: "Open Source",
    description: "Source code will be published alongside the first release",
    action: "Coming soon",
  },
  {
    icon: MessageCircle,
    title: "Issues & Discussion",
    description: "A public place to ask questions, propose ideas, and report bugs",
    action: "Coming soon",
  },
  {
    icon: Mail,
    title: "Release Updates",
    description: "Get notified when the first release ships",
    action: "Coming soon",
  },
];

const CommunitySection = () => {
  return (
    <section className="py-24 relative nebula-bg">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Join the <span className="text-primary">Community</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AWEN is built by researchers and developers passionate about the future of
            computing. We'd love to have you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {communityLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 text-center group hover:border-primary/30 transition-all duration-500 glow-border"
              >
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {link.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {link.description}
                </p>
                <span className="text-primary text-sm font-medium">
                  {link.action}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Contribution CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-card p-8 max-w-3xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users className="w-6 h-6 text-primary" />
            <Heart className="w-6 h-6 text-accent" />
          </div>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Looking for Collaborators
          </h3>
          <p className="text-muted-foreground mb-6">
            We're actively seeking researchers, hardware engineers, and developers
            interested in photonic computing. Whether you want to contribute code,
            share research, or help with documentation—there's a place for you.
          </p>
          <span className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary">
            <Mail className="w-4 h-4" />
            Contact channels coming soon
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default CommunitySection;
