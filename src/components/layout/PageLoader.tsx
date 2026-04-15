"use client";

import Logo from "@/components/ui/logo";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function PageLoader() {
  const [visible, setVisible] = useState(true);
  const reduce = useReducedMotion();

  useEffect(() => {
    const minMs = reduce ? 0 : 520;
    let cancelled = false;

    const finish = () => {
      if (!cancelled) setVisible(false);
    };

    if (document.readyState === "complete") {
      const t = window.setTimeout(finish, minMs);
      return () => {
        cancelled = true;
        window.clearTimeout(t);
      };
    }

    const onLoad = () => {
      window.setTimeout(finish, minMs);
    };
    window.addEventListener("load", onLoad);
    return () => {
      cancelled = true;
      window.removeEventListener("load", onLoad);
    };
  }, [reduce]);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          key="page-loader"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0a]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-label="Loading"
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 65% at 50% 42%, rgba(93,214,44,0.14) 0%, transparent 58%), radial-gradient(circle at 20% 80%, rgba(93,214,44,0.07) 0%, transparent 45%), radial-gradient(circle at 80% 20%, rgba(93,214,44,0.05) 0%, transparent 40%)",
            }}
          />
          <motion.div
            className="relative flex flex-col items-center gap-6"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative flex items-center justify-center">
              <div
                className="pointer-events-none absolute inset-[-28px] rounded-[2rem] bg-[radial-gradient(circle_at_50%_50%,rgba(93,214,44,0.35),transparent_65%)] opacity-80 blur-2xl"
                aria-hidden
              />
              <motion.div
                animate={
                  reduce
                    ? undefined
                    : {
                        boxShadow: [
                          "0 0 0 0 rgba(93,214,44,0.45)",
                          "0 0 0 28px rgba(93,214,44,0)",
                          "0 0 0 0 rgba(93,214,44,0)",
                        ],
                      }
                }
                transition={reduce ? undefined : { duration: 2.4, repeat: Infinity, ease: "easeOut" }}
                className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-[0_12px_48px_-12px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-sm"
              >
                <Logo
                  variant="symbol"
                  className="relative h-14 w-14 drop-shadow-[0_0_24px_rgba(93,214,44,0.45)]"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
