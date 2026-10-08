/**
 * Fallback type declarations for @prisma/client when local CLI generation
 * is deferred or executing in lightweight mock/development environments.
 * The model delegates below intentionally mirror the generated client's
 * escape-hatch typing; running `prisma generate` replaces this module.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "@prisma/client" {
  export class PrismaClient {
    constructor(options?: {
      log?: Array<"query" | "info" | "warn" | "error">;
      datasources?: Record<string, { url?: string }>;
    });
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    $queryRaw<T = unknown>(query: unknown, ...values: unknown[]): Promise<T>;
    $executeRaw(query: unknown, ...values: unknown[]): Promise<number>;
    $transaction<T>(fn: (tx: PrismaClient) => Promise<T>): Promise<T>;

    adminUser: any;
    category: any;
    product: any;
    productImage: any;
    banner: any;
    offer: any;
    faq: any;
    page: any;
    pageSection: any;
    seo: any;
    contactMessage: any;
    knowledgeDocument: any;
    knowledgeChunk: any;
    chatLog: any;
  }
}
