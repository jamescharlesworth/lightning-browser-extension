import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import msg from "~/common/lib/msg";
import { Allowance, Badge, Publisher } from "~/types";

let PERSISTED_PUBLISHERS = [] as Publisher[];

type State = {
  publishers: Publisher[];
  isLoading: boolean;
  error?: string;
};

export const usePublishers = (): State => {
  const [state, setState] = useState<State>({
    publishers: PERSISTED_PUBLISHERS,
    isLoading: true,
  });

  async function fetchData() {
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

      setState({
        publishers: allowances,
        isLoading: false,
      });
      PERSISTED_PUBLISHERS = allowances;
    } catch (e) {
      console.error(e);
      let message: string;
      if (e instanceof Error) {
        message = e.message;
        toast.error(`Error: ${message}`);
      }
      setState((existingState) => ({
        ...existingState,
        isLoading: false,
        error: message,
      }));
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return state;
};
