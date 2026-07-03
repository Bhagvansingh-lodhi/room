export default function ApiResponse(success, message, data = {}, errors = []) {
  return {
    success,
    message,
    data,
    errors,
  };
}
