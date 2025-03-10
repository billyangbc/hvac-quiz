"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import useModalStore from "@/hooks/useModalStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveResult } from "@/lib/actions/quiz/quiz-actions";
import { Save } from "lucide-react";
import { StrapiErrors } from "@/components/custom/StrapiErrors";

const ResultModal = () => {
  const { isOpen, type, onClose, additionalData } = useModalStore();
  const open = isOpen && type === "showResults";
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [saveError, setSaveError] = useState<{
    message: string;
    name: string;
    status: string;
  } | null>(null);
  
  console.log("addtional data =>", additionalData);
  
  const handleSaveResult = async () => {
    if (!additionalData?.results || !additionalData.results.testId) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const { testId, failedQuestions = [], score = 0 } = additionalData.results;
      const response = await saveResult(testId, failedQuestions, score);
      
      if (response?.error) {
        setSaveError({
          message: response.error,
          name: "SaveError",
          status: "400"
        });
        setIsSaved(false);
      } else {
        setIsSaved(true);
      }
    } catch (error) {
      setSaveError({
        message: error instanceof Error ? error.message : "An unknown error occurred",
        name: "SaveError",
        status: "500"
      });
      setIsSaved(false);
    } finally {
      setIsSaving(false);
    }
  };
  const handlePlayAgain = async () => {
    setIsSaving(false);
    setIsSaved(false);
    setSaveError(null);
    router.push("/quiz");
    onClose();
  }
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogDescription />
        <DialogHeader>
          <DialogTitle className="text-center text-xl md:text-2xl">
            Quiz Result
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col items-center py-4 md:py-6">
          <p className="text-lg md:2xl text-primary font-semibold tracking-wide">
            You scored: {`${additionalData?.results?.score}/${additionalData?.results?.total}`}
          </p>
          
          {saveError && (
            <div className="w-full mt-3">
              <StrapiErrors error={saveError} />
            </div>
          )}
          
          <div className="flex gap-3 mt-3 md:mt-5">
            <Button
              onClick={handlePlayAgain}
            >
              Play Again
            </Button>
            
            <Button
              onClick={handleSaveResult}
              disabled={isSaving || isSaved}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  {isSaved ? "Saved" : "Save Result"}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
