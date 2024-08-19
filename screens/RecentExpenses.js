import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { fetchExpensesAPI } from "../util/http";
import { getDateMinusDays } from "../util/date";
import { setExpenses } from "../store/expense";

const RecentExpenses = () => {
  const { expenses } = useSelector((state) => state.expense);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    fetchExpensesAPI()
      .then((data) => {
        dispatch(setExpenses(data));
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error)
        setError("Could not fetch expenses!");
      });
  }, []);

  const recentExpenses = expenses.filter((exp) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return exp.date >= date7DaysAgo && exp.date <= today;
  });

  const getOverlays = () => {
    if (isLoading) return <LoadingOverlay />;
    else if (!isLoading && error)
      return <ErrorOverlay message={error} onConfirm={() => setError("")} />;
  };

  return (
    <>
      {isLoading || error ? (
        <>{getOverlays()}</>
      ) : (
        <ExpensesOutput
          expensesPeriod={"Last 7 Days"}
          expenses={recentExpenses}
          fallbackText={"No expenses registered for last 7 days!"}
        />
      )}
    </>
  );
};

export default RecentExpenses;
