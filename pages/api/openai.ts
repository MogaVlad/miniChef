import { OpenAIApi, Configuration } from "openai";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  text: string;
};

interface GenerateNextApiRequest extends NextApiRequest{
  body: {
    prompt: string;
  };
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
});

const openai = new OpenAIApi(configuration);

const maxChar = 500; //Change max chars

export default async function handler(
  req: GenerateNextApiRequest,
  res: NextApiResponse<ResponseData>
){
  const { ingredients, selectedCategory } = req.query;
  const prompt = `Create a valid JSON array of objects with recipes (minimum of 3 objects), each recipe has to have a name, recipe duration, ingredients used, and preparation details (fields: name, duration, ingredients, preparation). The recipes must contain only these ingredients: ${ingredients} and has to be from category ${selectedCategory}`;

  const aiResult = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${prompt}`,
    temperature: 0.5,
    max_tokens: maxChar
  });

  const response = aiResult.data.choices[0].text?.trim() || 'Sorry, there was a problem!';
  res.status(200).json({ text: response });
}