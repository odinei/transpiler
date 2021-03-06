import {expect} from "chai";
import {Transpiler} from "../src";

describe("Files", () => {

  it("Two reports", async () => {
    const file1 = {filename: "zfoo1.prog.abap", contents: "WRITE '1'."};
    const file2 = {filename: "zfoo2.prog.abap", contents: "WRITE '2'."};

    const output = (await new Transpiler().run([file1, file2])).objects;

    expect(output.length).to.equal(2);
    expect(output[0].js.filename).to.equal("zfoo1.prog.js");
    expect(output[1].js.filename).to.equal("zfoo2.prog.js");
  });

  it("Full path file name", async () => {
    const filename = "C:\\Users\\foobar\\git\\transpiler\\packages\\abap-loader\\build\\test\\zprogram.prog.abap";
    const file1 = {filename, contents: "WRITE '1'."};

    const output = (await new Transpiler().run([file1])).objects;

    expect(output.length).to.equal(1);
    expect(output[0].js.filename).to.contain("zprogram.prog.js");
  });

  it("Global Class", async () => {
    const filename = "zcl_index.clas.abap";
    const contents = `
CLASS zcl_index DEFINITION PUBLIC.
ENDCLASS.
CLASS zcl_index IMPLEMENTATION.
ENDCLASS.
`;
    const file1 = {filename, contents};

    const output = (await new Transpiler().run([file1])).objects;

    expect(output.length).to.equal(1);
    expect(output[0].js.contents).to.include("zcl_index");
    expect(output[0].exports.length).to.equal(1);
    expect(output[0].exports[0]).to.equal("zcl_index");
  });

  it("Global Class and testclasses", async () => {
    const filename1 = "zcl_index.clas.abap";
    const contents1 = `
CLASS zcl_index DEFINITION PUBLIC.
ENDCLASS.
CLASS zcl_index IMPLEMENTATION.
ENDCLASS.
`;
    const file1 = {filename: filename1, contents: contents1};

    const filename2 = "zcl_index.clas.testclasses.abap";
    const contents2 = `
    CLASS ltcl_test DEFINITION FOR TESTING DURATION SHORT RISK LEVEL HARMLESS FINAL.
    PRIVATE SECTION.
      METHODS test FOR TESTING.
  ENDCLASS.

  CLASS ltcl_test IMPLEMENTATION.
    METHOD test.
      DATA foo TYPE REF TO zcl_index.
      CREATE OBJECT foo.
    ENDMETHOD.
  ENDCLASS.
`;
    const file2 = {filename: filename2, contents: contents2};

    const output = (await new Transpiler().run([file1, file2])).objects;

    expect(output.length).to.equal(2);
    expect(output[0].js.contents).to.include("zcl_index");
    expect(output[0].exports.length).to.equal(1, "one export expected, global class");
    expect(output[0].requires.length).to.equal(0, "no requires from global class");

    expect(output[1].js.contents).to.include("ltcl_test");
    expect(output[1].exports.length).to.equal(1, "one export expected, testclass");
    expect(output[1].requires.length).to.equal(1, "one require expected, testclass");
  });

});