import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";
import * as QueryStringObject from "query-string-object";
import { getQuery } from 'ufo'

function useAppFetch<T>(url: string, options: UseFetchOptions<T> = {}) {
  const config = useRuntimeConfig();
  const listApiAuth = [apiLoginOtp, apiVerifyOtp, apiLoginNoOtp];

  // ใช้ useRequestHeaders เมื่อ SSR
  const headersInit: Record<string, string> = process.server
    ? useRequestHeaders(["cookie"])
    : {};

  const token = useCookie<string>("auth-token").value;

  let headers: Record<string, string> = { ...(options.headers || {}) };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let baseUrl = config.public.apiBase;
  if (listApiAuth.includes(url)) {
    baseUrl = config.public.apiAuth;
    headers = {}; // สำหรับ login api ไม่ต้องส่ง token
  }

  // Loading State: ใช้เฉพาะฝั่ง client
  const unique = Date.now();
  const latestFetchKeyState = useState<number>("globalLatestFetchKey", () => 0);
  const sLoadingState = useState<ILoading>("globalBaseLoading", () => ({ show: () => {}, hide: () => {} }));
  const incessantLoadingState = useState<boolean>("globalIncessantLoading", () => false);

  if (!incessantLoadingState.value) {
    incessantLoadingState.value = incessantLoading;
  }

  latestFetchKeyState.value = unique;

  const defaults: UseFetchOptions<T> = {
    baseURL: baseUrl,
    key: `${url}_${unique}`,
    headers,

    onRequest({ options }) {
      const queryString = QueryStringObject.stringify(options.params ?? {});
      const queryObject = getQuery(`?${queryString}`);
      options.params = queryObject;

      if (process.client && incessantLoadingState.value) {
        sLoadingState.value?.show?.();
      }
    },

    onResponse({ response }) {
      if (process.client && incessantLoadingState.value) {
        setTimeout(() => {
          if (latestFetchKeyState.value === unique) {
            incessantLoadingState.value = false;
            sLoadingState.value?.hide?.();
          }
        }, 2000);

        setTimeout(() => {
          incessantLoadingState.value = false;
          sLoadingState.value?.hide?.();
        }, 10000);
      }
    },

    onResponseError({ response }) {
      if (process.client) {
        const exp = response._data?.exp;
        if (exp === "token expired") {
          deleteAllCookies();

          setTimeout(() => {
            navigateTo("/login");
          }, 800);
        }
      }
    },
  };

  const allOptions = defu(options, defaults);

  if (allOptions.headers && "Content-Type" in allOptions.headers) {
    delete allOptions.headers["Content-Type"];
  }

  return isClient
    ? $fetch<T>(url, allOptions).catch(error => ({
        status: error?.data?.status ?? 500,
        error: error?.data?.error ?? { message: "Error" }
      }))
    : useFetch<T>(url, allOptions);
}

export function useFetchGet<T>(url: string, options: UseFetchOptions<T> = {}) {
  const defaults: UseFetchOptions<T> = { method: "GET" };
  const allOptions = defu(options, defaults);
  return useAppFetch<T>(url, allOptions);
}

function deleteAllCookies() {
  const token = useCookie("auth-token");
  const otpCountdownState = useCookie("otpCountdownData");
  const globalContractProfile = useCookie("globalContractProfile");

  token.value = null;
  otpCountdownState.value = null;
  globalContractProfile.value = null;

  if (process.client) {
    localStorage.removeItem("meProfile");
    localStorage.removeItem("enableMockLogin");
  }
}
