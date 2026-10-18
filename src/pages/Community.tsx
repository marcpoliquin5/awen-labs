import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Github, MessageCircle, Mail, Users, Heart, BookOpen, Code, GitPullRequest } from "lucide-react";
import { BRAND } from "@/config/brand";

const contributionAreas = [
  {
    icon: Code,
    title: "Core Platform",
    description: "Help build the simulation engine, runtime, and kernel system.",
    skills: ["Rust", "Python", "Photonics"],
  },
  {
    icon: BookOpen,
    title: "Documentation",
    description: "Improve guides, write tutorials, and enhance API docs.",
    skills: ["Technical Writing", "MDX"],
  },
  {
    icon: GitPullRequest,
    title: "Testing & QA",
    description: "Write tests, report bugs, and validate simulation accuracy.",
    skills: ["Testing", "Physics"],
  },
];

const CommunityPage = () => {
  return (
    <>
      <Helmet>
        <title>{`Community | ${BRAND.fullName}`}</title>
        <meta
          name="description"
          content={`Join the ${BRAND.name} community. Connect with researchers and developers building the future of photonic computing.`}
        />
      </Helmet>

      <div className="min-h-screen">

        <div className="pt-32 pb-24">
          <div className="container mx-auto px-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Join the <span className="text-primary">Community</span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {BRAND.name} is being built for researchers, engineers, and developers
                passionate about the future of computing. Community channels open
                with the first release.
              </p>
            </motion.div>

            {/* Connection Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-24">
              {[
                {
                  icon: Github,
                  title: "Open Source",
                  description:
                    "Source code will be published alongside the first release.",
                  action: "Coming soon",
                },
                {
                  icon: MessageCircle,
                  title: "Issues & Discussion",
                  description:
                    "A public place to ask questions, propose ideas, and report bugs.",
                  action: "Coming soon",
                },
                {
                  icon: Mail,
                  title: "Release Updates",
                  description:
                    "Get notified when the first release ships.",
                  action: "Coming soon",
                },
              ].map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.div
                    key={link.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="glass-card lift p-8 text-center group glow-border"
                  >
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {link.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      {link.description}
                    </p>
                    <span className="text-primary font-medium">
                      {link.action}
                    </span>
                  </motion.div>
                );
              })}
            </div>

            {/* Contribution Guidelines */}
            <section className="mb-24">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ways to <span className="text-primary">Contribute</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Whether you're a physicist, software engineer, or technical writer—
                  there's a place for you in the {BRAND.name} project.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {contributionAreas.map((area, index) => {
                  const Icon = area.icon;
                  return (
                    <motion.div
                      key={area.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="glass-card lift p-6"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {area.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4">
                        {area.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {area.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2 py-1 rounded-full bg-secondary/50 text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Looking for Collaborators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="contact"
              className="glass-card p-12 max-w-4xl mx-auto text-center"
            >
              <div className="flex items-center justify-center gap-4 mb-6">
                <Users className="w-8 h-8 text-primary" />
                <Heart className="w-8 h-8 text-accent animate-pulse" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Looking for Collaborators
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're actively seeking researchers with photonics expertise, 
                hardware engineers interested in PIC integration, and developers 
                who want to push the boundaries of computing.
              </p>
              <span className="inline-flex items-center gap-2 rounded-lg border border-primary/40 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary">
                <Mail className="w-4 h-4" />
                Contact channels coming soon
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CommunityPage;
