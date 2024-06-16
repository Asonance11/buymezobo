import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useInterface } from '@/store/InterfaceStore';
import BuyCard from '@/app/(public)/[username]/_components/BuyCard';
import { useRouter } from 'next/navigation';
import TooltipPrimitive from '../ui/tooltipPrimitive';
import { InterTight } from '@/utility/fonts';
import { GrMoney } from 'react-icons/gr';

export default function SupportWindow() {
    const { type, data, isOpen, onClose } = useInterface();
    const open = isOpen && type === 'supportwindow';
    const { creator } = data;
    const router = useRouter();
    const draggableRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (open && draggableRef.current) {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const { width, height } = draggableRef.current.getBoundingClientRect();
            setPosition({
                x: (windowWidth - width) / 2,
                y: (windowHeight - height) / 2,
            });
        }
    }, [open]);

    if (!creator || !open) {
        return null;
    }

    const handleExpand = () => router.push(`/${creator.userName}`);

    return (
        <div className="fixed inset-0 z-50">
            <Draggable handle=".handle" position={position} onStop={(e, data) => setPosition({ x: data.x, y: data.y })}>
                <div
                    ref={draggableRef}
                    className={`bg-white rounded-lg shadow-lg w-full sm:w-[480px] md:w-[600px] lg:w-[520px] ${InterTight.className}`}
                >
                    <div className="bg-gray-200 p-2 rounded-t-lg flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-700 flex items-center gap-1 flex-1 handle h-full cursor-grab">
                            <GrMoney />
                            Support {creator.userName}
                        </div>
                        <div className="flex space-x-2">
                            <TooltipPrimitive prompt="Full Screen">
                                <button
                                    onClick={handleExpand}
                                    className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600"
                                ></button>
                            </TooltipPrimitive>
                            <TooltipPrimitive prompt="Close">
                                <button
                                    onClick={onClose}
                                    className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600"
                                ></button>
                            </TooltipPrimitive>
                        </div>
                    </div>
                    <div className="flex items-center justify-center p-4">
                        <BuyCard creator={creator} className='' />
                    </div>
                </div>
            </Draggable>
        </div>
    );
}
