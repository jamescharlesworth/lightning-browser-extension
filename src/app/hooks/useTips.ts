import { useAccount } from "~/app/context/AccountContext";
import { useSettings } from "~/app/context/SettingsContext";
import { getBrowserType, isAlbyAccount } from "~/app/utils";
import { TIPS } from "~/common/constants";

const DEFAULT_TIPS = [TIPS.TOP_UP_WALLET, TIPS.DEMO, TIPS.PIN];

export const filterTips = (closedTips: TIPS[], alias = "") => {
  return DEFAULT_TIPS.filter((tip: TIPS) => {
    if (closedTips.includes(tip)) return false;

    if (tip === TIPS.TOP_UP_WALLET && !isAlbyAccount(alias)) return false;

    if (tip === TIPS.PIN && getBrowserType() !== "chrome") return false;
    return true;
  });
};

export const useTips = () => {
  const { settings, updateSetting } = useSettings();
  const { account } = useAccount();

  const tips = filterTips(settings.closedTips, account?.alias);

  const filterTip = (tip: TIPS) => {
    updateSetting({
      closedTips: [...settings.closedTips, tip],
    });
  };
  return {
    tips,
    filterTip,
  };
};
