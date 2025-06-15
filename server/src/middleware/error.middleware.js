/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  // 记录错误日志
  console.error(`[Error] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // 向客户端发送错误响应
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

/**
 * 自定义API错误类
 */
class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 404错误处理中间件
 */
const notFound = (req, res, next) => {
  const error = new ApiError(`找不到 - ${req.originalUrl}`, 404);
  next(error);
};

module.exports = {
  errorHandler,
  ApiError,
  notFound
}; 