const { AwsCdkTypeScriptApp } = require("@pepperize/projen-awscdk-app-ts");
const project = new AwsCdkTypeScriptApp({
  cdkVersion: "2.21.1",
  defaultReleaseBranch: "main",
  devDeps: ["@pepperize/projen-awscdk-app-ts", "aws-sdk", "@types/aws-lambda"],
  name: "cdk-metrics-example",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();
