import React from 'react';
import { QrCodeIcon, ClipboardIcon } from '@heroicons/react/24/outline';
import { copyToClipboard } from '@/lib/utils';

interface DepositFormProps {
    selectedCoin: string;
    depositAddress: string;
    onBack: () => void;
}

export default function DepositForm({ selectedCoin, depositAddress, onBack }: DepositFormProps) {
    return (
        <div className="space-y-6">
            <div className="card-dark">
                <div className="flex-between mb-4">
                    <div className="font-medium text-white">
                        {selectedCoin} Deposit Address
                    </div>
                    <span className="badge badge-success text-xs">
                        {selectedCoin} Network
                    </span>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">
                            Deposit Address
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                readOnly
                                value={depositAddress}
                                className="form-input flex-1 rounded-r-none bg-[#08090a] text-brand font-mono text-sm"
                            />
                            <button
                                onClick={() => copyToClipboard(depositAddress, 'Address copied to clipboard!')}
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
                                    <QrCodeIcon className="h-8 w-8 mx-auto mb-2" />
                                    <div className="text-xs">QR Code</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="alert-warning">
                <p className="text-sm">
                    <strong>Important:</strong> Only send {selectedCoin} to this address on the {selectedCoin} network.
                    Sending any other cryptocurrency or using a different network may result in permanent loss of funds.
                </p>
            </div>

            <div className="card-dark">
                <h4 className="font-medium text-brand mb-3">Deposit Information</h4>
                <div className="space-y-2 text-sm">
                    <div className="flex-between">
                        <span className="text-gradient-secondary">Minimum Deposit:</span>
                        <span className="text-white">0.001 {selectedCoin}</span>
                    </div>
                    <div className="flex-between">
                        <span className="text-gradient-secondary">Confirmations Required:</span>
                        <span className="text-white">{selectedCoin === 'BTC' ? '3' : selectedCoin === 'ETH' ? '12' : '6'}</span>
                    </div>
                    <div className="flex-between">
                        <span className="text-gradient-secondary">Expected Arrival:</span>
                        <span className="text-white">5-30 minutes</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
