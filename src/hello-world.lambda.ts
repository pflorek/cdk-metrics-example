import { APIGatewayEventRequestContextV2, APIGatewayProxyResultV2 } from "aws-lambda/trigger/api-gateway-proxy";

export async function handler(event: APIGatewayEventRequestContextV2): Promise<APIGatewayProxyResultV2> {
  console.log("Payload: %j", event);

  return {
    statusCode: 200,
    body: JSON.stringify({ msg: "Hello World!" }),
  };
}
