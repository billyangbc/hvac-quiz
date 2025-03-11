import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

import { isAdmin } from '@/lib/services/auth';

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
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-900/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                    <path d="M18 6H5a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h13l4-3.5L18 6Z"></path>
                    <path d="M12 13v8"></path>
                    <path d="M12 3v3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Comprehensive Learning Platform</h3>
              </div>
              <p className="text-slate-300 mb-6">
                Access a complete suite of HVAC courses, resources, and interactive simulations designed for students at all levels.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/screenshots/1-setting.png" 
                  alt="HVAC Learning Platform" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 2: Simulation Exams */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-900/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                    <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"></path>
                    <path d="M12 12v9"></path>
                    <path d="M8 21h8"></path>
                    <path d="M4.5 9 9 4.5"></path>
                    <path d="M14.5 4.5 19 9"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Realistic Simulation Exams</h3>
              </div>
              <p className="text-slate-300 mb-6">
                Practice with simulation exams that mirror real-world HVAC system operations and certification tests.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/screenshots/2-test.png" 
                  alt="HVAC Simulation Exam" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 3: Results Analysis */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-900/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                    <path d="M2 12h10"></path>
                    <path d="M9 4v16"></path>
                    <path d="M14 9l3 3-3 3"></path>
                    <path d="M17 12h5"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Detailed Results Analysis</h3>
              </div>
              <p className="text-slate-300 mb-6">
                Receive comprehensive feedback on your performance, identifying strengths and areas for improvement.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/screenshots/4-test-summary.png" 
                  alt="HVAC Test Results Analysis" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 4: Performance Statistics */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-900/20 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                    <path d="M3 3v18h18"></path>
                    <path d="m19 9-5 5-4-4-3 3"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Performance Statistics</h3>
              </div>
              <p className="text-slate-300 mb-6">
                Track your progress over time with visual statistics and performance metrics to accelerate your learning.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/screenshots/5-stats.png" 
                  alt="HVAC Performance Statistics" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Feature 5: Error Analysis & Revision */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 shadow-lg hover:shadow-cyan-900/20 transition-all md:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-cyan-500/10 p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400">
                    <path d="M9 9h6v6H9z"></path>
                    <path d="m13 5 2 2-2 2"></path>
                    <path d="M5 13 3 11l2-2"></path>
                    <path d="m13 19-2-2 2-2"></path>
                    <path d="m19 13 2-2-2-2"></path>
                    <path d="M2 12h2"></path>
                    <path d="M12 2v2"></path>
                    <path d="M20 12h2"></path>
                    <path d="M12 20v2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Error Analysis & Revision</h3>
              </div>
              <p className="text-slate-300 mb-6">
                Review your mistakes with detailed explanations and targeted revision materials to strengthen your understanding of challenging concepts.
              </p>
              <div className="relative h-48 rounded-lg overflow-hidden">
                <Image 
                  src="/screenshots/6-revise.png" 
                  alt="HVAC Error Analysis and Revision" 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 33vw"
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <Link href="/api/auth/signin" className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-6 rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
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
