import React from "react";
import { motion } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1];

// Masked line-by-line reveal. Pass an array of strings as `lines`.
export const MaskedLines = ({
  lines = [],
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.09,
  duration = 1.1,
  as: Tag = "span",
}) => {
  return (
    <span className={className} aria-label={lines.join(" ")}>
      {lines.map((line, i) => (
        <span key={i} className="reveal-mask">
          <motion.span
            className={`block ${lineClassName}`}
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration,
              ease: EASE,
              delay: delay + i * stagger,
            }}
            style={{ willChange: "transform" }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
};

// Simple scroll-triggered fade-up wrapper.
export const Reveal = ({
  children,
  className = "",
  delay = 0,
  y = 40,
  once = true,
}) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-80px" }}
    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
  >
    {children}
  </motion.div>
);
