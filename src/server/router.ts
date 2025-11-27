import { InferRouterInputs, InferRouterOutputs } from '@orpc/server';

import cvRouter from './routers/cv';

export type Router = typeof router;
export type Inputs = InferRouterInputs<typeof router>;
export type Outputs = InferRouterOutputs<typeof router>;
export const router = {
  cv: cvRouter,
};
