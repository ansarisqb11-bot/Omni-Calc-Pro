import { useState } from "react";
import { create, all } from "mathjs";
import { useHistory } from "./use-history";

const math = create(all);

export function useCalculator(category = "General") {
  const [expression, setExpression] = useState("");
  const [result, setResult] = useState("");
  const { addHistory } = useHistory();

  const handleInput = (val: string) => {
    setExpression((prev) => prev + val);
  };

  const clear = () => {
    setExpression("");
    setResult("");
  };

  const backspace = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  const evaluate = () => {
    try {
      if (!expression) return;
      // Replace visual operators with math operators
      const sanitized = expression
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/π/g, "pi")
        .replace(/√/g, "sqrt");

      const res = math.evaluate(sanitized);
      const formattedResult = math.format(res, { precision: 14 });
      
      setResult(formattedResult);
      addHistory({
        expression,
        result: formattedResult,
        category,
      });
    } catch (err) {
      setResult("Error");
    }
  };

  return {
    expression,
    result,
    handleInput,
    clear,
    backspace,
    evaluate,
    setExpression,
  };
}
