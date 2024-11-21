import { json } from '@sveltejs/kit';
import { OpenAI } from 'openai';
import { env } from '$env/dynamic/private';
import type { ParsedReceipt } from '$lib/types';

// Initialize OpenAI
const openAi = new OpenAI({
  organization: env.SECRET_OPENAPI_ORG_ID,
  project: env.SECRET_OPENAPI_PROJECT_ID,
  apiKey: env.SECRET_OPENAPI_API_KEY,
});

// Function to call Google Cloud Vision API
async function callGoogleVisionAPI(base64Image: string) {
  const apiKey = env.SECRET_GOOGLE_API_KEY; // Use an API key for Vision API
  const url = `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`;

  const body = {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION', maxResults: 1 }],
      },
    ],
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Google Vision API Error: ${response.statusText}`);
  }

  const result = await response.json();
  const text = result.responses[0]?.fullTextAnnotation?.text || '';

  if (!text) {
    throw new Error('OCR failed: No text detected in the receipt.');
  }

  return text;
}

export const POST = async ({ request }: { request: Request }) => {
  console.log('Request Headers:', Object.fromEntries(request.headers.entries()));
  console.log('Request Method:', request.method);
  return new Response(JSON.stringify({ error: 'Receipt image is required' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
  const data = await request.formData();
  const file = data.get('receipt') as File;

  if (!file) {
    return new Response(JSON.stringify({ error: 'Receipt image is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  try {
    // Compress and optimize the image
    const buffer = await file.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString('base64');

    // Use Google Vision REST API to perform OCR
    const text = await callGoogleVisionAPI(base64Image);

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

    return new Response(JSON.stringify({ receipt: structuredReceipt }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error processing receipt:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the receipt' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};


export const OPTIONS = () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};