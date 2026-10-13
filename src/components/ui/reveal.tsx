"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOutExpo } },
};

export interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger children of this element instead of animating it as a block. */
  stagger?: boolean;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
}

/**
 * Scroll-triggered entrance animation.
 *
 * When the visitor prefers reduced motion the element is rendered without any
 * animation props, so content appears immediately and remains accessible.
 */
export function Reveal({
  children,
  className,
  stagger = false,
  delay = 0,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      variants={stagger ? containerVariants : itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-64px" }}
      transition={
        stagger
          ? undefined
          : { duration: 0.6, delay, ease: easeOutExpo }
      }
    >
      {children}
    </MotionTag>
  );
}

/** A single staggered child of `<Reveal stagger>`. */
export function RevealItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export { itemVariants as revealItemVariants, containerVariants as revealContainerVariants };
