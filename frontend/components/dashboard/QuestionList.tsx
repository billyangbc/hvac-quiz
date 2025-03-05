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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Correct Answer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incorrect 1</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incorrect 2</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Incorrect 3</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {questions.map((question) => (
              <tr key={question.documentId} className="even:bg-gray-50">
                <td className="px-6 py-4 whitespace-normal text-sm text-gray-900">{question.content}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.correctAnswer}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.incorrect_1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.incorrect_2}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{question.incorrect_3}</td>
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