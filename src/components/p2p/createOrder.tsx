import React, { useState } from "react";
import Modal from "../ui/Modal";
import { useToastContext } from "@/components/ui/ToastContext";
import { useCreateTradeMutation } from "@/services/p2pService";

interface CreateOrderFormProps {
  onBack: () => void;
  trade: {
    _id: string;
    crypto: string;
    fiat: string;
    price: number;
    maxLimit: number;
    minLimit: number;
    available: number;
    sellerName: string;
    paymentMethod: string;
  } | null;
}

export default function CreateOrderForm({
  onBack,
  trade,
}: CreateOrderFormProps) {
  const { success: toastSuccess, error: toastError } = useToastContext();
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [createTrade] = useCreateTradeMutation();

  if (!trade) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) {
      toastError("Enter a valid quantity");
      return;
    }

    const total = parseFloat(quantity) * trade.price;
    if (quantity < trade.minLimit || quantity > trade.maxLimit) {
      toastError(
        `Amount must be between ${trade.minLimit} and ${trade.maxLimit} ${trade.fiat}`,
      );
      return;
    }

    try {
      setLoading(true);
      const { message } = await createTrade({
        adId: trade._id,
        quantity,
      }).unwrap();
      if (message) {
        toastSuccess(`${message}`);
      }
      setQuantity("");
      onCloseModal();
    } catch (err: any) {
      toastError(err?.data?.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };
  const onCloseModal = () => {
    setQuantity("");
    onBack();
  };

  return (
    <Modal
      isOpen={Object(trade).hasOwnProperty("_id")}
      onClose={onCloseModal}
      title={`${trade?.side === "buy" ? "Buy" : "Sell"} ${trade?.firstCoin}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <p className="text-sm text-white mb-2">
            Price:{" "}
            <strong>
              {trade.price} {trade.secondCoin}
            </strong>
          </p>
          <p className="text-sm text-white mb-2">
            Available:{" "}
            <strong>
              {trade.reminingQuantity} {trade.firstCoin}
            </strong>
          </p>
          <p className="text-sm text-white mb-4">
            Min:{" "}
            <strong>
              {trade.minLimit} {trade.firstCoin}
            </strong>{" "}
            | Max:{" "}
            <strong>
              {trade?.maxLimit} {trade.firstCoin}{" "}
            </strong>
          </p>
          <p className="text-sm text-white mb-4">
            Seller: <strong>{trade.userCode}</strong> | Payment:{" "}
            <strong>{trade.payBy}</strong>
          </p>
          <label className="block text-sm text-white mb-2">
            Quantity ({trade.firstCoin})
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="form-input"
            placeholder="Enter crypto quantity"
            min="0"
            step="any"
            required
          />
        </div>

        <button
          type="submit"
          className={`btn-primary w-full ${loading ? "btn-disabled" : ""}`}
          disabled={loading}
        >
          {loading
            ? "Placing Order..."
            : `${trade?.side === "buy" ? "Buy" : "Sell"} ${trade?.firstCoin}`}
        </button>
      </form>
    </Modal>
  );
}
