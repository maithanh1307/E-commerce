import { Minus, Plus } from 'lucide-react';
import './QuantityStepper.css';

type Props = {
    value: number;
    max: number;
    onChange: (next: number) => void;
    label?: string;
    small?: boolean;
};

export default function QuantityStepper({ value, max, onChange, label = 'item', small }: Props) {
    return (
        <div className={`qty ${small ? 'qty--sm' : ''}`}>
            <button
                type="button"
                aria-label={`Decrease quantity of ${label}`}
                disabled={value <= 1}
                onClick={() => onChange(value - 1)}
            >
                <Minus size={14} />
            </button>
            <span className="qty__value" aria-live="polite">{value}</span>
            <button
                type="button"
                aria-label={`Increase quantity of ${label}`}
                disabled={value >= max}
                onClick={() => onChange(value + 1)}
            >
                <Plus size={14} />
            </button>
        </div>
    );
}