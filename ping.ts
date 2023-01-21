import { serve } from "https://deno.land/std@0.173.0/http/server.ts";

function handleReq(req: Request) {
  const upgrade = req.headers.get("upgrade") || "";
  if (upgrade.toLowerCase() != "websocket") {
    return new Response("request isn't trying to upgrade to websocket.");
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  const pingProcess = new Deno.Command("ping", {
    args: ["8.8.8.8"],
    stdout: "piped",
  }).spawn();

  // don't await here
  const _pingPromise = pingProcess.stdout.pipeThrough(new TextDecoderStream())
    .pipeTo(
      new Ping(socket, pingProcess),
    );

  return response;
}

class Ping extends WritableStream<string> {
  constructor(socket: WebSocket, pingProcess: Deno.ChildProcess) {
    super({
      write: (chunk) => {
        const parseChunk = (chunk: string) => {
          return chunk.match(/time=(.*)ms/)?.at(1);
        };
        const parsed = parseChunk(chunk);
        if (parsed) {
          try {
            socket.send(parsed);
          } catch {
            // socket might have exited
            // end ping
            pingProcess.kill();
          }
        }
      },
    });
  }
}

if (import.meta.main) {
  await serve(handleReq);
}
