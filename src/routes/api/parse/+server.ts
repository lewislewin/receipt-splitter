import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import { OpenAI } from 'openai';
import vision from '@google-cloud/vision';
import type { ParsedReceipt } from '$lib/types';
import { env } from '$env/dynamic/private'

// Initialize OpenAI
const openAi = new OpenAI({
  organization: env.SECRET_OPENAPI_ORG_ID,
  project: env.SECRET_OPENAPI_PROJECT_ID,
  apiKey: env.SECRET_OPENAPI_API_KEY,
});

const credentials = JSON.parse(env.GOOGLE_APPLICATION_CREDENTIALS || '{}');

// Initialize Google Vision Client
const visionClient = new vision.ImageAnnotatorClient({
  credentials
});

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

    // Use Google Vision API to perform OCR
    const [result] = await visionClient.textDetection(optimizedImage);
    const text = result.fullTextAnnotation?.text || '';

    if (!text) {
      throw new Error('OCR failed: No text detected in the receipt.');
    }

    // Use GPT to parse the OCR result into structured JSON
    const gptResponse = await openAi.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a highly intelligent receipt parsing assistant. Your task is to analyze the provided receipt text and return a structured JSON object with the following format:
          {
            "name": "Store Name",
            "modifiers": [
              {"type": "Modifier Type", "value": Value, "percentage": PercentageOfOrder (if applicable)}
            ],
            "items": [
              {"item": "Item Name", "price": PricePerItem, "qty": Quantity}
            ]
          }
          Important Considerations:
          Store Name:
          Extract the store's name from the receipt header or footer, wherever applicable.
          Modifiers:
          Include all price-related adjustments as separate entries in the modifiers array. Each modifier should include:
          type: The name of the modifier (e.g., "Service Charge", "Discount").
          value: The absolute value of the modifier (e.g., £10.00 for a discount or service charge).
          percentage: If the modifier is a percentage of the total order, include the percentage. If not, set this field to null.
          Items:
          Each item should include:
          item: The item's name, accurately extracted even if split across multiple lines.
          price: The price per unit of the item. If the price is for multiple units, divide the total price by the quantity to calculate the per-item price. This should not include the currency, just the value.
          qty: The quantity of the item. Ensure the correct quantity, even if quantities are specified on separate lines or implied by additional notes like "x2" or "double."
          Handle cases where:
          The price is listed per line (inclusive or exclusive of totals).
          Adjustments (e.g., additions, subtractions, or discounts) are listed on sublines or as notes.
          Format Adaptation:
          Some receipts might have irregular formats, such as handwritten-style totals, unclear item groupings, or totals including service charges. Adapt accordingly and infer missing information where possible.
          Tax:
          If tax is explicitly mentioned, include it as a modifier in the modifiers array with type: "Tax". Specify the tax value and its percentage of the total (if applicable).
          Error Handling:
          If any field cannot be confidently extracted, provide a null value for that field in the JSON and note the reason in a separate "notes" field.`,
        },
        {
          role: 'user',
          content: `Here is the extracted text from a receipt, ONLY PROVIDE ME THE JSON OBJECT NOTHING ELSE:\n\n${text}`,
        },
      ],
    });

    // Parse GPT response into structured JSON
    const rawContent = gptResponse.choices[0]?.message?.content || '';
    const cleanedContent = rawContent.replace(/^```json\s*/, '').replace(/```$/, '');
    const structuredReceipt: ParsedReceipt = JSON.parse(cleanedContent);
    console.log(structuredReceipt)

    // Store in Cloudflare KV
    // const receiptId = uuidv4();
    // await RECEIPTS.put(receiptId, JSON.stringify(structuredReceipt));

    return json({ receipt: structuredReceipt });
  } catch (error) {
    console.error('Error processing receipt:', error);
    return json({ error: 'Failed to process the receipt' }, { status: 500 });
  }
};
