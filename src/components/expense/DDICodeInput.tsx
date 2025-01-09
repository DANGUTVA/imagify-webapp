import { useRef } from "react";
import { Input } from "@/components/ui/input";

interface DDICodeInputProps {
  ddiCode: {
    part1: string;
    part2: string;
    part3: string;
  };
  onDDIChange: (
    part: 'part1' | 'part2' | 'part3',
    value: string,
    maxLength: number,
    nextRef?: React.RefObject<HTMLInputElement>
  ) => void;
}

export const DDICodeInput = ({ ddiCode, onDDIChange }: DDICodeInputProps) => {
  const ddiPart1Ref = useRef<HTMLInputElement>(null);
  const ddiPart2Ref = useRef<HTMLInputElement>(null);
  const ddiPart3Ref = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">DDI-</span>
      <Input
        className="w-16"
        maxLength={4}
        value={ddiCode.part1}
        onChange={(e) => onDDIChange('part1', e.target.value, 4, ddiPart2Ref)}
        ref={ddiPart1Ref}
      />
      <span>-</span>
      <Input
        className="w-12"
        maxLength={2}
        value={ddiCode.part2}
        onChange={(e) => onDDIChange('part2', e.target.value, 2, ddiPart3Ref)}
        ref={ddiPart2Ref}
      />
      <span>-</span>
      <Input
        className="w-12"
        maxLength={2}
        value={ddiCode.part3}
        onChange={(e) => onDDIChange('part3', e.target.value, 2)}
        ref={ddiPart3Ref}
      />
    </div>
  );
};