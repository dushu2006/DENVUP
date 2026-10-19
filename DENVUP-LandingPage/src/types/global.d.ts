export {};

declare global {
  interface Window {
    DENVUP: {
      endpoint: string;
      route?: string;
      remount?: () => void;
    };
  }
}
