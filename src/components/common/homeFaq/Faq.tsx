import { getFAQs } from "@/api/profile/faq";
import React, { useEffect, useState } from "react";

interface Question {
    question: string;
    answer: string;
}

const Faq: React.FC = () => {
    const [data, setData] = useState<Question[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getFAQs();
                setData(result || []);
            } catch (err: any) {
                setError(err.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleQuestion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <section className="w-full min-h-screen flex flex-col items-center justify-center gap-6 px-6 md:px-12 md:py-6 py-4 bg-white relative z-10">
            <div className="bg-[#E8EFF8] px-4 py-1 rounded-full text-[#145DB8] text-sm font-medium">
                Frequently Asked Questions
            </div>

            <h1 className="noto-serif text-2xl md:text-3xl font-semibold text-center">
                Got Questions? We’ve Got Answers!
            </h1>

            <div className="flex flex-col w-full md:w-1/2 gap-4 mt-4">
                {data.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index} onClick={() => toggleQuestion(index)} className="w-full bg-[#F5F6F7] rounded-lg p-4 transition-all duration-300">
                            <div
                                className="flex items-center justify-between cursor-pointer select-none"
                            >
                                <p className="noto-serif font-medium text-base md:text-lg  overflow-hidden">{item.question}</p>
                                <img
                                    src={isOpen ? "/icons/min.svg" : "/icons/plus.svg"}
                                    alt="toggle"
                                    className="w-5 h-5 ml-2"
                                    loading="lazy"
                                />
                            </div>

                            {isOpen && (
                                <div className="mt-3 text-sm text-[#6B7280] border-t border-gray-300 pt-3">
                                    {item.answer}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Faq;
