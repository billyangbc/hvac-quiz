"use client";

import { ResultType } from "@/types/quiz/QuizQuestion";
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Function to format date for chart
const formatChartDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Function to prepare data for the bar chart
const prepareBarChartData = (results: ResultType[]) => {
  // Sort results by date (oldest to newest)
  const sortedResults = [...results].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  // Group results by time
  const groupedByTime = sortedResults.reduce((acc, result) => {
    const timeKey = formatChartDate(result.createdAt);
    if (!acc[timeKey]) {
      acc[timeKey] = {
        time: timeKey,
        originalDate: result.createdAt,
        categories: {}
      };
    }
    
    // Add category score to this time point
    const categoryKey = result?.category?.categoryName ?? 'No Category';
    acc[timeKey].categories[categoryKey] = {
      score: result.score,
      percentage: result.questions.count > 0 
        ? Math.round((result.score / result.questions.count) * 100) 
        : 0,
      slug: result?.category?.slug
    };
    
    return acc;
  }, {} as Record<string, any>);
  
  // Convert to array and add category-specific fields
  return Object.values(groupedByTime).map(timePoint => {
    const result = { ...timePoint };
    
    // Add each category's score as a direct property
    Object.entries(timePoint.categories).forEach(([category, data]: [string, any]) => {
      result[category] = data.score;
    });
    
    return result;
  });
};

// Available colors for categories
const availableColors = [
  '#f97316', // orange-500
  '#ef4444', // red-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#10b981', // emerald-500
  '#6366f1', // indigo-500
  '#ec4899', // pink-500
  '#14b8a6', // teal-500
  '#f59e0b', // amber-500
  '#84cc16', // lime-500
  '#d946ef', // fuchsia-500
];

// Map to store assigned colors
const colorAssignments = new Map<string, string>();

// Generate unique colors for categories
const getCategoryColor = (slug: string) => {
  // If this slug already has an assigned color, return it
  if (colorAssignments.has(slug)) {
    return colorAssignments.get(slug);
  }
  
  // Get all currently used colors
  const usedColors = Array.from(colorAssignments.values());
  
  // Find available colors (not yet assigned)
  const unusedColors = availableColors.filter(color => !usedColors.includes(color));
  
  // If we have unused colors, randomly select one
  if (unusedColors.length > 0) {
    // Get a random index
    const randomIndex = Math.floor(Math.random() * unusedColors.length);
    // Get the color at that index
    const selectedColor = unusedColors[randomIndex];
    // Assign this color to the slug
    colorAssignments.set(slug, selectedColor);
    return selectedColor;
  }
  
  // If all colors are used, return a fallback color
  return '#94a3b8'; // slate-400 as fallback
};

interface TestStatusBarProps {
  testResult: ResultType[];
  className?: string;
}

const TestStatusBar = ({ testResult, className = "" }: TestStatusBarProps) => {
  if (testResult.length === 0) {
    return null;
  }

  return (
    <Card className={`mb-8 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Category Scores by Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={prepareBarChartData(testResult)}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="time" 
                angle={-45}
                textAnchor="end"
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ 
                  value: 'Category Score', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle' }
                }}
              />
              <Tooltip 
                formatter={(value, name, props) => {
                  return [`Score: ${value}`, name];
                }}
                labelFormatter={(label) => {
                  const item = prepareBarChartData(testResult).find(d => d.time === label);
                  return item ? new Date(item.originalDate).toLocaleString() : label;
                }}
              />
              <Legend />
              
              {Array.from(new Set(testResult.map(r => r.category?.categoryName ?? 'No Category'))).map((category) => {
                const categorySlug = testResult.find(r => (r?.category?.categoryName ?? 'No Category') === category)?.category?.slug || '';
                return (
                  <Bar
                    key={category}
                    dataKey={category}
                    fill={getCategoryColor(categorySlug)}
                    name={category}
                  />
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestStatusBar;
