import {logError, run} from './utils';

export default async function(name?: string, min?: string, max?: string) {
  if (!name) {
    return logError('name (required): snow scale <name>');
  }
  if (!min) {
    return logError('min (required): snow scale <name> <min>');
  }
  if (isNaN(Number(min))) {
    return logError(
      'min (typecheck: must be numberic): snow scale <name> <min>'
    );
  }

  if (max && isNaN(Number(max))) {
    return logError(
      'max (typecheck: must be numberic): snow scale <name> <min> <max>'
    );
  }

  // If CLI called without 'max' supplied, default to 'min'.
  const actualMax = max ? max : min;

  // Check for existing Horizontal Pod Autoscaler (HPA)
  try {
    await run(`kubectl get hpa ${name}`);
    // HPA exists. Patch it.
    await run(
      `kubectl patch hpa ${name} --patch '{"spec":{"minReplicas":${min},"maxReplicas":${actualMax}}}'`
    );
  } catch (error) {
    // No HPA. Create one.
    await run(
      `kubectl autoscale deployment/${name} --min=${min} --max=${actualMax}`
    );
  }
};
