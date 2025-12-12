import { createUseOptions } from "./useCreateOptions";
import {
    ACCOUNT_STATUS_OPTIONS,
    DOWNLOAD_FILE_PREPARE_STATUS_OPTIONS,
    ASSESS_ITEM_REVIEW_STATUS_OPTIONS,
} from "@/constants/options";

export const useAccountStatus = createUseOptions(ACCOUNT_STATUS_OPTIONS, "账户状态");
export const useDownloadFilePrepareStatus = createUseOptions(
    DOWNLOAD_FILE_PREPARE_STATUS_OPTIONS,
    "文件准备状态"
);
export const useAssessItemReviewStatus = createUseOptions(
    ASSESS_ITEM_REVIEW_STATUS_OPTIONS,
    "评估项审阅状态"
);
