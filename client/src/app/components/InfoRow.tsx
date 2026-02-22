// client/src/app/components/InfoRow.tsx
import { ReactNode } from "react";

interface InfoRowProps {
    icon: ReactNode;
    text: string;
    rightContent?: ReactNode; // optional progress bar or extra
}

export function InfoRow({ icon, text, rightContent }: InfoRowProps) {
    return (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
            {icon}
            <span>{text}</span>
            {rightContent && <div className="ml-auto">{rightContent}</div>}
        </div>
    );
}