import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import { fetchExpensesAPI } from "../util/http";
import { setExpenses } from "../store/expense";

const AllExpenses = () => {
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
        setError("Could not fetch expenses!");
      });
  }, []);

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
          expensesPeriod={"All"}
          expenses={expenses}
          fallbackText={"No expenses found!"}
        />
      )}
    </>
  );
};

export default AllExpenses;
