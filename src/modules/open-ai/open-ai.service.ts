import { responseHelper } from '@/utils/helpers';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import OpenAIApi from 'openai';
import { ChatCompletion } from 'openai/resources';
import { GenerateJDParams, GenerateResumeParams } from './open-ai.type';
import {
  generateJDQuestion,
  generateResumeDescriptionQuestion,
  generateResumeKeywordsQuestion
} from './open-ai.utils';

@Injectable()
export class OpenAiService {
  constructor(private readonly openai: OpenAIApi) {}

  async chatGptRequestByPrompt(prompt: string): Promise<string> {
    try {
      // Make a request to the ChatGPT model
      const completion: ChatCompletion = await this.openai.chat.completions.create(
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.5,
          max_tokens: 1000
        },
        { timeout: 300 * 1000 }
      );
      // Extract the content from the response
      const [content] = completion.choices.map((choice) => choice.message.content);

      return content;
    } catch (e) {
      // Log and propagate the error
      console.error(e);
      throw new HttpException(
        {
          key: 'error.server_error'
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async generateJobDescription(params: GenerateJDParams, potentialCV?: string) {
    const prompt = generateJDQuestion(params, potentialCV);
    const res = await this.chatGptRequestByPrompt(prompt);
    return responseHelper(res);
  }

  async generateResumeDescription(params: GenerateResumeParams) {
    const prompt = generateResumeDescriptionQuestion({
      ...params
    });

    const res = await this.chatGptRequestByPrompt(prompt);
    return responseHelper(res);
  }

  async generateResumeKeywords(params: GenerateResumeParams) {
    const prompt = generateResumeKeywordsQuestion({
      ...params
    });

    const res = await this.chatGptRequestByPrompt(prompt);
    return responseHelper(res);
  }
}
