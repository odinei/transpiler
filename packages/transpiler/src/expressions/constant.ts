import {Expressions, Nodes} from "@abaplint/core";
import {Traversal} from "../traversal";
import {IExpressionTranspiler} from "./_expression_transpiler";

export class ConstantTranspiler implements IExpressionTranspiler {
  private readonly addGet: boolean;

  public constructor(addGet = false) {
    this.addGet = addGet;
  }

  public transpile(node: Nodes.ExpressionNode, _traversal: Traversal): string {
    const int = node.findFirstExpression(Expressions.Integer);
    if (int && this.addGet === true) {
      return "constant_" + int.getFirstToken().getStr() + ".get()";
    } else if (int) {
      return "constant_" + int.getFirstToken().getStr();
    }

    const str = node.findFirstExpression(Expressions.ConstantString);
    if (str) {
      let res = str.getFirstToken().getStr();
      res = res.replace(/\\/g, "\\\\");
      return res;
    }

    return "todo, Constant";
  }

}