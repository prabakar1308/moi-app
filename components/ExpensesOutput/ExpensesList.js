import { FlatList } from "react-native";

import ExpenseItem from "./ExpenseItem";

const renderExpenseItem = (item) => {
  return <ExpenseItem {...item} />;
};

const ExpensesList = ({ expenses }) => {
  return (
    <FlatList
      data={expenses}
      renderItem={({ item }) => renderExpenseItem(item)}
      keyExtractor={(item) => item.id}
    />
  );
};

export default ExpensesList;
