import { ArgumentsHost, Catch, HttpException, HttpStatus } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch(HttpException)
export class HttpExceptionFilter implements GqlExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const gqlHost = GqlArgumentsHost.create(host);
    const i18n = I18nContext.current(host);
    const statusCode = exception.getStatus();
    const statusText = HttpStatus[statusCode];

    const contextType = String(gqlHost.getType());
    const currentLang = i18n.lang ?? process.env.FALLBACK_LANGUAGE;
    if (contextType === 'graphql') {
      const messageError = exception.getResponse() as {
        key: string;
        args: Record<string, any>;
      };
      const message = (await this.i18n.translate(messageError.key, {
        lang: currentLang,
        args: messageError.args
      })) as string;

      const error = new GraphQLError(message, {
        extensions: {
          code: statusText,
          statusCode: statusCode,
          message: message
        }
      });
      return error;
    }
    const error = new GraphQLError(this.i18n.translate('error,server_error'), {
      extensions: {
        code: HttpStatus[500],
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: this.i18n.translate('error,server_error')
      }
    });
    return error;
  }
}
