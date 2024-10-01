import { Honeypot, SpamError } from "remix-utils/honeypot/server";

export const honeypot = new Honeypot({
  randomizeNameFieldName: false,
  nameFieldName: 'name__confirm',
  validFromFieldName: 'form__confirm',
  encryptionSeed: process.env.HONEYPOT_ENCRYPTION_SEED
});

export { SpamError };
