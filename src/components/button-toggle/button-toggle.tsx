"use client";
import { Switch } from "@headlessui/react";

export const IconSpinLittle = () => {
  return (
    <svg
      className="animate-spin h-5 w-5 text-gray-400"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

const classNames = (...args) => args.filter(Boolean).join(" ");

const buttonToggleTwConf = {
  accentBg: "bg-sky-600",
  disabledBg: "bg-gray-200",
  focusAccentRing: "focus:ring-sky-600",
  textAccent: "text-sky-600",
};
export const ButtonToggle = ({
  enabled,
  setEnabled,
  pending,
  twConf = buttonToggleTwConf,
  little,
}: {
  enabled: boolean;
  setEnabled: () => any;
  pending: boolean;
  twConf: typeof buttonToggleTwConf;
  little?: boolean;
}) => {
  return (
    <Switch.Group
      as="div"
      className={`flex items-center ${little ? "scale-75" : ""}`}
    >
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? twConf.accentBg : twConf.disabledBg,
          "relative inline-flex flex-shrink-0 h-10 w-16 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
          twConf.focusAccentRing
        )}
      >
        <span
          className={classNames(
            enabled ? "translate-x-6" : "translate-x-1",
            "pointer-events-none relative inline-block h-8 w-8 mt-0.5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200"
          )}
        >
          <span
            className={classNames(
              enabled
                ? "opacity-0 ease-out duration-100"
                : "opacity-100 ease-in duration-200",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            {!pending ? (
              <svg
                className="h-6 w-6 text-gray-400"
                fill="none"
                viewBox="0 0 12 12"
              >
                <path
                  d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <IconSpinLittle />
            )}
          </span>
          <span
            className={classNames(
              enabled
                ? "opacity-100 ease-in duration-200"
                : "opacity-0 ease-out duration-100",
              "absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
            )}
            aria-hidden="true"
          >
            {!pending ? (
              <svg
                className={classNames("h-6 w-6 ", twConf.textAccent)}
                fill="currentColor"
                viewBox="0 0 12 12"
              >
                <path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
              </svg>
            ) : (
              <IconSpinLittle />
            )}
          </span>
        </span>
      </Switch>
    </Switch.Group>
  );
};
