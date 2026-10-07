import { describe, expect, it } from "vitest";
import { decodificar, detectarCharset } from "../src/ingest/encoding.js";

// "Ação nº" em windows-1252: ç = 0xE7, ã = 0xE3, º = 0xBA.
const corpo = [0x41, 0xe7, 0xe3, 0x6f, 0x20, 0x6e, 0xba];
const comMeta = (charset: string) =>
  new Uint8Array([...Buffer.from(`<html><head><meta charset="${charset}"></head><body>`), ...corpo]);

describe("detectarCharset", () => {
  it("prioriza o charset do cabeçalho HTTP", () => {
    expect(detectarCharset(comMeta("utf-8"), "text/html; charset=windows-1252")).toBe("windows-1252");
  });

  it("usa o <meta> quando o cabeçalho não informa", () => {
    expect(detectarCharset(comMeta("windows-1252"), "text/html")).toBe("windows-1252");
  });

  it("assume UTF-8 sem nenhuma indicação", () => {
    expect(detectarCharset(new Uint8Array(corpo), null)).toBe("utf-8");
  });
});

describe("decodificar", () => {
  it("decodifica windows-1252 sem corromper acentos e ordinais", () => {
    expect(decodificar(comMeta("windows-1252"))).toContain("Ação nº");
  });

  it("cai para UTF-8 quando o charset é desconhecido", () => {
    expect(() => decodificar(comMeta("charset-inexistente"))).not.toThrow();
  });
});
