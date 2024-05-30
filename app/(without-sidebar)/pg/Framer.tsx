import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Framer = ({ text }: { text: string }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="absolute top-16"
        key={text}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {text}
      </motion.div>
    </AnimatePresence>
  );
};
