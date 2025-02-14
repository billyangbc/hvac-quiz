const fs = require('fs');
const csv = require('csv-parser');

const inputFile = 'data/EPA608-Parctice-test.csv';
const outputFile = 'data/quiz-questions.json';

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv({
    headers: ['number', 'category', 'question', 'optionA', 'optionB', 'optionC', 'optionD', 'optionE', 'correctAnswer', 'analysis'],
    skipLines: 1, // Skip only the first header row
    skipComments: true // Skip any comment rows
  }))
  .on('data', (data) => {
    if (!data.category || !data.question) return; // Skip empty rows
    
    const options = {
      a: data.optionA,
      b: data.optionB, 
      c: data.optionC,
      d: data.optionD
    };
    
    if (!data.category?.startsWith('Type-')) return; // Skip section headers
    const correctKey = data.correctAnswer?.trim().toLowerCase();
    if (!correctKey || !options[correctKey]?.trim()) return; // Skip invalid answers
    const incorrectAnswers = Object.entries(options)
      .filter(([key]) => key !== correctKey)
      .map(([_, value]) => value)
      .filter(v => v); // Remove empty options

    results.push({
      category: data.category,
      question: data.question.trim(),
      correctAnswer: options[correctKey],
      incorrectAnswers,
      difficulty: "medium",
      type: "Multiple Choice",
      tags: ["epa608"],
      id: `epa608-${data.category}-${data.number}`,
    });
  })
  .on('end', () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2));
    console.log(`Converted ${results.length} questions to JSON`);
  });
