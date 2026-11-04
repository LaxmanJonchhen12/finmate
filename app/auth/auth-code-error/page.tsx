export default function AuthCodeError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Authentication Code Error</h1>
      <p className="text-gray-600 mb-8">
        There was an error with your authentication code. Please try again.
      </p>
      <a
        href="/login"
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
      >
        Go to Login
      </a>
    </div>
  );
}