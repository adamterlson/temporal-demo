import { createActor, fromPromise, setup, toPromise } from "xstate";
import { proxyActivities, executeChild } from "@temporalio/workflow";
// Only import the activity types
import type * as activities from "../activities/activities";
import { crawler } from "./child-workflow";

const { greet, goodbye } = proxyActivities<typeof activities>({
  startToCloseTimeout: "1 minute",
});

const myMachine = setup({
  types: {
    output: {} as string,
  },
  actors: {
    greet: fromPromise(async ({ input }: { input: string }) => greet(input)),
    goodbye: fromPromise(async ({ input }: { input: string }) =>
      goodbye(input)
    ),
    child: fromPromise(async () => {
      return executeChild(crawler, {
        args: [
          {
            mission:
              "Crawl https://github.com/temporalio/samples-typescript/blob/main/child-workflows/src/workflows.ts and report what you find",
          },
        ],
      });
    }),
  },
}).createMachine({
  initial: "one",
  states: {
    one: {
      invoke: {
        src: "greet",
        input: "hello",
        onDone: {
          target: "two",
        },
      },
    },
    two: {
      invoke: {
        src: "child",
        onDone: {
          target: "final",
        },
      },
    },
    final: {
      type: "final",
    },
  },
  output: "DONE!",
});

/** A workflow that simply calls an activity */
export async function example(name: string): Promise<string> {
  const actor = createActor(myMachine);
  console.log("back here actor");
  actor.start();
  const result = await toPromise(actor);
  // await greet('something');
  // await bomb();
  // await goodbye('something');
  return result;
}
