import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCompletedOrder } from "../../Redux/orderSlice"; // Import the Redux action
import socket from "../sockets/socket";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ActiveOrderCard = ({ order, onOrderComplete, onUpdate }) => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch(); // Dispatch to Redux
  const navigate = useNavigate();
  const user_id = currentUser?._id; // Add optional chaining for currentUser
  const user_type = currentUser?.user_type; // Add optional chaining for user_type
  const [completeLoader, setCompleteLoader] = useState(false);
  const [buyerCompleteLoader, setbuyerCompleteLoader] = useState(false);
  const [buyerReportLoader, setbuyerReportLoader] = useState(false);

  console.log(order);

  const handleChatClick = () => {
    if (!socket.connected) {
      socket.on("connect", () => {
        console.log("Connected to Socket.io");
      });
    }

    // Check if order and buyer_id exist before proceeding
    if (user_type == "service provider" && order && order.buyer_id && order.buyer_id._id) {
      socket.emit("createChat", {
        senderId: user_id,
        receiverId: order.buyer_id._id,
      });
    } else {
      console.log(order)
      console.error("Order or buyer_id is undefined");
    }

    if (user_type == "buyer" && order && order.service_provider_id && order.service_provider_id._id) {
      socket.emit("createChat", {
        senderId: user_id,
        receiverId: order.service_provider_id._id,
      });
    } else {
      console.log(order)
      console.error("Order or buyer_id is undefined");
    }

    // Listen for either the existing or newly created chat
    socket.on("chatExists", (chat) => {
      const chatId = chat._id; // Extract chat ID
      socket.emit("joinRoom", chat._id);
      if (user_type === "service provider") {
      navigate(`/message/id?query=${encodeURIComponent(chatId)}&title=${encodeURIComponent(order.buyer_id?.name)}`); // Navigate to the message section with chat ID
      } else {
        navigate(`/message/id?query=${encodeURIComponent(chatId)}&title=${encodeURIComponent(order.service_provider_id?.name)}`); // Navigate to the message section with chat ID
      }  
    });
    socket.on("chatCreated", (newChat) => {
      const chatId = newChat._id; // Extract chat ID
      socket.emit("joinRoom", newChat._id);
      navigate(`/message/id?query=${encodeURIComponent(chatId)}`);
    });
  };

  const handleOrderComplete = async () => {
    setCompleteLoader(true);
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/complete_by_freelancer",
        {
          order_id: order._id,
        }
      );

      if (response.data) {
        dispatch(setCompletedOrder(order)); // Store the completed order in Redux
        onUpdate(); // Call the parent function to update the order state
        setCompleteLoader(false);
      }
    } catch (error) {
      setCompleteLoader(false);
      console.error("Failed to mark order as complete", error);
      alert("Could not mark the order as complete. Please try again.");
    }
  };

  const handleBuyerOrderComplete = async () => {
    setbuyerCompleteLoader(true);
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/confirm_completion",
        {
          order_id: order._id,
          action: "confirm",
        }
      );
      if (response.data) {
        dispatch(setCompletedOrder(order)); // Store the completed order in Redux
        if (user_type === "buyer") {
          navigate("/payment"); // Navigate to payment page
        }
        onUpdate();
      }
      setbuyerCompleteLoader(false);
    } catch (error) {
      setbuyerCompleteLoader(false);
      console.error("Failed to mark order as complete", error);
      alert("Could not mark the order as complete. Please try again.");
    }
  };

  const handleBuyerOrderDispute = async () => {
    setbuyerReportLoader(true);
    try {
      const response = await axios.patch(
        "https://backend-qyb4mybn.b4a.run/order/confirm_completion",
        {
          order_id: order._id,
          action: "dispute",
        }
      );
      if (response.data) {
        onUpdate();
      }
      setbuyerReportLoader(false);
    } catch (error) {
      setbuyerReportLoader(false);
      console.error("Failed to report issue", error);
      alert("Could not report the issue. Please try again.");
    }
  };

  return (
    <div className="bg-white shadow-md hover:shadow-lg p-6 rounded-lg transition-shadow">
      {/* Client's Name */}
      <h3 className="font-bold text-lg">
        {user_type === "buyer" ? "Service Provider: " : "Client: "}
        {user_type === "buyer"
          ? order.service_provider_id?.name
          : order.buyer_id?.name}
      </h3>

      {/* Service Provided */}
      <p className="text-gray-600">Service: {order.description}</p>

      {/* Time and Date */}
      <p className="text-gray-600">
        Time:{" "}
        {order.accepted_by === "buyer"
          ? order.service_provider_time
          : order.appointment_time}
      </p>
      <p className="text-gray-600">
        Date:{" "}
        {order.accepted_by === "buyer"
          ? new Date(order.service_provider_date).toLocaleDateString("en-GB")
          : new Date(order.appointment_date).toLocaleDateString("en-GB")}
      </p>

      {/* Price */}
      <p className="font-bold text-green-500 text-xl">
        Price:{" "}
        {order.accepted_by === "buyer" && order.service_provider_price !== 0
          ? order.service_provider_price
          : order.price}
      </p>

      {/* Chat Button */}
      <div className="mt-4">
        <button
          onClick={handleChatClick}
          className="inline-block bg-custom-violet px-4 py-2 rounded-lg w-full text-center text-white"
        >
          Chat
        </button>

        {user_type === "buyer" ? (
          order.order_status === "pending confirmation" ? (
            <div className="flex flex-col space-y-2 mt-2">
              <p className="font-medium text-gray-700">
                Your service provider has marked this order as{" "}
                <span className="font-semibold text-green-600">completed</span>.
                Please confirm or report any issues.
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={handleBuyerOrderComplete}
                  disabled={buyerCompleteLoader}
                  className="inline-flex flex-1 justify-center items-center bg-green-500 px-4 py-2 rounded-lg text-white"
                >
                  {buyerCompleteLoader ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                  ) : (
                    "Mark as Complete"
                  )}
                </button>
                <button
                  onClick={handleBuyerOrderDispute}
                  disabled={buyerReportLoader}
                  className="inline-flex flex-1 justify-center items-center bg-red-500 px-4 py-2 rounded-lg text-white"
                >
                  {buyerReportLoader ? (
                    <FontAwesomeIcon icon={faSpinner} spin className="w-5 h-5" />
                  ) : (
                    "Report"
                  )}
                </button>
              </div>
            </div>
          ) : order.order_status === "in progress" ? (
            <p className="font-medium text-blue-500 mt-2">
              Your order is currently <span className="font-semibold">in progress</span>.
              Please wait for the service provider to mark it as completed.
            </p>
          ) : (
            <button
              onClick={handleOrderComplete}
              disabled={completeLoader}
              className={`w-full inline-block px-4 py-2 ${completeLoader ? "bg-green-400" : "bg-green-500"
                } text-white rounded-lg text-center mt-1`}
            >
              {completeLoader ? (
                <FontAwesomeIcon
                  icon={faSpinner}
                  spin
                  className="mx-auto w-5 h-5"
                />
              ) : (
                "Mark as Complete"
              )}
            </button>
          )
        ) : <button
          onClick={handleOrderComplete}
          disabled={completeLoader}
          className={`w-full inline-block px-4 py-2 ${completeLoader ? "bg-green-400" : "bg-green-500"
            } text-white rounded-lg text-center mt-1`}
        >
          {completeLoader ? (
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="mx-auto w-5 h-5"
            />
          ) : (
            "Mark as Complete"
          )}
        </button>}
      </div>
    </div>
  );
};

export default ActiveOrderCard;
