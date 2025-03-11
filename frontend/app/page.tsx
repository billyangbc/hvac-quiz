import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { 
  BookOpen, 
  ClipboardCheck, 
  ArrowRightLeft, 
  BarChart, 
  Cpu,
  ArrowRight
} from 'lucide-react';

import { isAdmin } from '@/lib/services/auth';
import FeatureCard from '@/components/custom/FeatureCard';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-16">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
              HVAC Training Simulator
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
              Master HVAC systems through interactive learning and simulation exams
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Feature 1: Learning Platform */}
            <FeatureCard
              title="Comprehensive Learning Platform"
              description="Access a complete suite of HVAC courses, resources, and interactive simulations designed for students at all levels."
              icon={BookOpen}
              imageSrc="/screenshots/1-setting.png"
              imageAlt="HVAC Learning Platform"
            />

            {/* Feature 2: Simulation Exams */}
            <FeatureCard
              title="Realistic Simulation Exams"
              description="Practice with simulation exams that mirror real-world HVAC system operations and certification tests."
              icon={ClipboardCheck}
              imageSrc="/screenshots/2-test.png"
              imageAlt="HVAC Simulation Exam"
            />

            {/* Feature 3: Results Analysis */}
            <FeatureCard
              title="Detailed Results Analysis"
              description="Receive comprehensive feedback on your performance, identifying strengths and areas for improvement."
              icon={ArrowRightLeft}
              imageSrc="/screenshots/4-test-summary.png"
              imageAlt="HVAC Test Results Analysis"
            />

            {/* Feature 4: Performance Statistics */}
            <FeatureCard
              title="Performance Statistics"
              description="Track your progress over time with visual statistics and performance metrics to accelerate your learning."
              icon={BarChart}
              imageSrc="/screenshots/5-stats.png"
              imageAlt="HVAC Performance Statistics"
            />

            {/* Feature 5: Error Analysis & Revision */}
            <FeatureCard
              title="Error Analysis & Revision"
              description="Review your mistakes with detailed explanations and targeted revision materials to strengthen your understanding of challenging concepts."
              icon={Cpu}
              imageSrc="/screenshots/6-revise.png"
              imageAlt="HVAC Error Analysis and Revision"
              className="md:col-span-2 lg:col-span-1"
            />
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link href="/api/auth/signin" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all">
              <ArrowRight size={20} />
              Start Your HVAC Training
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const hasDashboard = await isAdmin();
  if (hasDashboard) {
    redirect('/dashboard');
  } else {
    redirect('/quiz');
  }
}
