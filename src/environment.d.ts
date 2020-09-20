declare global {
  namespace NodeJs {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      PORT?: string;
      MONGODB_URI: string;
    }
  }
}

export { }