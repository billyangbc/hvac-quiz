import { Question } from '@/types/dashboard/Question'

interface QuestionListProps {
  questions: Question[]
}

export default function QuestionList({ questions }: QuestionListProps) {
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
            {questions.map((question) => (
              <tr key={question.documentId} className="even:bg-gray-50">
                <td className="px-2 py-4 whitespace-normal text-sm text-gray-900 space-y-4">
                  <div className="font-medium text-gray-900">{question.content}</div>
                  
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