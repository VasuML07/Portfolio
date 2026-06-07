"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { toast } from "sonner";
import {
  Mail,
  Github,
  Linkedin,
  FileText,
  Copy,
  Check,
  ArrowUpRight,
} from "lucide-react";
import { staggerContainer, staggerItem } from "@/lib/animations";

interface ContactItem {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  action?: "copy";
  copyValue?: string;
}

const CONTACTS: ContactItem[] = [
  {
    icon: <Mail className="h-5 w-5" />,
    label: "Email",
    value: "marganaavinash@gmail.com",
    action: "copy",
    copyValue: "marganaavinash@gmail.com",
  },
  {
    icon: <Github className="h-5 w-5" />,
    label: "GitHub",
    value: "VasuML07",
    href: "https://github.com/VasuML07",
  },
  {
    icon: <Linkedin className="h-5 w-5" />,
    label: "LinkedIn",
    value: "vasu-margana",
    href: "https://www.linkedin.com/in/vasu-margana-49265031b/",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Resume",
    value: "View Resume",
    href: "https://drive.google.com/file/d/146NHCZpQH1My53cRdLK-vGmHOPgu1SyS/view",
  },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg border border-border/40 hover:border-border/60 transition-colors text-foreground/35 hover:text-foreground/60"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-foreground/50" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

function ContactCard({ contact }: { contact: ContactItem }) {
  const isLink = !!contact.href;
  const Wrapper = isLink ? "a" : "div";

  return (
    <Wrapper
      href={contact.href}
      target={isLink ? "_blank" : undefined}
      rel={isLink ? "noopener noreferrer" : undefined}
      className="contents"
    >
      <motion.div
        whileHover={{ y: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="group relative p-6 rounded-2xl border border-border/40 hover:border-border/70 bg-card/30 transition-colors duration-300 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl border border-border/30 bg-card/50 text-foreground/35 group-hover:text-foreground/60 transition-colors">
              {contact.icon}
            </div>
            <div>
              <div className="text-xs font-mono text-foreground/35 uppercase tracking-[0.12em] mb-1">
                {contact.label}
              </div>
              <div className="text-sm font-medium">{contact.value}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {contact.action === "copy" && (
              <CopyButton value={contact.copyValue || ""} />
            )}
            {isLink && (
              <ArrowUpRight className="h-4 w-4 text-foreground/25 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>
      </motion.div>
    </Wrapper>
  );
}

export default function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section id="contact" ref={sectionRef} className="py-28 sm:py-36">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="font-mono text-xs text-foreground/35 tracking-[0.15em] uppercase block mb-3">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em]">
            Let&apos;s Build Something Useful.
          </h2>
          <p className="mt-3 text-foreground/45 max-w-lg">
            Open to internships, software engineering opportunities, AI/ML projects, research collaborations, and interesting technical conversations.
          </p>
        </motion.div>

        {/* Contact cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {CONTACTS.map((contact) => (
            <motion.div key={contact.label} variants={staggerItem}>
              <ContactCard contact={contact} />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-24 pt-8 border-t border-border/30 text-center"
        >
          <p className="text-xs text-foreground/25 font-mono">
            Designed &amp; built by Avinash &middot; {new Date().getFullYear()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
