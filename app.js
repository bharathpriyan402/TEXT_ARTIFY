import { Leap } from '@leap-ai/sdk'
import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

const leap = new Leap(process.env.LEAP_API_KEY)

const app = express();
app.use(express.json());
app.use(express.static("public"));
const port = 3000;

app.post('/generate', async (req, res) => {

	const prompt = req.body.prompt;

	try {

		//stable diffusion 1.5
		leap.usePublicModel("sd-1.5");

		//generate the image by passing in the prompt, using leap SDK
		const response = await leap.generate.generateImage({
			prompt: prompt,
		});
		const imageUrl = response.data.images[0].uri;

		//send JSON response to front end, with the data being the image in this case
		res.status(200).json({
			success: true,
			data: imageUrl
		});

	} catch (error) {
		console.log(error)
		//send error to front end, so user can easily see that something went wrong
		res.status(400).json({
			success: false,
			error: 'The image could not be generated'
		});
	}
})

app.listen(port);
console.log(`Running on localhost:${port}` );