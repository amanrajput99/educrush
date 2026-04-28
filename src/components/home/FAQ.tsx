'use client'
    const faqs = [
        {
            question: "What features are included in each plan?",
            answer: "Each plan includes core workflow tools, analytics, and customer support, with higher tiers unlocking more automation, advanced reporting and collaboration features."
        },
        {
            question: "Is there a free trial available?",
            answer: "Yes, you can start with a free trial to explore the platform before choosing a paid plan."
        },
        {
            question: "Can I upgrade or downgrade my plan anytime?",
            answer: "Yes, you can switch plans whenever your needs change and the update will reflect directly in your billing cycle."
        },
        {
            question: "Which payment methods are supported?",
            answer: "We support major credit and debit cards, along with common online payment options depending on your region."
        },
        {
            question: "Is my data safe and protected?",
            answer: "Your data is protected with secure infrastructure, encrypted connections and regular reliability and security monitoring."
        },
        {
            question: "Can I connect this platform with other tools?",
            answer: "Yes, the platform supports integrations with popular apps so you can connect your existing workflows without extra hassle."
        },
        {
            question: "Does the platform support team collaboration?",
            answer: "Yes, team members can collaborate through shared access, organized workflows and role-based permissions."
        },
        {
            question: "What makes your platform different?",
            answer: "Our platform focuses on simplicity, speed and scalable tools so teams can launch faster and manage work more efficiently."
        }
    ]
    const mid = Math.ceil(faqs.length / 2)
    const columns = [faqs.slice(0, mid), faqs.slice(mid)]
const FAQ = () => {
    return (
        <>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Geist:wght@100..900&display=swap');
                    *{ font-family: "Geist", sans-serif; }
                `}
            </style>
            <section className='bg-black w-full flex flex-col items-center justify-center py-10 px-4'>
                
                <div className='w-full max-w-5xl'>
                    <div className='mb-12'>
                        <h2 className='text-5xl font-medium text-neutral-50 text-center'>FAQ&apos;s</h2>
                        <p className='text-neutral-100 max-w-[540px] text-base/6 text-center mx-auto mt-5'>Find answers to the most frequently asked questions about our platform, features, pricing and how we help businesses grow faster.</p>
                    </div>

                    <input id="faq-none" name="faq-accordion" type="radio" className="hidden" defaultChecked />

                    <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-y-0'>
                        {columns.map((column, columnIndex) => (
                            <div key={columnIndex} className='space-y-4'>
                                {column.map((faq) => (
                                    <details key={faq.question} name="faq-accordion" className='group rounded-lg border border-neutral-800 bg-neutral-950 transition-all duration-300 hover:bg-neutral-900'>
                                        <summary className='flex cursor-pointer list-none items-center justify-between gap-4 p-3.5 [&::-webkit-details-marker]:hidden'>
                                            <span className='text-sm font-medium text-neutral-100'>{faq.question}</span>
                                            <div className='shrink-0 rounded p-1 text-neutral-100 transition-colors hover:bg-neutral-800'>
                                                <svg className='block group-open:hidden' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                                <svg className='hidden group-open:block' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /></svg>
                                            </div>
                                        </summary>
                                        <div className='grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-in-out group-open:grid-rows-[1fr] group-open:opacity-100'>
                                            <div className='overflow-hidden'>
                                                <p className='px-3.5 pb-3.5 text-sm leading-relaxed text-neutral-300'>
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </details>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}

export default FAQ
