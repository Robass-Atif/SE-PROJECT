import React, { useState } from 'react';

const PendingOrderCard = ({ order, onRespond }) => {
    const [showSchedulePopup, setShowSchedulePopup] = useState(false);
    const [scheduleDate, setScheduleDate] = useState('');
    const [scheduleTime, setScheduleTime] = useState('');
    const [showCounterPricePopup, setShowCounterPricePopup] = useState(false);
    const [counterPrice, setCounterPrice] = useState('');

    // Handle response (Accept/Reject/Schedule)
    const handleResponse = (response) => {
        if (response === 'Schedule') {
            setShowSchedulePopup(true);
        } else if (response === 'CounterPrice') {
            setShowCounterPricePopup(true);
        } else {
            onRespond(order.id, response);
        }
    };

    // Handle schedule submit
    const handleScheduleSubmit = () => {
        if (scheduleDate && scheduleTime) {
            onRespond(order.id, 'Schedule', { date: scheduleDate, time: scheduleTime });
            setShowSchedulePopup(false);
        } else {
            alert('Please select both date and time.');
        }
    };

    const handleCounterPriceSubmit = () => {
        if (counterPrice) {
            onRespond(order.id, 'CounterPrice', { counterPrice });
            setShowCounterPricePopup(false);
        } else {
            alert('Please enter a counter price.');
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 w-full max-w-sm sm:max-w-none hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-bold">Order ID: {order.id}</h3>
            <p className="text-gray-600">Customer: {order.customerName}</p>
            <p className="text-gray-600">Service: {order.service}</p>
            <p className="text-gray-600">Status: 
                {order.status == "Accepted" && <span className="text-green-500 font-semibold"> {order.status}</span>}    
                {order.status == "Pending" && <span className="text-yellow-500 font-semibold"> {order.status}</span>}    
                {order.status == "Rejected" && <span className="text-red-500 font-semibold"> {order.status}</span>}    
            </p>
            <p className="text-xl font-bold text-green-500 mb-4">Client's Price: {order.clientsPrice}</p>

            {/* Responsive button container */}
            <div className="mt-4 flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-center">
                <button
                    onClick={() => handleResponse('Accept')}
                    className="w-full sm:w-auto px-4 py-2 bg-custom-violet text-white rounded-lg"
                >
                    Accept
                </button>
                <button
                    onClick={() => handleResponse('Reject')}
                    className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                    Reject
                </button>
                <button
                    onClick={() => handleResponse('Schedule')}
                    className="w-full sm:w-auto px-4 py-2 bg-custom-blue text-white rounded-lg"
                >
                    Schedule
                </button>

                <button
                    onClick={() => handleResponse('CounterPrice')}
                    className="w-full sm:w-auto px-4 py-2 bg-custom-cyan text-white rounded-lg"
                >
                    Counter Price
                </button>
            </div>

            {/* Scheduling Popup */}
            {showSchedulePopup && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Schedule Order</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Select Date
                            </label>
                            <input
                                type="date"
                                value={scheduleDate}
                                onChange={(e) => setScheduleDate(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Select Time
                            </label>
                            <input
                                type="time"
                                value={scheduleTime}
                                onChange={(e) => setScheduleTime(e.target.value)}
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowSchedulePopup(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleScheduleSubmit}
                                className="px-4 py-2 bg-custom-blue text-white rounded-lg"
                            >
                                Schedule
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Counter Price Popup */}
            {showCounterPricePopup && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Counter Price</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Enter Counter Price
                            </label>
                            <input
                                type="number"
                                value={counterPrice}
                                onChange={(e) => setCounterPrice(e.target.value)}
                                placeholder="Enter your counter price"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                        </div>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowCounterPricePopup(false)}
                                className="px-4 py-2 bg-gray-500 text-white rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCounterPriceSubmit}
                                className="px-4 py-2 bg-custom-cyan text-white rounded-lg"
                            >
                                Submit Counter Price
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PendingOrderCard;
