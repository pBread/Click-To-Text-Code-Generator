import type {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
  TwilioClientOptions,
} from "@twilio-labs/serverless-runtime-types/types";
import type { NextApiHandler } from "next";
import { Twilio as TwilioClient, twiml } from "twilio";

const { ACCOUNT_SID, AUTH_TOKEN, PORT } = process.env;

const adapter =
  (handler: ServerlessFunctionSignature): NextApiHandler =>
  async (req, res) => {
    if (!/^(GET|POST)$/i.test(req.method)) return res.status(405).end();

    let client: TwilioClient; // getTwilioClient returns the same object when invoked multiple times
    const ctx: Context = {
      getTwilioClient: (options?: TwilioClientOptions) => {
        if (!client)
          client = new TwilioClient(ACCOUNT_SID, AUTH_TOKEN, options);
        return client;
      },
      DOMAIN_NAME: `localhost:${PORT || 3000}`,
      PATH: "",
      SERVICE_SID: "",
      ENVIRONMENT_SID: "",
      ...process.env,
    };

    const event = { ...(req.body || {}), ...req.query }; // query takes precendence over body
    const callback: ServerlessCallback = (err, payload) => {
      if (err) return res.status(500).send(err);

      const isTwilioResponse = payload?.constructor.name === "Response";
      const isTwiML =
        payload instanceof twiml.MessagingResponse ||
        payload instanceof twiml.VoiceResponse ||
        payload instanceof twiml.FaxResponse;

      /****************************************************
       Set Headers
      ****************************************************/
      if (isTwilioResponse) {
        // @ts-ignore
        for (const key in payload.headers) // @ts-ignore
          res.setHeader(key, payload.headers[key]);
      } else if (isTwiML)
        res.setHeader("Content-Type", "text/xml; charset=utf8");

      /****************************************************
       Handle Response
      ****************************************************/
      const body: string | number | boolean | object = isTwilioResponse // @ts-ignore
        ? payload.body
        : isTwiML
        ? payload.toString()
        : payload;

      if (!["boolean", "number", "string", "object"].includes(typeof body))
        throw Error("Invalid response");

      const status: number = isTwilioResponse // @ts-ignore
        ? payload.statusCode
        : 200;

      res.status(status).send(body);
    };

    // execute
    try {
      await handler(ctx, event, callback);
    } catch (error) {
      console.error(error);
      res.status(500).end();
    }
  };

// only the handler is deployed to production
export default process.env.NODE_ENV === "production"
  ? (fn: ServerlessFunctionSignature) => fn
  : adapter;
