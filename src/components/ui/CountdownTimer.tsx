import React, { useEffect, useState } from 'react';

export const CountdownTimer = ({ startTime, endTime }: { startTime: string; endTime: string }) => {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const totalDuration = Math.max(0, Math.floor((end - start) / 1000)); // in seconds

    const [timeLeft, setTimeLeft] = useState(() =>
        Math.max(0, Math.floor((end - Date.now()) / 1000))
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(Math.max(0, Math.floor((end - Date.now()) / 1000)));
        }, 1000);

        return () => clearInterval(interval);
    }, [end]);

    const progress = totalDuration === 0 ? 0 : ((totalDuration - timeLeft) / totalDuration) * 100;

    const formatTime = (s: number) => {
        const min = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${min}:${sec}`;
    };

    return (
        <div className="flex flex-col items-center gap-2 mt-4">
            <div className="relative h-24 w-24">
                <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="36" stroke="#e5e7eb" strokeWidth="6" fill="none" />
                    <circle
                        cx="50"
                        cy="50"
                        r="36"
                        stroke="#10b981"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray={2 * Math.PI * 36}
                        strokeDashoffset={(2 * Math.PI * 36 * (100 - progress)) / 100}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {formatTime(timeLeft)}
                </div>
            </div>
            <p className="text-sm text-muted-foreground">Time Left</p>
        </div>
    );
};
