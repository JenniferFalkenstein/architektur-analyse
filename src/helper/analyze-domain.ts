import logger from "./logger";

const N_GRAMM_SIZE = 2; // Größe der N-Gramme (z.B. 2 für Bigramme)

function findSubDomainTermWithContext(contextTerm: string, tokens: string[], nGramSize = N_GRAMM_SIZE): string | null {
  const compareTokenFull = tokens.join('');

  const indexOfContext = tokens.indexOf(contextTerm);
  if (indexOfContext === -1) {
    logger.info('Context term not found in token');
    return null;
  }
  logger.debug(`compareTokens: ${tokens}`);
  logger.debug(`indexOfContext: ${indexOfContext}`);
  logger.debug(`compareTokenFull: ${compareTokenFull}`)
  const subDomainTerm = tokens.slice(indexOfContext, indexOfContext + nGramSize).join('');

  logger.debug(`SubdomainTerm = ${subDomainTerm} und ContextTerm = ${contextTerm}`)
  // Falls der Sub-Domain-Term der gleiche ist, wie der Kontext-Term, dann ignoriere es
  if (subDomainTerm === contextTerm) {
    logger.info('Sub-domain Wort ist gleich mit dem Kontext-Wort, wird ignoriert')
    return null;
  }
  logger.info(`Checking functionName with sub-domain: ${subDomainTerm}`);
  if (compareTokenFull.includes(subDomainTerm)) {
      logger.debug('Yes, found sub-domain term, return it');
      return subDomainTerm;
    } else {
      logger.debug('No, continue searching...');
    }
    logger.debug('No sub-domain term found.');
  return null;
}

export {
  findSubDomainTermWithContext,
}
