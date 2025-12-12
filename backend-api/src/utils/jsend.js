// utils/jsend.js

/**
 * @param {object | null} data
 * @returns {{ status: 'success', data: object | null }}
 */
function success(data = null) {
  return {
    status: "success",
    data,
  };
}

/**
 * @param {string} message
 * @param {object | null} [data]
 * @returns {{ status: 'fail', message: string, data?: object }}
 */
function fail(message, data = null) {
  const response = {
    status: "fail",
    message,
  };
  if (data) response.data = data;
  return response;
}

/**
 * @param {string} message
 * @param {object | null} [data]
 * @returns {{ status: 'error', message: string, data?: object }}
 */
function error(message, data = null) {
  const response = {
    status: "error",
    message,
  };
  if (data) response.data = data;
  return response;
}

module.exports = {
  success,
  fail,
  error,
};
