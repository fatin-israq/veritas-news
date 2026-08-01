import type { SourceParser } from '../types';
import { GenericParser } from './generic';
import { ReutersParser } from './reuters';
import { BBCParser } from './bbc';
import { GuardianParser } from './guardian';
import { NPRParser } from './npr';
import { FoxParser } from './fox';

export function getParserForSource(strategy?: string | null): SourceParser {
  switch (strategy?.toLowerCase()) {
    case 'reuters':
      return ReutersParser;
    case 'bbc':
      return BBCParser;
    case 'guardian':
      return GuardianParser;
    case 'npr':
      return NPRParser;
    case 'fox':
      return FoxParser;
    default:
      return GenericParser;
  }
}

export { GenericParser, ReutersParser, BBCParser, GuardianParser, NPRParser, FoxParser };
