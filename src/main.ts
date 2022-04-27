import { App, Duration, Stack, StackProps } from "aws-cdk-lib";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import { HelloWorldFunction } from "./hello-world-function";

export class AnomalyDetectorStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const helloWorldFunction = new HelloWorldFunction(this, "Function", {});
    new lambda.FunctionUrl(this, "FunctionUrl", {
      function: helloWorldFunction,
    });

    const invocationsMetric = helloWorldFunction.metricInvocations({
      period: Duration.minutes(5),
    });

    new cloudwatch.CfnAnomalyDetector(this, "InvocationsAnomalyDetector", {
      metricName: invocationsMetric.metricName,
      namespace: invocationsMetric.namespace,
      stat: "Sum",
    });

    new cloudwatch.CfnAlarm(this, "InvocationsAlarm", {
      comparisonOperator: cloudwatch.ComparisonOperator.LESS_THAN_LOWER_OR_GREATER_THAN_UPPER_THRESHOLD,
      evaluationPeriods: 1,
      metrics: [
        {
          id: "anomaly",
          expression: "ANOMALY_DETECTION_BAND(invocations, 2)",
        },
        {
          id: "invocations",
          metricStat: this.toMetricStatConfig(invocationsMetric),
        },
      ],
      thresholdMetricId: "anomaly",
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });
  }

  private toMetricStatConfig(metric: cloudwatch.IMetric): cloudwatch.CfnAlarm.MetricStatProperty {
    const stat = metric.toMetricConfig().metricStat!;

    return {
      metric: {
        metricName: stat.metricName,
        namespace: stat.namespace,
        dimensions: stat.dimensions,
      },
      period: stat.period.toSeconds(),
      stat: stat.statistic,
      unit: stat.unitFilter,
    };
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new AnomalyDetectorStack(app, "cdk-metrics-example-dev", { env: devEnv });
// new MyStack(app, 'cdk-metrics-example-prod', { env: prodEnv });

app.synth();
