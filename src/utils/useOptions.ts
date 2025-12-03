import { createUseOptions } from "./useCreateOptions";
import { ACCOUNT_STATUS_OPTIONS } from "@/constants/options";

export const useAccountStatus = createUseOptions(
    ACCOUNT_STATUS_OPTIONS,
    "账户状态"
);
