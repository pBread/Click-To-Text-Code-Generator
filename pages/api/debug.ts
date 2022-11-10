import { twilioFunction } from "next-twilio";

export default twilioFunction(async (ctx, event, callback) => {
  console.log("event", event);

  return callback(null, {});
});
