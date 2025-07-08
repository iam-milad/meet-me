const ChatMessage = ({ message, isSender }) => {
  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <span
        className={`p-3 rounded-t-2xl ${
          isSender
            ? "bg-blue-500 text-white rounded-bl-2xl"
            : "bg-white rounded-br-2xl"
        }`}
      >
        {message}
      </span>
    </div>
  );
};

export default ChatMessage;
