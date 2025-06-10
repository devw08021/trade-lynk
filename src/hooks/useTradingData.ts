// hooks/useTradingData.ts
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { selectMarketPair } from "@/store/slices/marketSlice";
import {
  useGetAllMarketPairsQuery,
  useGetOrderBookQuery,
  useGetRecentTradesQuery,
} from "@/services/spotService";
import { STATIC_MARKET_DATA } from "@/data";

export function useTradingData() {
  const dispatch = useAppDispatch();
  const selectedPair = useAppSelector((state) => state.market.selectedPair);

  const {
    data: marketPairs,
    isLoading: isLoadingPairs,
    isError: isPairsError,
  } = useGetAllMarketPairsQuery();
  const { data: orderBook, isError: isOrderBookError } = useGetOrderBookQuery(
    selectedPair || "",
    { skip: !selectedPair }
  );
  const { data: recentTrades, isError: isTradesError } =
    useGetRecentTradesQuery(
      { symbol: selectedPair || "" },
      { skip: !selectedPair }
    );

  const effectiveMarketPairs =
    isPairsError || !marketPairs ? STATIC_MARKET_DATA.pairs : marketPairs;
  const effectiveOrderBook =
    isOrderBookError || !orderBook ? STATIC_MARKET_DATA.orderBook : orderBook;
  const effectiveRecentTrades =
    isTradesError || !recentTrades
      ? STATIC_MARKET_DATA.recentTrades
      : recentTrades;

  useEffect(() => {
    const symbolFromUrl = "";
    const defaultPair = Object.keys(effectiveMarketPairs)[0];

    if (symbolFromUrl && symbolFromUrl in effectiveMarketPairs) {
      dispatch(selectMarketPair(symbolFromUrl));
    } else if (!selectedPair && defaultPair) {
      dispatch(selectMarketPair(defaultPair));
    }
  }, [effectiveMarketPairs, selectedPair, dispatch]);

  const currentPair = selectedPair
    ? effectiveMarketPairs[selectedPair as keyof typeof effectiveMarketPairs]
    : null;

  return {
    effectiveMarketPairs,
    effectiveOrderBook,
    effectiveRecentTrades,
    isLoadingPairs,
    currentPair,
  };
}
