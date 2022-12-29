import { toast } from "react-toastify";
import useSWR, { Fetcher, Key } from "swr";
import msg from "~/common/lib/msg";
import { Allowance, Badge, Publisher } from "~/types";

export const usePublishers = () => {
  const fetcher: Fetcher<Publisher[]> = async () => {
    try {
      const allowanceResponse = await msg.request<{
        allowances: Allowance[];
      }>("listAllowances");
      const allowances: Publisher[] = allowanceResponse.allowances.reduce<
        Publisher[]
      >((acc, allowance) => {
        if (!allowance?.id || !allowance.enabled) return acc;

        const {
          id,
          host,
          imageURL,
          name,
          payments,
          paymentsAmount,
          paymentsCount,
          percentage,
          totalBudget,
          usedBudget,
        } = allowance;

        const badges: Badge[] = [];
        if (allowance.remainingBudget > 0) {
          badges.push({
            label: "active",
            color: "green-bitcoin",
            textColor: "white",
          });
        }
        if (allowance.lnurlAuth) {
          badges.push({
            label: "auth",
            color: "green-bitcoin",
            textColor: "white",
          });
        }
        acc.push({
          id,
          host,
          imageURL,
          name,
          payments,
          paymentsAmount,
          paymentsCount,
          percentage,
          totalBudget,
          usedBudget,
          badges,
        });

        return acc;
      }, []);

      return allowances;
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        toast.error(`Error: ${e.message}`);
        throw e;
      }
      return [];
    }
  };
  const key: Key = "publishers";
  return useSWR(key, fetcher);
};
