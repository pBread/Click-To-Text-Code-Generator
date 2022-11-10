import { twilioFunction } from "next-twilio";
import { jwt } from "twilio";

const { ACCOUNT_SID, TWILIO_API_KEY, TWILIO_API_SECRET, SYNC_SVC_SID } =
  process.env;

export default twilioFunction(
  async (ctx, event: { identity: string }, callback) => {
    const AccessToken = jwt.AccessToken;
    const SyncGrant = AccessToken.SyncGrant;

    const token = new AccessToken(
      ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET
    );
    token.identity = event.identity;
    token.addGrant(new SyncGrant({ serviceSid: SYNC_SVC_SID || "default" }));

    return callback(null, { identity: token.identity, token: token.toJwt() });
  }
);
