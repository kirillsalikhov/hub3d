import { useEffect, useLayoutEffect } from 'react';

export const isBrowser = () => typeof window !== 'undefined'

export const useEnhancedEffect = isBrowser() ? useLayoutEffect : useEffect;
