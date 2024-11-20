import { json } from '@sveltejs/kit';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import type { Receipt } from '$lib/types';
import type { KVNamespace } from '@cloudflare/workers-types';
import { OpenAI } from "openai";

const openAi = new OpenAI({
  organization: 'xx',
  project: 'xx',
  apiKey: 'xx'
});

// Cloudflare KV binding
declare const RECEIPTS: KVNamespace;

export const POST = async ({ request }: { request: Request }) => {
  const data = await request.formData();
  const file = data.get('receipt') as File;

  if (!file) {
    return json({ error: 'Receipt image is required' }, { status: 400 });
  }

  try {
    // Compress and optimize the image
    const buffer = await file.arrayBuffer();
    const optimizedImage = await sharp(Buffer.from(buffer))
      .grayscale()
      .resize({ width: 800 })
      .jpeg({ quality: 50 })
      .toBuffer();

    // Convert to base64
    const base64Image = optimizedImage.toString('base64');

    // GPT-4 processing
    const gptResponse = await openAi.chat.completions.create({
      model: 'chatgpt-4o-latest',
      messages: [
        {
          role: 'system',
          content:
            'You are a receipt parsing assistant. Analyze the provided receipt image (base64-encoded) and return a structured JSON object in this format: {"name":"Store Name", "service_charge":ServiceCharge / Tip as a percentage of the whole order} "items":[{"item":"Item Name", "price":Price, "qty":Quantity]. Pay attention to the format of the receipt and the lines, and correctly distribute the quantity. For example, a item could be split across two lines or have additions or subtractions as a sub undeneath the line. the price should be the price per item so if that needs to be divided by the quantity, do so.',
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Convert this receipt to json. ONLY PROVIDE THE JSON, NOTHING ELSE',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });
    console.log(gptResponse);
    console.log(gptResponse.choices[0].message);
    // Clean and parse the structured JSON from GPT response
    const rawContent = gptResponse.choices[0]?.message?.content || '';
    const cleanedContent = rawContent.replace(/^```json\s*/, '').replace(/```$/, '');
    const structuredReceipt: Receipt = JSON.parse(cleanedContent);

    // Store in Cloudflare KV
    const receiptId = uuidv4();
    console.log(JSON.stringify(structuredReceipt));
    await RECEIPTS.put(receiptId, JSON.stringify(structuredReceipt));

    return json({ id: receiptId });
  } catch (error) {
    console.error("Error processing receipt:", error);
    return json({ error: "Failed to process the receipt" }, { status: 500 });
  }
};
