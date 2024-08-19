import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import Input from "../UI/Input";
import Button from "../UI/Button";
import { getFormattedDate } from "../../util/date";
import { GlobalStyles } from "../../constants/styles";

const ExpenseForm = ({ onCancel, onSubmit, submitBtnLabel, defaultValues }) => {
  const [formData, setFormData] = useState({
    amount: defaultValues ? defaultValues.amount.toString() : "",
    date: defaultValues ? getFormattedDate(defaultValues.date) : "",
    description: defaultValues ? defaultValues.description : "",
  });

  const [formValidation, setFormValidation] = useState({
    amount: true,
    date: true,
    description: true,
  });

  const inputChangedHandler = (value, key) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setFormValidation((prev) => ({ ...prev, [key]: true }));
  };

  const submitHandler = () => {
    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      date: new Date(formData.date),
    };

    const amountIsValid = !isNaN(expenseData.amount) && expenseData.amount > 0;
    const dateIsValid = expenseData.date.toString() !== "Invalid Date";
    const descriptionIsValid = expenseData.description.trim().length > 0;

    if (amountIsValid && dateIsValid && descriptionIsValid)
      onSubmit(expenseData);
    else {
      // Alert.alert("Invalid Input", "Please check your input values");
      setFormValidation({
        amount: amountIsValid,
        date: dateIsValid,
        description: descriptionIsValid,
      });
    }
  };

  const formIsValid =
    formValidation.amount && formValidation.date && formValidation.description;

  return (
    <View style={styles.formContainer}>
      <Text style={styles.title}>Expense Details</Text>
      <View style={styles.inputsRow}>
        <Input
          style={styles.inputStyle}
          label="Amount"
          invalid={!formValidation.amount}
          inputProps={{
            keyboardType: "decimal-pad",
            onChangeText: (value) => inputChangedHandler(value, "amount"),
            value: formData.amount,
          }}
        />
        <Input
          style={styles.inputStyle}
          label="Date"
          invalid={!formValidation.date}
          inputProps={{
            keyboardType: "default",
            placeholder: "YYYY-MM-DD",
            maxLength: 10,
            onChangeText: (value) => inputChangedHandler(value, "date"),
            value: formData.date,
          }}
        />
      </View>
      <Input
        label="Description"
        invalid={!formValidation.description}
        inputProps={{
          multiline: true,
          numberOfLines: 2,
          //   autoCorrect
          //   autoCapitalize: "none"
          onChangeText: (value) => inputChangedHandler(value, "description"),
          value: formData.description,
        }}
      />
      {!formIsValid && (
        <Text style={styles.errorText}>
          Invalid input value - Please check your input values
        </Text>
      )}
      <View style={styles.buttons}>
        <Button mode="flat" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
        <Button onPress={submitHandler} style={styles.button}>
          {submitBtnLabel}
        </Button>
      </View>
    </View>
  );
};

export default ExpenseForm;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginVertical: 24,
    textAlign: "center",
  },
  inputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputStyle: {
    flex: 1,
  },
  errorText: {
    textAlign: "center",
    color: GlobalStyles.colors.error500,
    margin: 8,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    minWidth: 120,
    marginHorizontal: 8,
  },
});
