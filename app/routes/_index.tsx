import { ActionFunctionArgs, json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { XyzTransition, xyz } from '@animxyz/react';
import { useState } from "react";
import { useMediaQuery } from 'react-responsive';
import { getSelectorsByUserAgent } from 'react-device-detect';
import { useHydrated } from "remix-utils/use-hydrated";
import { HoneypotInputs } from "remix-utils/honeypot/react";
import { honeypot, SpamError } from "~/honeypot.server";
import { z } from "zod";
import { zx } from "zodix";
import { sendEmail } from "~/contact.server";
import { Form, useActionData } from "@remix-run/react";
import { useGlobalSubmittingState } from "remix-utils/use-global-navigation-state";

export const meta: MetaFunction = () => {
  return [
    { title: "Yishai Zehavi" },
    { name: "description", content: "Personal website of Yishai Zehavi." },
  ];
};

const schema = z.object({
  email: z.string().email(),
  name: z.string(),
  message: z.string()
});

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  try {
    honeypot.check(formData);
    
    // send email
    const { name, email, message } = await zx.parseForm(formData, schema);
    const res = await sendEmail({ sender: name, email, message });
    if (res.accepted.length > 0) {
      console.info('Message sent successfully', JSON.stringify(formData.entries()));
      return json({ ok: true, message: null });
    } else {
      console.error('Error: failed to send email', JSON.stringify(res));
      return json({ ok: false, message: 'Failed to send Email. Try again later.' });
    }
  } catch(error) {
    if (error instanceof SpamError) {
      // handle spam
      console.warn(`SPAM ALERT: ${JSON.stringify(formData.entries())}`);
      return json({ ok: false, message: 'Spam detected' });
    }
    // handle other errors
    console.error(`Error: ${error}`);
    return json({ ok: false, message: 'Failed to send Email. Try again later.' });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const { isMobile, isMobileOnly } = getSelectorsByUserAgent(request.headers.get('user-agent') ?? '');

  return json({
    isMobile, isMobileOnly
  });
}

type NavItem = {
  href: string;
  text: string;
}
const navigation: NavItem[] = [
  { href: '/#about', text: 'About Me' },
  { href: '/#projects', text: 'Projects' },
  { href: '/#writing', text: 'Writing' },
  { href: '/#faq', text: 'FAQ' },
  { href: '/#contact', text: 'Contact' },
];
const aboutMe = [
  "Hey there, nice to meet you! I'm Yishai, a curious guy who absolutely adores software. Since I was young, I've been fascinated with computers and technology (I taught myself Python and JavaScript). I'm passionate about software development, from crafting engaging user interfaces to building intricate architectures and even dabbling in some DevOps. Over the past seven years, I've experimented with various technologies and programming languages like JavaScript, C#, Ruby, and Python.",
  "In my downtime, you'll find me playing board games, sketching (with dreams of creating a manga series), or solving escape-room puzzles on my phone. On top of that, I'm currently learning Arabic while improving my English skills.",
  "I'm an avid reader and will devour almost anything I get my hands on, or at least save it for later! Nonfiction, history, and self-improvement books are my jam. Right now, I'm reading \"Grit\" by Angela Duckworth. Previously, I read \"Atomic Habits\" by James Clear and \"The Courage to Be Disliked\" by Ichiro Kishimi and Fumitake Koga.",
  "I've always wanted to use my knowledge to help others, so recently I dipped my toes into open source by contributing to projects like Stylin and Cursorify. I've also authored some articles on Dev (find links to them in the \"Writing\" section below). I'm always eager to expand my knowledge and dive into exciting projects with awesome people."
];
type Project = {
  name: string;
  description?: string | string[];
  link?: {
    live?: string;
    source?: string;
  },
  stack: string[];
  type: 'website'|'application'|'tool'|'contribution'|'freelance';
};
const projects: Project[] = [
  {
    type: 'application',
    name: 'The Portal',
    description: 'A management system for tutors and teachers.',
    link: {
      live: 'https://portal.yishaizehavi.com/',
      source: 'https://github.com/zyishai/portal'
    },
    stack: ['Remix', 'TypeScript', 'TailwindCSS', 'SurrealDB']
  },
  {
    type: 'application',
    name: 'Sea Merchant',
    description: 'A web implementation of a favorite Israeli old game called "Socher Hayam".',
    link: {
      live: 'https://sea-merchant.vercel.app',
      source: 'https://github.com/zyishai/sea-merchant'
    },
    stack: ['Vite', 'TypeScript', 'Framer Motion', 'XState']
  },
  {
    type: 'website',
    name: 'This Website',
    description: 'My portfolio website. Initially was built with Gatsby, but was converted to Remix + TailwindCSS',
    link: {
      live: 'https://yishaizehavi.com',
      source: 'https://github.com/zyishai/yishai-zehavi'
    },
    stack: ['Remix', 'TypeScript', 'TailwindCSS', 'AnimXYZ']
  },
  {
    type: 'contribution',
    name: 'Stylin',
    description: 'Contributed to Stylin, a build-time CSS library for React. I\'ve built the Vite plugin and fixed some issues with the TypeScript plugin.',
    link: {
      source: 'https://github.com/sultan99/stylin'
    },
    stack: ['TypeScript', 'Vite', 'Ramda']
  }
];
type Article = {
  title: string;
  href: string;
  site: React.ReactNode;
};
const articles: Article[] = [
  { 
    title: 'Cache-Control explained', 
    href: 'https://dev.to/yishai_zehavi/http-caching-explained-part-1-theory-3j4m', 
    site: (
      <img src="/dev-black.png" alt="dev.to" className="h-4" />
    )
  },
  { 
    title: 'Implementing Cache-Control strategies in React, NodeJS, and Nginx', 
    href: 'https://dev.to/yishai_zehavi/http-caching-explained-part-2-implementation-4ppa',
    site: (
      <img src="/dev-black.png" alt="dev.to" className="h-4" />
    )
  },
  { 
    title: '7 Must-Know Tips for Responsive Images to Boost Your Site Score', 
    href: 'https://dev.to/yishai_zehavi/7-must-know-tips-about-images-to-boost-your-site-1157',
    site: (
      <img src="/dev-black.png" alt="dev.to" className="h-4" />
    )
  },
  { 
    title: 'Building Git Commit Linter Type in Typescript', 
    href: 'https://dev.to/yishai_zehavi/typescript-challenge-building-a-git-commit-linter-5ehd',
    site: (
      <img src="/dev-black.png" alt="dev.to" className="h-4" />
    )
  }
];
type FAQ = {
  question: string;
  answer: string | string[];
};
const faqs: FAQ[] = [
  {
    question: 'Tell me about yourself',
    answer: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates temporibus odio minus dicta deleniti ducimus voluptate? Quidem cupiditate ratione ipsa natus voluptatum nulla fuga, itaque obcaecati enim ex, velit soluta!'
  },
  {
    question: 'Why should we hire you?',
    answer: [
      'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Enim eveniet doloribus aperiam deserunt?',
      'Lorem ipsum dolor, sit amet consectetur adipisicing elit.'
    ]
  },
  {
    question: 'What is your greatest weakness?',
    answer: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maiores veritatis placeat dolor tempore nostrum. Hic, deserunt et.'
  }
];

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isHydrated = useHydrated();
  const isXSView = useMediaQuery({ screen: true, maxWidth: 639 }) && isHydrated;
  // const [isOn, setIsOn] = useState(false);
  const actionData = useActionData<typeof action>();
  const submittingState = useGlobalSubmittingState();

  return (
    <div className="relative">
      <header className="fixed top-0 left-0 w-full bg-navy min-h-14">
        <div className="px-responsive py-3.5 md:py-5 flex items-center justify-between !max-w-screen-xl">
          <h1 className="text-white font-bold tracking-wider md:text-xl">YZ</h1>
          {/* Desktop (navigation) */}
          <nav className="hidden sm:block" role="navigation">
            <ul className="flex items-center gap-5 md:gap-7 lg:gap-10">
              {navigation.map(({ href, text }) => (
                <li key={text}>
                  <a href={href} className="text-white/70 hover:text-white text-sm md:text-base transition-colors duration-300">{text}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile (menu) */}
          <nav className="sm:hidden h-7" role="navigation">
            <button className="" onClick={() => setMenuOpen(!menuOpen)}>
              <XyzTransition mode="out-in" xyz="fade in-rotate-left out-rotate-right duration-2">
                { menuOpen 
                  ? <svg viewBox="0 0 24 24" className="h-7" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Menu / Close_MD"> <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg> 
                  : null 
                }
                { !menuOpen
                  ? <svg viewBox="0 0 24 24" className="h-7" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M20.75 7C20.75 7.41421 20.4142 7.75 20 7.75L4 7.75C3.58579 7.75 3.25 7.41421 3.25 7C3.25 6.58579 3.58579 6.25 4 6.25L20 6.25C20.4142 6.25 20.75 6.58579 20.75 7Z" fill="#fff"></path> <path fillRule="evenodd" clipRule="evenodd" d="M20.75 12C20.75 12.4142 20.4142 12.75 20 12.75L4 12.75C3.58579 12.75 3.25 12.4142 3.25 12C3.25 11.5858 3.58579 11.25 4 11.25L20 11.25C20.4142 11.25 20.75 11.5858 20.75 12Z" fill="#fff"></path> <path fillRule="evenodd" clipRule="evenodd" d="M20.75 17C20.75 17.4142 20.4142 17.75 20 17.75L4 17.75C3.58579 17.75 3.25 17.4142 3.25 17C3.25 16.5858 3.58579 16.25 4 16.25L20 16.25C20.4142 16.25 20.75 16.5858 20.75 17Z" fill="#fff"></path> </g></svg>
                  : null
                }
              </XyzTransition>
            </button>
            <XyzTransition xyz="origin-top short-100% stagger">
              {menuOpen ? <ul className="absolute right-0 top-full w-full bg-white flex flex-col divide-y divide-stone-200 border-t border-stone-200 shadow-lg shadow-gray-300/30">
                {navigation.map(({ href, text }) => (
                  <li key={text} className="select-none">
                    <a href={href} className="block text-right py-6 px-7 uppercase text-xs font-bold text-black">{text}</a>
                  </li>
                ))}
              </ul> : null}
            </XyzTransition>
          </nav>
        </div>
      </header>
      <main className="">
        {/* Hero Section */}
        <section className="bg-foam">
          {/* <XyzTransition appear duration="auto" xyz="fade up-25% stagger"> */}
            <div className="xyz-none px-responsive flex flex-col items-center justify-center py-40 sm:py-48 md:py-52 lg:py-0 lg:h-screen">
              <hgroup className="mt-7 flex flex-col items-center gap-3 lg:gap-5 text-center">
                <h1 className="xyz-nested font-display text-6xl leading-[1.1] sm:text-7xl lg:text-8xl font-bold text-navy">Yishai Zehavi</h1>
                {/* @ts-ignore */}
                <p className="xyz-nested flex flex-wrap justify-center items-center gap-2 lg:gap-2.5" xyz="fade delay-4">
                  <span className="text-gray-500 sm:text-lg">Web Developer</span>
                  <span className="text-gray-500 sm:text-lg text-sm">&bull;</span>
                  <span className="text-gray-500 sm:text-lg">Board Gamer</span>
                  <span className="text-gray-500 sm:text-lg text-sm">&bull;</span>
                  <span className="text-gray-500 sm:text-lg">Puzzle Solver</span>
                </p>
              </hgroup>

              {/* <button onClick={() => setIsOn(!isOn)} className="text-black">Click Me</button> */}
            </div>
          {/* </XyzTransition> */}
        </section>

        {/* About Section */}
        <section id="about" className="bg-white">
          {/* <XyzTransition appearVisible={{ threshold: 0.5 }} duration="auto" xyz={xyz(['fade', { 'delay-5': isXSView }])}> */}
            <div className="px-responsive flex flex-col md:flex-row-reverse items-center md:items-start justify-center gap-10 lg:gap-16 pt-14 pb-20 sm:py-24 md:py-32">
              {/* Profile Picture */}
              {/* @ts-ignore */}
              <figure className="xyz-nested sm:mt-5 flex-grow flex-shrink-0 max-w-40 h-40 w-40 md:h-52 md:w-52 md:max-w-52 rounded-full overflow-hidden" xyz={xyz({ 'inherit small-25%': !isXSView })}>
                <img src="/profile.jpeg" alt="Profile photo" className="-mt-2" />
                <figcaption className="sr-only">Profile photo of Yishai Zehavi</figcaption>
              </figure>

              {/* Description */}
              {/* @ts-ignore */}
              <div className="xyz-nested" xyz={xyz(['inherit left-1', { 'delay-7': isXSView }])}>
                <h1 className="text-heading">About Me</h1>

                <hr className="border-none h-1 bg-ocean rounded-full w-10 my-4 lg:my-5" />

                <div className="flex flex-col gap-4 max-w-2xl">
                  {aboutMe.map((paragraph, index) => (
                    <p key={index} className="text-black !leading-[1.7] font-light tracking-tight lg:text-lg">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          {/* </XyzTransition> */}
        </section>

        {/* Projects Section */}
        <section id="projects" className="bg-white">
          <div className="px-responsive py-14 sm:py-24 md:py-32">
            <h1 className="text-heading">Key Projects</h1>

            <hr className="border-none h-1 bg-ocean rounded-full w-10 my-4 lg:my-5" />

            <ul className="mt-14 grid gap-14">
              {projects.map((project) => (
                <li key={project.name}>
                  <article>
                    <h1 className="text-black text-xl lg:text-2xl">{project.name}</h1>
                    {project.description ? <p className="mt-1 text-gray-600 font-light leading-relaxed max-w-[70ch]">{project.description}</p> : null}
                    <ul className="mt-3 lg:mt-5 flex flex-wrap gap-2 lg:gap-2.5">
                      {project.stack.map((tech) => (
                        <li key={tech} className="bg-foam px-3 py-1.5 rounded-full flex justify-center items-center">
                          <span className="text-xs !leading-none font-medium tracking-wide text-navy/80">{tech}</span>
                        </li>
                      ))}
                    </ul>
                    {project.link 
                    ? (<div className="mt-6 lg:mt-7 flex items-center gap-3.5">
                      {project.link.live 
                      ? <a 
                        href={project.link.live} 
                        target="_blank" 
                        className="text-center text-sm text-white bg-navy border border-navy px-5 py-1.5 rounded min-w-16 sm:hover:-translate-y-1 sm:transition sm:duration-300">
                          View
                        </a> 
                      : null}
                      {project.link.source 
                      ? <a 
                        href={project.link.source} 
                        target="_blank" 
                        className="text-center text-sm text-navy border border-navy px-5 py-1.5 rounded min-w-16 sm:hover:-translate-y-1 sm:transition sm:duration-300">
                          Source
                        </a> 
                      : null}
                    </div>)
                    : null}
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Writing Section */}
        <section id="writing" className="bg-foam">
          <div className="px-responsive py-14 sm:py-24 md:py-32">
            <h1 className="text-heading">Articles</h1>

            <hr className="border-none h-1 bg-ocean rounded-full w-10 my-4 lg:my-5" />

            <ul className="mt-9 grid gap-9 lg:grid-cols-2">
              {articles.map((article) => (
                <li key={article.href} className="grid">
                  <article className="flex flex-col justify-between gap-4 bg-white p-6 rounded-md shadow-md">
                    <h1 className="text-xl font-bold leading-relaxed text-gray-800">{article.title}</h1>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm text-gray-600">Published on:</span>
                        {article.site}
                      </div>
                      <a 
                        href={article.href}
                        target="_blank"
                        className="flex items-center text-ocean">
                        <span className="font-semibold">Read</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="bg-white">
          <div className="px-responsive py-14 sm:py-24 md:py-32">
            <h1 className="text-heading">FAQ</h1>

            <p className="mt-5 text-xl font-light">Coming soon...</p>
            {/* <ul className="mt-5 flex flex-col divide-y divide-gray-300">
              {faqs.map(({ question, answer }) => (
                <FAQ key={question} question={question} answer={answer} />
              ))}
            </ul> */}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="bg-foam">
          <div className="px-responsive py-14 sm:py-24 md:py-32">
            <section className="max-w-screen-md m-auto">
              <h1 className="text-heading">Contact</h1>

              {actionData?.ok ? (
                <div className="mt-8 p-4 bg-white text-navy border border-ocean rounded-lg font-light flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>

                  Your message was sent successfully
                </div>
              ) : <Form method="post" className="mt-9 bg-white rounded-lg px-6 py-10">
                {actionData?.ok === false ? <p className="text-center mb-8 font-medium text-red-600">{actionData.message}</p> : null}
                <fieldset className="flex flex-col gap-8 sm:gap-9 md:gap-11">
                  <label className="flex flex-col gap-2.5">
                    <span className="text-sm font-bold text-ocean tracking-wider">Name</span>
                    <input 
                      type="text" 
                      placeholder="Enter your name" 
                      name="name"
                      className="text-sm font-semibold bg-stone-200/60 px-4 py-4 rounded-md outline-none ring-0focus:outline-1 focus:outline-navy"
                      required
                      aria-required="true" />
                  </label>
                  <label className="flex flex-col gap-2.5">
                    <span className="text-sm font-bold text-ocean tracking-wider">Email</span>
                    <input 
                      type="email" 
                      placeholder="Enter your email"
                      name="email"
                      className="text-sm font-semibold bg-stone-200/60 px-4 py-4 rounded-md outline-none ring-0focus:outline-1 focus:outline-navy"
                      required
                      aria-required="true" />
                  </label>
                  <label className="flex flex-col gap-2.5">
                    <span className="text-sm font-bold text-ocean tracking-wider">Message</span>
                    <textarea 
                      placeholder="Enter your message"
                      rows={9}
                      name="message"
                      className="text-sm font-semibold bg-stone-200/60 px-4 py-4 rounded-md outline-none ring-0focus:outline-1 focus:outline-navy"
                      required
                      aria-required="true"></textarea>
                  </label>
                  <HoneypotInputs label="Please leave this field blank" />
                  <button 
                    type="submit" 
                    className="bg-navy min-w-48 py-3.5 md:py-4 rounded shadow-lg sm:hover:-translate-y-1 sm:transition-transform sm:duration-300 sm:self-end disabled:bg-gray-600"
                    disabled={submittingState === 'submitting'}>
                      <span className="text-white font-bold tracking-wider text-sm">Submit</span>
                    </button>
                </fieldset>
              </Form>}
            </section>
          </div>
        </section>
      </main>
      <footer className="bg-black text-white">
        <div className="px-responsive py-6">
          <div className="flex flex-col items-center gap-7">
            <span className="text-sm font-light">Copyright &copy; {new Date().getFullYear()} - Made by <b>Yishai Zehavi</b></span>

            <ul className="flex items-end gap-4">
              <li>
                <a href="#" aria-describedby="linkedin">
                  <span id="linkedin" className="sr-only">Linkedin</span>
                  <svg fill="#fff" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="h-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="7935ec95c421cee6d86eb22ecd125aef"> <path style={{ display: 'inline', fillRule: 'evenodd', clipRule: 'evenodd' }} d="M116.504,500.219V170.654H6.975v329.564H116.504 L116.504,500.219z M61.751,125.674c38.183,0,61.968-25.328,61.968-56.953c-0.722-32.328-23.785-56.941-61.252-56.941 C24.994,11.781,0.5,36.394,0.5,68.722c0,31.625,23.772,56.953,60.53,56.953H61.751L61.751,125.674z M177.124,500.219 c0,0,1.437-298.643,0-329.564H286.67v47.794h-0.727c14.404-22.49,40.354-55.533,99.44-55.533 c72.085,0,126.116,47.103,126.116,148.333v188.971H401.971V323.912c0-44.301-15.848-74.531-55.497-74.531 c-30.254,0-48.284,20.38-56.202,40.08c-2.897,7.012-3.602,16.861-3.602,26.711v184.047H177.124L177.124,500.219z"> </path> </g> </g></svg>
                </a>
              </li>
              <li>
                <a href="" aria-describedby="github">
                  <span id="github" className="sr-only">Github</span>
                  <svg viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" fill="#fff" className="h-4"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> </defs> <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -7559.000000)" fill="#fff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M94,7399 C99.523,7399 104,7403.59 104,7409.253 C104,7413.782 101.138,7417.624 97.167,7418.981 C96.66,7419.082 96.48,7418.762 96.48,7418.489 C96.48,7418.151 96.492,7417.047 96.492,7415.675 C96.492,7414.719 96.172,7414.095 95.813,7413.777 C98.04,7413.523 100.38,7412.656 100.38,7408.718 C100.38,7407.598 99.992,7406.684 99.35,7405.966 C99.454,7405.707 99.797,7404.664 99.252,7403.252 C99.252,7403.252 98.414,7402.977 96.505,7404.303 C95.706,7404.076 94.85,7403.962 94,7403.958 C93.15,7403.962 92.295,7404.076 91.497,7404.303 C89.586,7402.977 88.746,7403.252 88.746,7403.252 C88.203,7404.664 88.546,7405.707 88.649,7405.966 C88.01,7406.684 87.619,7407.598 87.619,7408.718 C87.619,7412.646 89.954,7413.526 92.175,7413.785 C91.889,7414.041 91.63,7414.493 91.54,7415.156 C90.97,7415.418 89.522,7415.871 88.63,7414.304 C88.63,7414.304 88.101,7413.319 87.097,7413.247 C87.097,7413.247 86.122,7413.234 87.029,7413.87 C87.029,7413.87 87.684,7414.185 88.139,7415.37 C88.139,7415.37 88.726,7417.2 91.508,7416.58 C91.513,7417.437 91.522,7418.245 91.522,7418.489 C91.522,7418.76 91.338,7419.077 90.839,7418.982 C86.865,7417.627 84,7413.783 84,7409.253 C84,7403.59 88.478,7399 94,7399" id="github-[#142]"> </path> </g> </g> </g> </g></svg>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FAQ({ question, answer }: { question: string; answer: string | string[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li>
      <details className="group" open={isOpen} onToggle={(e) => setIsOpen(!isOpen)}>
        <summary className="list-none py-3.5 flex justify-between items-center text-black cursor-pointer hover:underline">
          <span className="text-sm sm:text-base font-bold tracking-wide">{question}</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-3 group-open:rotate-180 transition duration-300">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </summary>
        <XyzTransition duration="auto" xyz="origin-top fade short-100%">
          {isOpen
          ? typeof answer === 'string'
            ? <p className="pb-3 text-sm text-gray-700 max-w-[75ch]">{answer}</p>
            : <div className="pb-3 flex flex-col gap-1">
              {answer.map((para, i) => (
                <p key={i} className="text-sm text-gray-700 max-w-[75ch]">{para}</p>
              ))}
            </div>
          : null}
        </XyzTransition>
      </details>
    </li>
  )
}
