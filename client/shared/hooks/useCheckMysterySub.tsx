import { useContext, useEffect, useState } from "react";
import AccountContext from "../../store/account-context";
import { SubscriptionNameEnum } from "../../models/SubscriptionOrder.model";

export const useCheckMysterySub = () => {
  const [isMystery, setIsMystery] = useState(false);
  const accountManager = useContext(AccountContext);

  useEffect(() => {
    const subscriptionName = accountManager?.userDetails?.attributes.subscription_name;
    subscriptionName === SubscriptionNameEnum.MYSTERY && setIsMystery(true);
  }, [accountManager?.userDetails]);

  return { isMystery };
};
