import { AuthCoreContextProvider } from "@particle-network/auth-core-modal";
import { ReactNode } from "react";

interface CoreContextProviderProps {
  children: ReactNode;
}

export const CoreContextProvider = ({ children }: CoreContextProviderProps) => {
  return (
    <AuthCoreContextProvider
      options={{
        projectId: "a54076a8-8c47-4055-8090-30ba53356593",
        clientKey: "cYy4WdR9w5DfBsoWvmGsSQFWPADTffgIaCrDtZzk",
        appId: "a49face1-9729-4464-90b1-51cd85c0604f",
        promptSettingConfig: {
          //optional
          //set payment password prompt: none, first, every, everyAndNotSkip.
          promptPaymentPasswordSettingWhenSign: 2,
          //set master password prompt: none, first, every, everyAndNotSkip.
          promptMasterPasswordSettingWhenLogin: 1,
        },
        wallet: {
          visible: true, //show wallet entrance when connect success.
        },
      }}
    >
      {children}
    </AuthCoreContextProvider>
  );
};
