import {
  // json,
  // type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
// import { useMediaQuery } from "react-responsive";
// import { getSelectorsByUserAgent } from "react-device-detect";
// import { useHydrated } from "remix-utils/use-hydrated";

export const meta: MetaFunction = () => {
  return [
    { title: "Yishai Zehavi" },
    { name: "description", content: "Portfolio website of Yishai Zehavi." },
  ];
};

// export async function loader({ request }: LoaderFunctionArgs) {
//   const { isMobile, isMobileOnly } = getSelectorsByUserAgent(
//     request.headers.get("user-agent") ?? "",
//   );

//   return json({
//     isMobile,
//     isMobileOnly,
//   });
// }

export default function LandingPage() {
  // const isHydrated = useHydrated();
  // const isXSView = useMediaQuery({ screen: true, maxWidth: 639 }) && isHydrated;

  return (
    <div className="relative h-full bg-gradient-to-br from-night to-navy grid place-content-center">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/pattern.svg)",
          backgroundSize: 30,
        }}
      ></div>
      <div className="z-10 text-center">
        <h1 className="text-white/80 text-5xl font-semibold tracking-tight">
          Yishai Zehavi
        </h1>
        <ul className="group mt-5 flex gap-6 justify-center">
          <li>
            <a
              href="https://github.com/zyishai"
              className="uppercase text-sm font-extrabold tracking-wide text-white/80 group-hover:text-white/30 hover:!text-white/80 active:text-white/80 transition-colors duration-500"
              target="_blank"
              rel="noreferrer"
            >
              Github
            </a>
          </li>
          <li>
            <a
              href="https://www.linkedin.com/in/zyishai/"
              className="uppercase text-sm font-extrabold tracking-wide text-white/80 group-hover:text-white/30 hover:!text-white/80 active:text-white/80 transition-colors duration-500"
              target="_blank"
              rel="noreferrer"
            >
              Linkedin
            </a>
          </li>
          <li>
            <a
              href="https://dev.to/yishai_zehavi"
              className="uppercase text-sm font-extrabold tracking-wide text-white/80 group-hover:text-white/30 hover:!text-white/80 active:text-white/80 transition-colors duration-500"
              target="_blank"
              rel="noreferrer"
            >
              Dev
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
