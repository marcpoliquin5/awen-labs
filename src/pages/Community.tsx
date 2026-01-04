import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Github, MessageCircle, Mail, Users, Heart, BookOpen, Code, GitPullRequest } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <title>Community | AWEN Photonics</title>
        <meta
          name="description"
          content="Join the AWEN community. Connect with researchers and developers building the future of photonic computing."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navbar />

        <main className="pt-32 pb-24">
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
                AWEN is built by a global community of researchers, engineers, and 
                developers passionate about the future of computing.
              </p>
            </motion.div>

            {/* Connection Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-24">
              {[
                {
                  icon: Github,
                  title: "GitHub",
                  description:
                    "Browse the source code, report issues, and submit pull requests.",
                  href: "https://github.com/awen-photonics",
                  action: "View Repository",
                  stats: "2.4k stars",
                },
                {
                  icon: MessageCircle,
                  title: "Discord",
                  description:
                    "Real-time chat with developers and researchers. Get help, share ideas.",
                  href: "https://discord.gg/awen",
                  action: "Join Server",
                  stats: "1.2k members",
                },
                {
                  icon: Mail,
                  title: "Newsletter",
                  description:
                    "Monthly updates on releases, research, and community highlights.",
                  href: "mailto:newsletter@awen.dev",
                  action: "Subscribe",
                  stats: "5k subscribers",
                },
              ].map((link, index) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                    className="glass-card p-8 text-center group hover:border-primary/30 transition-all duration-500 glow-border"
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
                    <p className="text-xs text-muted-foreground mb-4">
                      {link.stats}
                    </p>
                    <span className="text-primary font-medium">
                      {link.action} →
                    </span>
                  </motion.a>
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
                  there's a place for you in the AWEN project.
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
                      className="glass-card p-6"
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
                who want to push the boundaries of computing. Funded positions 
                and research partnerships available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="mailto:collaborate@awen.dev">
                  <Button variant="glow" size="lg">
                    <Mail className="mr-2 w-5 h-5" />
                    Contact for Collaboration
                  </Button>
                </a>
                <a
                  href="https://github.com/awen-photonics/awen/blob/main/CONTRIBUTING.md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    Read Contribution Guide
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default CommunityPage;
