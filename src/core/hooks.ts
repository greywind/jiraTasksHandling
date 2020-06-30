import { DialogProps, DialogPropsFromHook, DialogResult } from "@shared/dialog/types";
import { Styles } from "jss";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RegisterInput } from "react-hook-form/dist/types";
import { createUseStyles, useTheme } from "react-jss";
import { Theme } from "src/theme/jss";
import { useWindowSize } from "use-hooks";

export interface UseDialogResult<ResolveType> {
    show: () => Promise<DialogResult<ResolveType>>;
    dialogProps: DialogPropsFromHook<ResolveType>;
}

export function useDialog<ResolveType>(): UseDialogResult<ResolveType> {
    const resolveRef = useRef<UseDialogResult<ResolveType>["dialogProps"]["close"]>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const show: UseDialogResult<ResolveType>["show"] = useCallback(() => {
        setIsOpen(true);
        return new Promise(resolve => {
            resolveRef.current = value => {
                setIsOpen(false);
                resolve(value);
            };
        });
    }, []);
    const result = useMemo(() => ({ show, dialogProps: { isOpen, close: resolveRef.current } }),
        [show, isOpen]);
    return result;
}

export function useCustomDialog<ResolveType>(props: DialogProps<ResolveType>): Pick<UseDialogResult<ResolveType>, "dialogProps"> {
    const { isOpen, close } = props;
    const { show, dialogProps } = useDialog<ResolveType>();
    useEffect(() => {
        if (isOpen)
            close(show());
    }, [close, isOpen, show]);

    return { dialogProps };
}

export function createUseThemedStyles<Names extends string>(styles: (theme: Theme) => Styles<Names>, componentName: string): () => Record<Names, string> {
    return createUseStyles<Theme, Names>(styles, { name: componentName });
}

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";
interface UseScreenSizeResult {
    lt: (size: ScreenSize) => boolean;
    let: (size: ScreenSize) => boolean;
    gt: (size: ScreenSize) => boolean;
    get: (size: ScreenSize) => boolean;
    size: ScreenSize;
}
export function useScreenSize(): UseScreenSizeResult {
    const theme = useTheme() as Theme;
    const windowSize = useWindowSize();
    const screenSize: ScreenSize =
        windowSize.width >= theme.breakpoint.xl ? "xl" :
            windowSize.width >= theme.breakpoint.lg ? "lg" :
                windowSize.width >= theme.breakpoint.md ? "md" :
                    windowSize.width >= theme.breakpoint.sm ? "sm" : "xs";
    const sizeToNumber = (size: ScreenSize): number => size == "xs" ? 0 : size == "sm" ? 1 : size == "md" ? 2 : size == "lg" ? 3 : 4;
    return {
        lt: useCallback((size: ScreenSize) => sizeToNumber(screenSize) < sizeToNumber(size), [screenSize]),
        let: useCallback((size: ScreenSize) => sizeToNumber(screenSize) <= sizeToNumber(size), [screenSize]),
        gt: useCallback((size: ScreenSize) => sizeToNumber(screenSize) > sizeToNumber(size), [screenSize]),
        get: useCallback((size: ScreenSize) => sizeToNumber(screenSize) >= sizeToNumber(size), [screenSize]),
        size: screenSize,
    };
}

export const formValidators = {
    email: (message: string, required: string = null): RegisterInput => ({ pattern: { value: /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i, message },
        required }),
    min: (min: number, message: string): RegisterInput => ({ min: { value: min, message } }),
    max: (max: number, message: string): RegisterInput => ({ max: { value: max, message } }),
    minLength: (min: number, message: string, required: boolean | string = true): RegisterInput => ({ minLength: { value: min, message }, required: required ? message || required : required }),
    maxLength: (max: number, message: string, required: boolean | string = true): RegisterInput => ({ maxLength: { value: max, message }, required: required ? message || required : required }),
};

interface UseCarouselResult {
    page: number;
    setPage: (page: number) => void;
    next: () => void;
    prev: () => void;
    animationStarted: () => void;
    animationEnded: () => void;
}
export function useCarousel(countOfPages: number): UseCarouselResult {
    const [page, setPage] = useState(0);
    const [animating, setAnimating] = useState(false);
    const animationStarted = useCallback(() => { !animating && setAnimating(true); }, [animating, setAnimating]);
    const animationEnded = useCallback(() => { animating && setAnimating(false); }, [animating, setAnimating]);
    const next = useCallback(() => {
        if (animating)
            return;
        setPage(page < countOfPages - 1 ? page + 1 : 0);
    }, [animating, countOfPages, page]);
    const prev = useCallback(() => {
        if (animating)
            return;
        setPage(page > 0 ? page - 1 : countOfPages - 1);
    }, [animating, countOfPages, page]);
    return { page, setPage, next, prev, animationStarted, animationEnded };
}

type UseToggleResult = [boolean, () => void, (value: boolean) => void];
export function useToggle(defaultValue: boolean): UseToggleResult {
    const [value, setValue] = useState(defaultValue);
    const toggle = useCallback(() => setValue(!value), [value]);
    return [value, toggle, setValue];
}
