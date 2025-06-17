import React, { useEffect, useState } from "react";
import Modal from "../ui/Modal";
import { QrCodeIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { copyToClipboard } from "@/lib/utils";
import { QRCodeComponent } from "@/components/ui/QRcode";
import { useGetDepositAddressMutation } from "@/services/walletService";

interface DepositFormProps {
  selectedCoin: any;
  depositAddress: string;
  onBack: () => void;
}

const inintalFrom = {

  type: "", //coin,token
  loader: true,
  address: "",
  coinId: "",
  coin: "",
  availablNetwork: "",
  selectedNetWwork: "",
};

export default function DepositForm({
  selectedCoin,
  onBack,
}: DepositFormProps) {
  const [form, setFrom] = useState(inintalFrom);
  const {
    type,
    loader,
    address,
    selectedNetWwork,
    coinId,
    coin,
    availablNetwork,
  } = form;

  const [getDepositAddress, { isLoading }] = useGetDepositAddressMutation();

  useEffect(() => {
    if (selectedCoin?.coinDoc) {
      setFrom((prev) => {
        return {
          loader: true,
          type: selectedCoin?.coinDoc?.type,
          address: selectedCoin.address,
          coinId: selectedCoin.coinDoc?._id,
          coin: selectedCoin.coin,
          availablNetwork: selectedCoin?.coinDoc?.network,
          selectedNetWwork: "",
        };
      });
      if (selectedCoin?.coinDoc?.type == "coin") {
        getDepositAdd(
          selectedCoin?.coinDoc?.network?.[0]?.chainName,
          selectedCoin?.coinDoc?._id,
          selectedCoin?.coinDoc?.type,
        );
      }
    }
  }, [selectedCoin]);

  const handleAddress = (e: any) => {
    try {
      setFrom((prev) => {
        return {
          ...prev,
          loader: true,
          selectedNetWwork: e.target.value,
        };
      });
      getDepositAdd(e.target.value, coinId, type);
    } catch (e) {
      console.log("🚀 ~ handleAddress ~ e:", e);
    }
  };

  const getDepositAdd = async (chainName: any, chanId: any, chanType: any) => {
    try {
      if (!chainName || !chanId || !chanType) return;
      setFrom((prev) => {
        return {
          ...prev,
          loader: true,
        };
      });
      let params = {
        coinId: chanId,
        type: chanType,
        chainName: chainName,
      };
      const { success, data, message } =
        await getDepositAddress(params).unwrap();
      if (success)
        setFrom((prev) => {
          return {
            ...prev,
            address: data?.address,
            loader: false,
          };
        });
    } catch (err) {
      console.log("🚀 ~ getDepositAdd ~ err:", err);
    }
  };

  return (
    <Modal
      isOpen={selectedCoin !== ""}
      onClose={onBack}
      title={"Deposit"}
      size="lg"
    >
      <div className="space-y-6">
        <div className="card-dark">
          <div className="flex-between mb-4">
            <div className="font-medium text-white">{coin} Deposit Address</div>
            <span className="badge badge-success text-xs">
              {selectedCoin?.coin} Network
            </span>
          </div>
          {type == "token" && (
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Network
              </label>
              <select className="form-select" onChange={handleAddress}>
                <option value={""}>Select Network</option>
                {availablNetwork?.map((item: any) => {
                  return (
                    <option value={item?.chainName}>{item?.chainName}</option>
                  );
                })}
              </select>
            </div>
          )}
          {loader &&
            selectedNetWwork !=
              "" &&(
                <div className="flex items-center justify-center">
                  <div className="loading-spinner mr-2"></div>
                  Loading...
                </div>,
              )}
          {!loader && address && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Deposit Address
                </label>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={address ?? ""}
                    className="form-input flex-1 rounded-r-none bg-[#08090a] text-brand font-mono text-sm"
                  />
                  <button
                    disabled={!address}
                    onClick={() =>
                      copyToClipboard(
                        address ?? "",
                        "Address copied to clipboard!",
                      )
                    }
                    className="btn-primary rounded-l-none px-4 flex items-center"
                  >
                    <ClipboardIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex-center">
                <div className="bg-white p-4 rounded-lg">
                  <div className="w-32 h-32 bg-gray-100 flex-center text-gray-400 rounded">
                    <div className="text-center">
                      <QRCodeComponent
                        value={address || address}
                        size={150}
                        level="M"
                        includeMargin={true}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="alert-warning">
          <p className="text-sm">
            <strong>Important:</strong> Only send {coin} to this address on the{" "}
            {coin} network. Sending any other cryptocurrency or using a
            different network may result in permanent loss of funds.
          </p>
        </div>

        <div className="card-dark">
          <h4 className="font-medium text-brand mb-3">Deposit Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex-between">
              <span className="text-gradient-secondary">Minimum Deposit:</span>
              <span className="text-white">0.001 {coin}</span>
            </div>
            <div className="flex-between">
              <span className="text-gradient-secondary">
                Confirmations Required:
              </span>
              <span className="text-white">
                {coin === "BTC" ? "3" : coin === "ETH" ? "12" : "6"}
              </span>
            </div>
            <div className="flex-between">
              <span className="text-gradient-secondary">Expected Arrival:</span>
              <span className="text-white">5-30 minutes</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
