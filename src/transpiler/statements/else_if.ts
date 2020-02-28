import * as abaplint from "abaplint";
import {IStatementTranspiler} from "./_statement_transpiler";
import {CondTranspiler} from "../expressions";

export class ElseIfTranspiler implements IStatementTranspiler {

  public transpile(node: abaplint.Nodes.StatementNode): string {
    const cond = new CondTranspiler().transpile(node.findFirstExpression(abaplint.Expressions.Cond)!);
    return "} else if (" + cond + ") {";
  }

}