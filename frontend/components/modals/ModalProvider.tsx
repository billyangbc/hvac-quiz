"use client";

import React, { useEffect, useState } from "react";
import QuitQuizModal from "./QuitQuizModal";
import ResultModal from "./ResultModal";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import EditCategoryModal from "./EditCategoryModal";
import EditQuestionModal from "./EditQuestionModal";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <QuitQuizModal />
      <ResultModal />
      <DeleteConfirmationModal />
      <EditCategoryModal />
      <EditQuestionModal />
    </>
  );
};

export default ModalProvider;
