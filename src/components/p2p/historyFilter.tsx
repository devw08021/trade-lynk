import React from "react";

export default function TradeFilter({
  pair = [],
  paymentMethods = [],
  selectedAsset,
  selectedFiatCurrency,
  selectedPaymentMethod,
  tradeType,
  isLoadingPaymentMethods = false,
  onAssetChange,
  onFiatCurrencyChange,
  onPaymentMethodChange,
  onTradeTypeChange,
}) {
  const uniqueFirstCoins = Array.from(
    new Map(pair.map((currency) => [currency.firstCoin, currency])).values()
  );
  const uniqueSecondCoins = Array.from(
    new Map(pair.map((currency) => [currency.secondCoin, currency])).values()
  );

  return (
    <div className="card p-4 mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Buy/Sell Selector */}
      <div className="flex flex-col">
        <label htmlFor="tradeType" className="block text-sm font-medium text-white mb-2">
          Trade Type
        </label>
        <select
          id="tradeType"
          value={tradeType}
          onChange={(e) => onTradeTypeChange(e.target.value)}
          className="form-select"
        >
          <option value="all">All</option>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>

      {/* Asset Filter */}
      <div className="flex flex-col">
        <label htmlFor="asset" className="block text-sm font-medium text-white mb-2">
          Cryptocurrency
        </label>
        <select
          id="asset"
          value={selectedAsset}
          onChange={(e) => onAssetChange(e.target.value)}
          className="form-select"
        >
          <option value="">All cryptocurrencies</option>
          {uniqueFirstCoins.map((currency) => (
            <option key={currency.firstCoinId} value={currency.firstCoinId}>
              {currency.firstCoin}
            </option>
          ))}
        </select>
      </div>

      {/* Fiat Currency Filter */}
      <div className="flex flex-col">
        <label htmlFor="fiatCurrency" className="block text-sm font-medium text-white mb-2">
          Fiat Currency
        </label>
        <select
          id="fiatCurrency"
          value={selectedFiatCurrency}
          onChange={(e) => onFiatCurrencyChange(e.target.value)}
          className="form-select"
        >
          <option value="">All fiat currencies</option>
          {uniqueSecondCoins.map((currency) => (
            <option key={currency.secondCoinId} value={currency.secondCoinId}>
              {currency.secondCoin}
            </option>
          ))}
        </select>
      </div>

      {/* Payment Method Filter */}
      <div className="flex flex-col">
        <label htmlFor="paymentMethod" className="block text-sm font-medium text-white mb-2">
          Payment Method
        </label>
        <select
          id="paymentMethod"
          value={selectedPaymentMethod || ""}
          onChange={(e) => onPaymentMethodChange(e.target.value || null)}
          disabled={isLoadingPaymentMethods}
          className={`form-select ${isLoadingPaymentMethods ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <option value="">All payment methods</option>
          {paymentMethods.map((method) => (
            <option key={method} value={method}>
              {method}
            </option>
          ))}
        </select>
        {isLoadingPaymentMethods && (
          <div className="mt-1 flex items-center">
            <div className="loading-spinner mr-2" style={{ width: "12px", height: "12px" }}></div>
            <span className="text-xs text-gradient-secondary">Loading payment methods...</span>
          </div>
        )}
      </div>
    </div>
  );
}
