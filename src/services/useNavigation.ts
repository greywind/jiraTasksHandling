import React from "react";
import useRouter from "use-react-router";
import qs from "querystring";

interface RouterParams {
  productName?: string;
}

type Link =
  | string
  | {
      link: string;
      regex: RegExp;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      build: (...args: any[]) => string;
    };

const links = {
  home: "/",
};

export type Page = keyof typeof links;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useNavigation<T = RouterParams>() {
  const { history, location, match } = useRouter<T>();

  const result = React.useMemo(() => {
    const currentPage: Page = Object.entries<Link>(links).find(([, value]) => {
      if (typeof value == "string") return value == location.pathname;
      return value.regex.test(location.pathname);
    })?.[0] as Page;

    return {
      location,
      links,
      params: match.params,
      currentPage,
      redirect: () => {
        const params = qs.parse(location.search.substring(1));
        if (!params.to || typeof params.to !== "string") return false;
        history.push(params.to);
        return true;
      },
      to: (page: Page, ...args: string[]) => {
        const target = links[page] as Link;
        if (typeof target === "string") history.push(target);
        else history.push(target.build.apply(null, args));
      },
    };
  }, [history, location, match.params]);

  return result;
}
