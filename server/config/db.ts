import mongoose from 'mongoose';

// 缓存连接，防止 serverless 环境下重复连接
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  // 如果已经有连接，直接返回
  if (cached.conn) {
    return cached.conn;
  }

  // 如果没有 MONGODB_URI 环境变量，抛出错误
  if (!process.env.MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
  }

  // 如果没有正在进行的连接 Promise，创建一个新的
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // 禁用缓冲命令，提高 serverless 环境下的稳定性
    };

    cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
};

export default connectDB;
