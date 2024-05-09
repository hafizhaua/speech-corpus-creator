import { motion, AnimatePresence } from "framer-motion";

export const TextFade = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        className={`w-64 absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2 ${className}`}
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
