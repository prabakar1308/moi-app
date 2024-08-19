import { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

import IconButton from "../components/UI/IconButton";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import ErrorOverlay from "../components/UI/ErrorOverlay";
import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import {
  deleteExpenseAPI,
  storeExpenseAPI,
  updateExpenseAPI,
} from "../util/http";
import { addExpense, deleteExpense, updateExpense } from "../store/expense";
import { GlobalStyles } from "../constants/styles";

const ManageExpense = ({ navigation, route }) => {
  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const { expenses } = useSelector((state) => state.expense);

  const selectedExpense = expenses.find((exp) => exp.id === editedExpenseId);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  const deleteExpenseHandler = () => {
    setIsLoading(true);
    deleteExpenseAPI(editedExpenseId)
      .then(() => {
        dispatch(deleteExpense({ id: editedExpenseId }));
        setIsLoading(false);
        navigation.goBack();
      })
      .catch(() => {
        setIsLoading(false);
        setError("Could not delete expense - please try again!");
      });
  };

  const cancelHandler = () => {
    // navigation.navigate("ExpensesOverview");
    navigation.goBack();
  };

  const confirmHandler = async (expense) => {
    setIsLoading(true);
    if (isEditing) {
      updateExpenseAPI(editedExpenseId, expense)
        .then(() => {
          dispatch(
            updateExpense({
              id: editedExpenseId,
              ...expense,
            })
          );
          setIsLoading(false);
          navigation.goBack();
        })
        .catch(() => {
          setIsLoading(false);
          setError("Could not update expense - please try again!");
        });
    } else {
      storeExpenseAPI(expense)
        .then((data) => {
          dispatch(addExpense({ ...expense, id: data }));
          setIsLoading(false);
          navigation.goBack();
        })
        .catch(() => {
          setIsLoading(false);
          setError("Could not add expense - please try again!");
        });
      // dispatch(
      //   addExpense({
      //     ...expense,
      //     // description: "New Item",
      //     // amount: 100,
      //     // date: new Date(),
      //   })
      // );
    }
  };

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
        <View style={styles.container}>
          <ExpenseForm
            onCancel={cancelHandler}
            onSubmit={confirmHandler}
            submitBtnLabel={isEditing ? "Update" : "Add"}
            defaultValues={selectedExpense}
          />

          {isEditing && (
            <View style={styles.deleteContainer}>
              <IconButton
                icon="trash"
                color={GlobalStyles.colors.error500}
                size={36}
                onPress={deleteExpenseHandler}
              />
            </View>
          )}
        </View>
      )}
    </>
  );
};

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
