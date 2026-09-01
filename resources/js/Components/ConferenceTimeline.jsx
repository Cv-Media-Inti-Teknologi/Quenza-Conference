import React from 'react';

export default function ConferenceTimeline({ timeline }) {
    return (
        <div className="quenza-card rounded-quenza-xl">
            <h3 className="text-quenza-large font-quenza-bold text-quenza-text-primary mb-1">Linimasa Konferensi</h3>
            <p className="text-quenza-small font-quenza-regular text-quenza-text-secondary mb-6">Fase status event saat ini</p>
            
            <div className="flex flex-col md:flex-row items-start justify-between relative gap-6 md:gap-0">
                {/* Horizontal line background */}
                <div className="hidden md:block absolute top-2 left-4 right-4 h-0.5 bg-gray-200 z-0"></div>
                
                {timeline.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';
                    
                    return (
                        <div key={idx} className="flex flex-row md:flex-col items-center md:items-start z-10 w-full md:w-1/4 gap-4 md:gap-0">
                            {/* Dot indicator */}
                            <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mb-2 shrink-0 ${
                                isCompleted || isActive ? 'bg-quenza-primary' : 'bg-gray-300'
                            }`} />
                            
                            <div className="flex flex-col">
                                <span className={`text-[11px] uppercase tracking-wider font-quenza-bold ${
                                    isActive ? 'text-quenza-primary' : 'text-quenza-text-secondary'
                                }`}>
                                    {step.phase}
                                </span>
                                <span className="text-quenza-medium font-quenza-bold text-quenza-text-primary leading-tight mt-0.5">
                                    {step.title}
                                </span>
                                <span className="text-quenza-small font-quenza-regular text-quenza-text-secondary mt-0.5">
                                    {step.desc}
                                </span>
                                {step.badge && (
                                    <span className="quenza-badge-success mt-2 w-fit">
                                        {step.badge}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
