/**
 * MATRIXÄ — demo renderizado sin abrir un CLI nuevo.
 * Monta unos pocos componentes con la paleta de la casa sobre un stream
 * falso (patrón de HelpDialog.test.tsx) y vuelca el ANSI crudo a un fichero.
 * Uso:  LETTA_THEME=matrixa bun scripts/matrixa-demo.tsx > /tmp/matrixa-demo.ans
 */
import { writeFileSync } from "node:fs";
import { Readable, Writable } from "node:stream";
import { Box, render } from "ink";
import { useEffect } from "react";
import { AnimatedLogo } from "@/cli/components/AnimatedLogo";
import { colors } from "@/cli/components/colors";
import { Text } from "@/cli/components/Text";
import { getPalette } from "@/cli/components/theme";
import { WelcomeScreen } from "@/cli/components/WelcomeScreen"; // MATRIXÄ

const OUT = process.argv[2] ?? "/tmp/matrixa-demo.ans";
const chunks: string[] = [];

class CaptureStream extends Writable {
  columns = 96;
  rows = 40;
  isTTY = true;
  override _write(
    chunk: Buffer | string,
    _encoding: BufferEncoding,
    callback: (error?: Error | null) => void,
  ) {
    chunks.push(String(chunk));
    callback();
  }
}

function createInputStream(): NodeJS.ReadStream {
  const input = new Readable({ read() {} }) as NodeJS.ReadStream;
  input.isTTY = true;
  input.setRawMode = () => input;
  input.ref = () => input;
  input.unref = () => input;
  return input;
}

function Demo() {
  useEffect(() => {
    const t = setTimeout(() => {
      // El stream de ink ES lo que vería el terminal; pyte lo replaya fiel.
      writeFileSync(OUT, Buffer.from(chunks.join(""), "utf-8"));
      process.exit(0);
    }, 1300);
    return () => clearTimeout(t);
  }, []);
  // La bienvenida real, desnuda: es lo que ve el usuario al arrancar MATRIXÄ.
  return (
    <WelcomeScreen
      loadingState="ready"
      continueSession={false}
      agentState={null}
    />
  );
}

const stdout = new CaptureStream() as CaptureStream & NodeJS.WriteStream;
render(<Demo />, {
  stdout,
  stdin: createInputStream(),
  debug: false,
  exitOnCtrlC: false,
  patchConsole: false,
});
