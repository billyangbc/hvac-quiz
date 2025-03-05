"use client";
import { useState, useEffect } from 'react';
import { Question } from '@/types/dashboard/Question';

interface QuestionListProps {
  questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);

  useEffect(() => {
    setExpandedStates(questions.map(() => false))
  }, [questions]);

  const toggleQuestion = (index: number) => {
    setExpandedStates(prev => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    })
  }

  return (
    <div className="rounded-lg border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question, index) => (
              <tr key={question.documentId} className="even:bg-gray-50">
                <td className="px-2 py-4 whitespace-normal text-sm text-gray-900 space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <div className="font-medium text-gray-900 flex-1">{question.content}</div>
                    <button
                      onClick={() => toggleQuestion(index)}
                      className="text-gray-400 hover:text-blue-600 transition-colors duration-200 px-2 py-1.5 rounded-lg hover:bg-gray-50"
                    >
                      {expandedStates[index] ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  </div>
                  
                  {expandedStates[index] && (
                    <>
                      <div className="mt-2 p-3 bg-green-50 rounded-lg">
                        <div className="text-xs font-semibold text-green-700">Correct Answer</div>
                        <div className="mt-1 text-gray-900">{question.correctAnswer}</div>
                      </div>

                      <div className="mt-2 p-3 bg-red-50 rounded-lg">
                        <div className="text-xs font-semibold text-red-700">Incorrect Answers</div>
                        <div className="mt-2 space-y-2">
                          <div className="p-2 bg-white rounded border border-red-100">{question.incorrect_1}</div>
                          <div className="p-2 bg-white rounded border border-red-100">{question.incorrect_2}</div>
                          <div className="p-2 bg-white rounded border border-red-100">{question.incorrect_3}</div>
                        </div>
                      </div>

                      {question.explanation && (
                        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                          <div className="text-xs font-semibold text-blue-700">Explanation</div>
                          <div className="mt-1 text-gray-900">{question.explanation}</div>
                        </div>
                      )}
                    </>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-indigo-600 hover:text-indigo-900 mr-4">
                    Edit
                  </button>
                  <button className="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}