import { NestFactory } from '@nestjs/core';
import { MainModule } from './main.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { setUp } from './main.service';
import { InternalServerErrorException } from '@nestjs/common';

function throwError(error: Error): never
{
    throw new InternalServerErrorException(error);
}

async function bootstrap(): Promise<void>
{
    const app = await NestFactory.create<NestFastifyApplication>(MainModule, new FastifyAdapter(), { cors: false });
    setUp(app).catch(throwError);
}

bootstrap();