import 'dotenv/config';
import OpenAI from 'openai';
import twilio from 'twilio';
import { v2 as cloudinary } from 'cloudinary';
import Razorpay from 'razorpay';

export const config = {
  hasDatabase: Boolean(process.env.DATABASE_URL),
  hasTwilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_VERIFY_SERVICE_SID),
  hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
  hasCloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  hasRazorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
};

export async function sendOtp(phone) {
  if (!config.hasTwilio) return { configured: false, demo: true, message: 'Twilio is not configured' };
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verifications.create({ to: `+91${phone}`, channel: 'sms' });
  return { configured: true, demo: false, message: 'OTP sent' };
}

export async function verifyOtp(phone, code) {
  if (!config.hasTwilio) return { configured: false, valid: code === '123456' };
  const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  const result = await client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID).verificationChecks.create({ to: `+91${phone}`, code });
  return { configured: true, valid: result.status === 'approved' };
}

export async function generateAiListing({ text, name, category, origin, material }) {
  if (!config.hasOpenAI) return null;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: process.env.OPENAI_MODEL || 'gpt-5-mini',
    input: `You are Kaarigari's artisan marketplace assistant. Return JSON with keys name, category, keywords, description, culturalStory, seoKeywords. Use only facts supplied by the artisan; if origin/history is uncertain, say so rather than inventing it. Artisan input: ${JSON.stringify({ text, name, category, origin, material })}`,
    text: { format: { type: 'json_object' } }
  });
  return JSON.parse(response.output_text);
}

export function configureCloudinary() {
  if (!config.hasCloudinary) return false;
  cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET, secure: true });
  return true;
}

export function createPaymentClient() {
  if (!config.hasRazorpay) return null;
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}
