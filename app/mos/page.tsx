"use client";

import React, { useEffect, useRef, useState } from "react";
import { MOSPrereq } from "./mos-prereq";
import { MOSIndo } from "./mos-indo";

import { motion, AnimatePresence } from "framer-motion";
import { AudioFormSchema, PrereqFormSchema } from "./schema";
import { set, z } from "zod";
import { MOSEng } from "./mos-eng";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function MOSForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [prereqData, setPrereqData] = useState<z.infer<
    typeof PrereqFormSchema
  > | null>(null);
  const [indoData, setIndoData] = useState<z.infer<
    typeof AudioFormSchema
  > | null>(null);
  const [englishData, setEnglishData] = useState<z.infer<
    typeof AudioFormSchema
  > | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const onRequirementSubmit = (data: z.infer<typeof PrereqFormSchema>) => {
    setPrereqData(data);
    console.log(data);
    setCurrentStep(2);
  };

  const onEngSubmit = (data: z.infer<typeof AudioFormSchema>) => {
    setEnglishData(data);
    setCurrentStep(3);
  };

  const onIndoSubmit = (data: z.infer<typeof AudioFormSchema>) => {
    setIndoData(data);
    setCurrentStep(4);
  };

  const onBack = () => {
    setIsOpen(true);
  };

  const onConfirm = () => {
    setCurrentStep(currentStep > 1 ? currentStep - 1 : currentStep);
    setIsOpen(false);
  };

  const onSubmit = () => {
    toast.success("Your data has been saved.");
    console.log("Data submitted", {
      prereqData,
      indoData,
      englishData,
    });
    setCurrentStep(5);
  };

  const onReset = () => {
    setPrereqData(null);
    setIndoData(null);
    setEnglishData(null);
    setCurrentStep(1);
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentStep]);

  return (
    <div ref={containerRef} className="px-6 py-10  md:px-10 md:py-12 space-y-4">
      {/* )} */}
      <div>
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              transition={{ duration: 0.3 }}
            >
              <MOSPrereq onSubmit={onRequirementSubmit} initVal={prereqData} />
            </motion.div>
          )}
          {currentStep === 2 && (
            <motion.div
              key="step3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              transition={{ duration: 0.3 }}
            >
              <MOSEng
                onSubmit={onEngSubmit}
                onBack={onBack}
                initVal={englishData}
              />
            </motion.div>
          )}
          {currentStep === 3 && (
            <motion.div
              key="step2"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              transition={{ duration: 0.3 }}
            >
              <MOSIndo
                onSubmit={onIndoSubmit}
                onBack={onBack}
                initVal={indoData}
              />
            </motion.div>
          )}
          {currentStep === 4 && (
            <motion.div
              key="step4"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-2xl font-bold mb-3">
                Speech Utterance Questionnaire
              </h1>
              <p className="text-muted-foreground">
                Before submitting, you may want to review your answers by going
                back to the previous sections. If you are sure about your
                answer, The last step is to submit your answers for this
                questionnaire by clicking the submit button below.
              </p>
              <div className="pt-8 w-full flex md:flex-row flex-col-reverse  gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex gap-2 hover:gap-3 transition-all"
                >
                  <ArrowLeft strokeWidth={1} size={16} />
                  Back to previous section
                </Button>
                <Button
                  onClick={onSubmit}
                  className="flex-1 flex gap-2 hover:gap-3 transition-all"
                >
                  <Send strokeWidth={1} size={16} />
                  Submit my answers
                </Button>
              </div>
            </motion.div>
          )}
          {currentStep === 5 && (
            <motion.div
              key="step5"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={fadeVariants}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center text-balance h-screen mt-32">
                <h1 className="font-bold tracking-tighter text-2xl md:text-3xl mb-2">
                  Thank you for participating!
                </h1>
                <p className="text-primary/75 text-sm md:text-base">
                  Your data has been saved. You can close this page now or go{" "}
                  <button
                    onClick={onReset}
                    className="hover:underline text-primary hover:text-primary/90"
                  >
                    back
                  </button>
                  .
                </p>
                <p className="text-primary/75 text-sm md:text-base mt-12">
                  If you have any questions, don't hesitate to contact me on{" "}
                  <button
                    className="text-primary hover:underline"
                    onClick={() => {
                      navigator.clipboard.writeText("hafizhaua@gmail.com");
                      toast.info("Email copied to clipboard");
                    }}
                  >
                    Email
                  </button>
                  ,{" "}
                  <a
                    className="text-primary hover:underline"
                    href="https://twitter.com/hafizhaua"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    Twitter
                  </a>
                  , or{" "}
                  <a
                    className="text-primary hover:underline"
                    href="https://linkedin.com/in/hafizhaua"
                    rel="noreferrer noopener"
                    target="_blank"
                  >
                    LinkedIn
                  </a>
                  .
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <AlertDialog open={isOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to go back?
              </AlertDialogTitle>
              <AlertDialogDescription>
                If you haven't finished and saved your progress of this section,
                your current scorings for this section might be lost when you go
                back.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onConfirm}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
