import React from 'react';

const securityItems = [
    {
        title: 'Fund Security',
        description: 'Your funds are secured with multi-signature wallets and cold storage. We use industry-leading security practices.'
    },
    {
        title: 'Address Verification',
        description: 'Always verify withdrawal addresses carefully. Transactions are irreversible once confirmed on the blockchain.'
    },
    {
        title: 'Network Fees',
        description: 'Network fees vary based on blockchain congestion. Fees are deducted from your withdrawal amount.'
    },
    {
        title: '24/7 Support',
        description: 'Our support team is available around the clock to assist with any wallet-related issues or questions.'
    }
];

export default function SecurityNotice() {
    return (
        <div className="mt-8 card">
            <h3 className="text-lg font-medium text-white mb-4">Security & Important Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {securityItems.map((item, index) => (
                    <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 w-2 h-2 bg-brand rounded-full mt-2 mr-3"></div>
                        <div>
                            <h4 className="font-medium text-brand text-sm mb-1">{item.title}</h4>
                            <p className="text-gradient-secondary text-sm">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
