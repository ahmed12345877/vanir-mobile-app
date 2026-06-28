/**
 * Ambient declarations for Web APIs that are available at runtime in React
 * Native (Hermes 0.73+) but are not included in the narrow ES-only lib
 * set used by @react-native/typescript-config.
 */

// ── TextDecoder ───────────────────────────────────────────────────────────────

interface TextDecoderOptions {
  fatal?: boolean;
  ignoreBOM?: boolean;
}

interface TextDecodeOptions {
  stream?: boolean;
}

declare class TextDecoder {
  constructor(label?: string, options?: TextDecoderOptions);
  decode(input?: ArrayBufferView | ArrayBuffer, options?: TextDecodeOptions): string;
  readonly encoding: string;
  readonly fatal: boolean;
  readonly ignoreBOM: boolean;
}

// ── ReadableStream ────────────────────────────────────────────────────────────

interface ReadableStreamDefaultReadDoneResult {
  done: true;
  value: undefined;
}

interface ReadableStreamDefaultReadValueResult<T> {
  done: false;
  value: T;
}

type ReadableStreamDefaultReadResult<T> =
  | ReadableStreamDefaultReadValueResult<T>
  | ReadableStreamDefaultReadDoneResult;

interface ReadableStreamDefaultReader<R = unknown> {
  readonly closed: Promise<undefined>;
  cancel(reason?: unknown): Promise<void>;
  read(): Promise<ReadableStreamDefaultReadResult<R>>;
  releaseLock(): void;
}

declare class ReadableStream<R = unknown> {
  readonly locked: boolean;
  cancel(reason?: unknown): Promise<void>;
  getReader(): ReadableStreamDefaultReader<R>;
}

// ── Augment fetch Response to expose the streaming body ──────────────────────

interface Response {
  readonly body: ReadableStream<Uint8Array> | null;
}
