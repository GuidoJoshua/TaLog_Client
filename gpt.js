const OpenAI = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();

const openai = new OpenAI({
	apiKey: process.env.OPENAI_SECRET_KEY,
});

const name = "minsung";

async function main() {
	const myAssistant = await openai.beta.assistants.create({
	  instructions:
		`You will act as an expert Tarot Card reader. all questions are written in PlainTEXT only. Don't use any markdown syntax.`,
	  name: "Tarot Reader",
	  model: "gpt-4",
	});
  
	console.log(myAssistant);
  }
  
  main();