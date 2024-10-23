'use client';
import React, { useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const Page = () => {
    const [inputSkills, setInputSkills] = useState<string>('');
    const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        const skillsArray = inputSkills
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill.length > 0);

        if (skillsArray.length === 0) {
            setError('Please enter at least one skill');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/match-skills`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(skillsArray),
            });

            if (!response.ok) {
                throw new Error('Failed to match skills');
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(data.error);
            }

            setMatchedSkills(data.matched_skills);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#fdf5df]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-8 lg:mb-12">
                        <h1 className="text-3xl sm:text-3xl lg:text-3xl font-bold text-[#5ebec4] mb-3">
                            Skill Relevance
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Enter your skills to find standardized matches
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label 
                                        htmlFor="skills" 
                                        className="block text-sm font-medium text-gray-700 mb-2"
                                    >
                                        Enter Skills 
                                    </label>
                                    <textarea
                                        id="skills"
                                        value={inputSkills}
                                        onChange={(e) => setInputSkills(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5ebec4] focus:border-[#5ebec4] min-h-[180px] lg:min-h-[250px]"
                                        placeholder="e.g., python, java, javascript"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-[#5ebec4] text-white py-3 px-4 rounded-lg hover:bg-[#f92c85] transition-colors disabled:bg-gray-400 text-lg font-medium"
                                >
                                    {isLoading ? 'Matching Skills...' : 'Match Skills'}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 border-l-4 border-[#f92c85] text-[#f92c85]">
                                    {error}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                            <h2 className="text-xl lg:text-2xl font-semibold text-gray-800 mb-4">
                                {matchedSkills.length > 0 ? 'Matched Skills' : 'No matches yet'}
                            </h2>
                            {matchedSkills.length > 0 ? (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <ul className="space-y-3">
                                        {matchedSkills.map((skill, index) => (
                                            <li 
                                                key={index}
                                                className="flex items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                            >
                                                <span className="w-2 h-2 bg-[#F92C85] rounded-full mr-3"></span>
                                                <span className="text-gray-700 text-lg">{skill}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-[250px] bg-gray-50 rounded-lg">
                                    <p className="text-gray-500 text-lg">Enter skills to see matches</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Page;
