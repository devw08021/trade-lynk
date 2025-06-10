import React from 'react';
import { useAppDispatch } from '@/store/store';
import { selectMarketPair } from '@/store/slices/marketSlice';
import MarketSelector from '@/components/trading/MarketSelector';

interface MarketSelectorSectionProps {
    pairs: any;
    selectedPair: string | null;
}

export default function MarketSelectorSection({ pairs, selectedPair }: MarketSelectorSectionProps) {
    const dispatch = useAppDispatch();

    return (
        <div className="mb-6">
            <MarketSelector
                pairs={pairs}
                selectedPair={selectedPair}
                onSelectPair={(pair) => dispatch(selectMarketPair(pair))}
            />
        </div>
    );
}
