import { FETCHING, SUCCESS, ERROR, REFRESHING } from './types';

export const fetching = () => ({ type: FETCHING });
export const refreshing = () => ({ type: REFRESHING });

export const success = payload => ({ type: SUCCESS, payload });
export const failure = payload => ({ type: ERROR, payload });