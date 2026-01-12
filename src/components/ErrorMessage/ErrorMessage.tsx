import React from "react";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      className="text-center p-8 bg-red-50 border border-red-500 rounded-lg"
      role="alert"
    >
      <p className="m-0 mb-4 text-red-500 font-medium">{message}</p>
      {onRetry && (
        <button
          className="py-2 px-6 text-sm font-medium text-white bg-red-500 border-none rounded-lg cursor-pointer transition-colors duration-200 hover:bg-red-600 focus-visible:outline-3 focus-visible:outline-white focus-visible:outline-offset-2"
          onClick={onRetry}
          type="button"
        >
          Retry
        </button>
      )}
    </div>
  );
};
