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
      writeFileSync(OUT, Buffer.from(chunks.join(""), "utf-8"));
      process.exit(0);
    }, 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <Box flexDirection="column">
      <Text dimColor>
        leoben@thinkpad:~$ ./scripts/matrixa.sh — tema: {getPalette()}
      </Text>
      <AnimatedLogo animate={false} />
      <WelcomeScreen
        loadingState="ready"
        continueSession={false}
        agentState={null}
      />
      <Box marginTop={1}>
        <Text color={colors.welcome.accent} bold>
          MATRIXÄ — fork de Letta Code · la colmena en verde
        </Text>
      </Box>
      <Box marginTop={1}>
        <Box width={4}>
          <Text color={colors.tool.completed}>●</Text>
        </Box>
        <Text color={colors.shellSyntax.prompt}>❯ </Text>
        <Text color={colors.shellSyntax.keyword}>bun </Text>
        <Text color={colors.shellSyntax.text}>run </Text>
        <Text color={colors.shellSyntax.string}>matrixa</Text>
        <Text color={colors.shellSyntax.comment}>
          {" "}
          # y pensar, pero a lo Matrix
        </Text>
      </Box>
      <Box marginTop={1}>
        <Box
          borderStyle="round"
          borderColor={colors.welcome.border}
          paddingX={1}
        >
          <Text color={colors.userMessage.background ? "white" : undefined}>
            {colors.userMessage.background
              ? "mensaje del usuario · fondo #0B2416"
              : "—"}
          </Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text color={colors.tool.pending}>◐ decoding the Matrix… </Text>
        <Text color={colors.statusWarning}>★ favoritos: 3 </Text>
        <Text color={colors.statusError}>■ error neón </Text>
        <Text color={colors.subagent.running}>▲ subagente corriendo</Text>
      </Box>
    </Box>
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
