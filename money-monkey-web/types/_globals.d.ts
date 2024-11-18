export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      onboardingComplete?: boolean;
    };
  }

  interface Window {
    handleSignInWithGoogle: (response: {
      credential: string;
      select_by: string;
      state?: string;
    }) => void;
  }
}
