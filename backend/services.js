import 'dotenv/config';
import OpenAI from 'openai';
import twilio from 'twilio';
import { v2 as cloudinary } from 'cloudinary';
import Razorpay from 'razorpay';

export const config = {
  hasDatabase: Boolean(process.env.DATABASE_URL),
  hasTwilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER),
  demoOtp: process.env.DEMO_OTP_MODE !== 'false',
  hasOpenAI: Boolean(process.env.OPENAI_API_KEY),
  hasCloudinary: Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET),
  hasRazorpay: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
};
function twilioClient(){return twilio(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN)}
function normalizeIndianPhone(phone){const digits=String(phone||'').replace(/\D/g,'');if(digits.length===10)return `+91${digits}`;if(digits.length===12&&digits.startsWith('91'))return `+${digits}`;throw new Error('Enter a valid Indian mobile number')}
export async function sendOtp(phone){if(!config.hasTwilio)throw new Error('SMS is not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and TWILIO_PHONE_NUMBER to backend/.env.');const client=twilioClient(),to=normalizeIndianPhone(phone);const message=await client.messages.create({to,from:process.env.TWILIO_PHONE_NUMBER,body:'sms_2fa'});return{configured:true,demo:config.demoOtp,message:'OTP SMS sent to your phone',messageSid:message.sid}}
export async function verifyOtp(phone,code){if(!config.hasTwilio)throw new Error('SMS is not configured.');normalizeIndianPhone(phone);return{configured:true,valid:config.demoOtp&&/^\d{6}$/.test(String(code)),demo:config.demoOtp}}
export async function generateAiListing({text,name,category,origin,material,technique}){
 if(!config.hasOpenAI)return null;
 const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
 const response=await client.responses.create({model:process.env.OPENAI_MODEL||'gpt-5-mini',input:`You are Kaarigari, an Indian artisan marketplace. Create a polished product listing from the artisan's raw description.
IMPORTANT: The product NAME must be an ORIGINAL, SHORT MARKETPLACE TITLE (3-8 words), NOT a copy of the artisan's sentence. Do not repeat the raw description as the title. Combine distinctive factual details such as object type, material, colour/pattern, technique or place when supplied. Never invent facts.
Return JSON with exactly these keys: name, category, keywords, description, culturalStory, seoKeywords.
Use only facts supplied by the artisan. If origin/history is uncertain, do not invent it. Write a warm, premium marketplace title and description.
Artisan input: ${JSON.stringify({text,name,category,origin,material,technique})}`,text:{format:{type:'json_object'}}});
 return JSON.parse(response.output_text)
}
export function configureCloudinary(){if(!config.hasCloudinary)return false;cloudinary.config({cloud_name:process.env.CLOUDINARY_CLOUD_NAME,api_key:process.env.CLOUDINARY_API_KEY,api_secret:process.env.CLOUDINARY_API_SECRET,secure:true});return true}
export function createPaymentClient(){if(!config.hasRazorpay)return null;return new Razorpay({key_id:process.env.RAZORPAY_KEY_ID,key_secret:process.env.RAZORPAY_KEY_SECRET})}
